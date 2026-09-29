import { createClient } from "npm:@supabase/supabase-js@2.110.8";
import { corsHeaders } from "npm:@supabase/supabase-js@2.110.8/cors";

function readKeyMap(name: string): string | null {
  const value = Deno.env.get(name);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Record<string, string>;
    return parsed.default || Object.values(parsed)[0] || null;
  } catch {
    return value;
  }
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function requiredString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") throw new Error("INVALID_INPUT");
  const result = value.trim();
  if (!result || result.length > maxLength) throw new Error("INVALID_INPUT");
  return result;
}

function requiredPassword(value: unknown): string {
  if (typeof value !== "string" || value.length < 8 || value.length > 256) {
    throw new Error("INVALID_INPUT");
  }
  return value;
}

function constantTimeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index++) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }
  return difference === 0;
}

const projectUrl = Deno.env.get("SUPABASE_URL");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || readKeyMap("SUPABASE_SECRET_KEYS");
const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") || readKeyMap("SUPABASE_PUBLISHABLE_KEYS");
const adminClient = projectUrl && serviceKey
  ? createClient(projectUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse(405, { error: "Método não permitido." });
  if (!adminClient || !projectUrl) return jsonResponse(500, { error: "A função ainda não está configurada no Supabase." });

  let createdAuthUserId: string | null = null;
  try {
    // Está desligado por padrão. Só habilite temporariamente, antes do primeiro Diretor.
    if (Deno.env.get("DIRECTOR_BOOTSTRAP_ENABLED")?.toLowerCase() !== "true") {
      return jsonResponse(410, { error: "O cadastro inicial de Diretor está desativado." });
    }

    const body = await request.json();
    const nome = requiredString(body?.nome, 120);
    const email = requiredString(body?.email, 254).toLowerCase();
    const password = requiredPassword(body?.password);
    const bootstrapCode = requiredString(body?.bootstrapCode, 256);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(400, { error: "Informe um e-mail válido." });
    }

    const { count, error: erroContagem } = await adminClient
      .from("perfis")
      .select("id", { count: "exact", head: true })
      .eq("tipo", "diretor");
    if (erroContagem) throw erroContagem;
    if ((count ?? 0) > 0) return jsonResponse(409, { error: "A criação inicial já foi utilizada." });

    const bootstrapEmail = Deno.env.get("DIRECTOR_BOOTSTRAP_EMAIL")?.trim().toLowerCase();
    const expectedBootstrapCode = Deno.env.get("DIRECTOR_BOOTSTRAP_CODE");
    if (!bootstrapEmail || !expectedBootstrapCode) {
      return jsonResponse(503, { error: "O primeiro acesso administrativo ainda não foi configurado." });
    }
    if (email !== bootstrapEmail || !constantTimeEqual(bootstrapCode, expectedBootstrapCode)) {
      return jsonResponse(403, { error: "Este e-mail não está autorizado para o primeiro acesso administrativo." });
    }

    const { data: userData, error: erroCriacao } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: nome },
    });
    if (erroCriacao) {
      if (/already registered|already been registered|user already exists/i.test(erroCriacao.message)) {
        return jsonResponse(409, { error: "Já existe uma conta com esse e-mail." });
      }
      throw erroCriacao;
    }
    createdAuthUserId = userData.user.id;

    const { error: erroPerfil } = await adminClient.rpc("bootstrap_director", {
      p_auth_user_id: createdAuthUserId,
      p_nome: nome,
      p_email: email,
    });
    if (erroPerfil) {
      if (/DIRECTOR_ALREADY_EXISTS/i.test(erroPerfil.message)) throw new Error("DIRECTOR_ALREADY_EXISTS");
      throw erroPerfil;
    }

    if (publishableKey) {
      const authClient = createClient(projectUrl, publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
      });
      const { data: sessionData, error: erroLogin } = await authClient.auth.signInWithPassword({ email, password });
      if (!erroLogin && sessionData.session) {
        createdAuthUserId = null;
        return jsonResponse(201, {
          created: true,
          session: {
            access_token: sessionData.session.access_token,
            refresh_token: sessionData.session.refresh_token,
          },
        });
      }
    }

    createdAuthUserId = null;
    return jsonResponse(201, { created: true, requiresLogin: true });
  } catch (error) {
    // Não registrar body, senha, código de bootstrap, ID de usuário ou tokens.
    const diretorJaExiste = error instanceof Error && /DIRECTOR_ALREADY_EXISTS/i.test(error.message);
    let rollbackFalhou = false;
    if (createdAuthUserId && adminClient) {
      const { error: erroExclusao } = await adminClient.auth.admin.deleteUser(createdAuthUserId);
      if (erroExclusao) {
        rollbackFalhou = true;
        console.error("Bootstrap rollback failed for a newly created Auth user.");
      }
    }
    return rollbackFalhou
      ? jsonResponse(500, { error: "Não foi possível concluir nem reverter o cadastro. Revise o usuário Auth antes de tentar novamente." })
      : diretorJaExiste
      ? jsonResponse(409, { error: "A criação inicial já foi utilizada." })
      : jsonResponse(400, { error: "Não foi possível concluir o primeiro cadastro administrativo." });
  }
});
