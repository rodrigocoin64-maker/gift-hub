import { createClient } from "npm:@supabase/supabase-js@2.110.8";
import { corsHeaders } from "npm:@supabase/supabase-js@2.110.8/cors";

const allowedFunctions = ["Limpeza", "Assessor", "Programador", "Proprietário", "SDR", "Comercial"];
const TEMPORARY_PASSWORD_VALIDITY_MS = 48 * 60 * 60 * 1000;

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

function publicMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/DIRECTOR_ALREADY_EXISTS/i.test(message)) return "A criação inicial já foi utilizada.";
  if (/already registered|already been registered|user already exists/i.test(message)) return "Já existe uma conta com esse e-mail.";
  return "Não foi possível concluir a operação. Verifique os dados e tente novamente.";
}

function requiredString(value: unknown, label: string, maxLength = 160): string {
  if (typeof value !== "string") throw new Error(`INVALID_${label.toUpperCase()}`);
  const result = value.trim();
  if (!result || result.length > maxLength) throw new Error(`INVALID_${label.toUpperCase()}`);
  return result;
}

function requiredPassword(value: unknown): string {
  if (typeof value !== "string" || value.length < 8 || value.length > 256) {
    throw new Error("INVALID_PASSWORD");
  }
  return value;
}

function generateTemporaryPassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `Aa1!${Array.from(bytes, (byte) => (byte % 36).toString(36)).join("")}`;
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

async function temporaryPasswordProof(password: string): Promise<string> {
  if (!serviceKey) throw new Error("SERVICE_CONFIGURATION_MISSING");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(serviceKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(password)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function tokenHasAuthMethod(token: string, method: string): Promise<boolean> {
  const { data, error } = await adminClient!.auth.getClaims(token);
  if (error) throw error;
  const amr = (data?.claims as Record<string, unknown> | undefined)?.amr;
  return Array.isArray(amr) && amr.some((entry) => (
    typeof entry === "object" && entry !== null && (entry as Record<string, unknown>).method === method
  ));
}

async function readAllRows(table: string, columns: string, orderBy: string, ascending = false): Promise<any[]> {
  const rows: any[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await adminClient!
      .from(table)
      .select(columns)
      .order(orderBy, { ascending })
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < pageSize) return rows;
  }
}

const projectUrl = Deno.env.get("SUPABASE_URL");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || readKeyMap("SUPABASE_SECRET_KEYS");
const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") || readKeyMap("SUPABASE_PUBLISHABLE_KEYS");

if (!projectUrl || !serviceKey) {
  console.error("Required Supabase Edge Function environment variables are missing.");
}

const adminClient = projectUrl && serviceKey
  ? createClient(projectUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse(405, { error: "Método não permitido." });
  if (!adminClient) return jsonResponse(500, { error: "A função ainda não está configurada no Supabase." });

  let createdAuthUserId: string | null = null;
  try {
    const body = await request.json();
    const action = requiredString(body?.action, "action", 40);

    const authorization = request.headers.get("Authorization") || "";
    const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return jsonResponse(401, { error: "Entre novamente para continuar." });

    const { data: authData, error: erroAuth } = await adminClient.auth.getUser(token);
    if (erroAuth || !authData.user) return jsonResponse(401, { error: "Sua sessão não é válida. Entre novamente." });

    if (action === "check_employee_first_access") {
      const { data: funcionario, error: erroFuncionario } = await adminClient
        .from("Funcionarios")
        .select("id, primeiro_acesso, primeiro_acesso_expira_em")
        .eq("auth_user_id", authData.user.id)
        .maybeSingle();
      if (erroFuncionario) throw erroFuncionario;
      if (!funcionario) return jsonResponse(403, { error: "Esta conta não está vinculada a um funcionário." });
      if (funcionario.primeiro_acesso !== true) return jsonResponse(200, { firstAccess: false });

      const expiresAt = typeof funcionario.primeiro_acesso_expira_em === "string"
        ? Date.parse(funcionario.primeiro_acesso_expira_em)
        : Number.NaN;
      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        // Um link de recuperação validado pelo Auth (claim AMR "recovery") continua
        // permitindo que o próprio titular recupere uma conta cujo convite expirou.
        if (await tokenHasAuthMethod(token, "recovery")) {
          return jsonResponse(200, {
            firstAccess: true,
            expired: false,
            recovery: true,
            expiresAt: funcionario.primeiro_acesso_expira_em,
          });
        }

        // No texto claro é gravado. Na primeira tentativa pela aplicação após o prazo,
        // substitui a senha Auth por um segredo descartável e revoga refresh tokens.
        const { error: erroRotacao } = await adminClient.auth.admin.updateUserById(authData.user.id, {
          password: generateTemporaryPassword(),
          app_metadata: {
            ...authData.user.app_metadata,
            employee_first_access: true,
            employee_first_access_expired: true,
          },
        });
        if (erroRotacao) throw erroRotacao;

        const { error: erroRevogacao } = await adminClient.auth.admin.signOut(token, "global");
        if (erroRevogacao) console.error("Expired employee sessions could not all be revoked.");
        return jsonResponse(200, { firstAccess: true, expired: true });
      }

      return jsonResponse(200, { firstAccess: true, expired: false, expiresAt: funcionario.primeiro_acesso_expira_em });
    }

    if (action === "complete_employee_first_access") {
      const newPassword = requiredPassword(body?.newPassword);
      if (!/[A-Za-zÀ-ÿ]/.test(newPassword) || !/\d/.test(newPassword)) {
        return jsonResponse(400, { error: "A senha não atende aos requisitos de segurança." });
      }
      if (!publishableKey) return jsonResponse(503, { error: "A verificação da senha não está configurada no servidor." });

      const { data: funcionario, error: erroFuncionario } = await adminClient
        .from("Funcionarios")
        .select("id, primeiro_acesso, primeiro_acesso_expira_em")
        .eq("auth_user_id", authData.user.id)
        .maybeSingle();
      if (erroFuncionario) throw erroFuncionario;

      const recoverySession = await tokenHasAuthMethod(token, "recovery");
      if (funcionario?.primeiro_acesso === true && !recoverySession) {
        const expiresAt = typeof funcionario.primeiro_acesso_expira_em === "string"
          ? Date.parse(funcionario.primeiro_acesso_expira_em)
          : Number.NaN;
        if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
          return jsonResponse(410, { error: "A senha temporária expirou. Solicite ao Diretor um novo acesso." });
        }
      }

      // Diretores e funcionários já ativados podem usar o fluxo oficial de recuperação
      // sem que a ação altere o estado de primeiro acesso de outra conta.
      if (!funcionario || funcionario.primeiro_acesso !== true) {
        const authVerifier = createClient(projectUrl!, publishableKey, {
          auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
        });
        const { error: erroVerificacaoSenha } = await authVerifier.auth.signInWithPassword({
          email: authData.user.email || "",
          password: newPassword,
        });
        if (erroVerificacaoSenha) {
          return jsonResponse(409, { error: "A nova senha ainda não foi confirmada pelo Supabase Auth. Tente novamente." });
        }

        const requiresFreshLogin = authData.user.app_metadata?.employee_first_access === true;
        if (requiresFreshLogin) {
          const { error: erroRevogacao } = await adminClient.auth.admin.signOut(token, "global");
          if (erroRevogacao) throw erroRevogacao;
        }

        const { error: erroAtualizacaoMetadata } = await adminClient.auth.admin.updateUserById(authData.user.id, {
          app_metadata: {
            ...authData.user.app_metadata,
            employee_first_access: false,
            employee_first_access_expired: null,
            temporary_password_proof: null,
          },
        });
        if (erroAtualizacaoMetadata) throw erroAtualizacaoMetadata;
        return jsonResponse(200, { completed: true, requiresFreshLogin });
      }

      const proofSalvo = authData.user.app_metadata?.temporary_password_proof;
      if (typeof proofSalvo !== "string" || !proofSalvo) {
        return jsonResponse(409, { error: "Não foi possível validar a senha temporária desta conta. Solicite ajuda ao Diretor." });
      }
      if (constantTimeEqual(await temporaryPasswordProof(newPassword), proofSalvo)) {
        return jsonResponse(400, { error: "A senha definitiva deve ser diferente da senha temporária." });
      }

      const authVerifier = createClient(projectUrl!, publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
      });
      const { error: erroVerificacaoSenha } = await authVerifier.auth.signInWithPassword({
        email: authData.user.email || "",
        password: newPassword,
      });
      if (erroVerificacaoSenha) {
        return jsonResponse(409, { error: "A nova senha ainda não foi confirmada pelo Supabase Auth. Tente novamente." });
      }

      // Revoga os refresh tokens antes de liberar o funcionário no banco. Se a
      // revogação falhar, primeiro_acesso continua ativo e todas as rotas seguem bloqueadas.
      const { error: erroRevogacao } = await adminClient.auth.admin.signOut(token, "global");
      if (erroRevogacao) throw erroRevogacao;

      const { data: ativado, error: erroAtivacao } = await adminClient
        .from("Funcionarios")
        .update({
          primeiro_acesso: false,
          primeiro_acesso_expira_em: null,
          primeiro_acesso_concluido_em: new Date(Date.now() + 2000).toISOString(),
        })
        .eq("id", funcionario.id)
        .eq("auth_user_id", authData.user.id)
        .eq("primeiro_acesso", true)
        .select("id")
        .maybeSingle();
      if (erroAtivacao) throw erroAtivacao;

      if (!ativado) {
        const { data: estadoAtual, error: erroEstadoAtual } = await adminClient
          .from("Funcionarios")
          .select("primeiro_acesso")
          .eq("id", funcionario.id)
          .eq("auth_user_id", authData.user.id)
          .maybeSingle();
        if (erroEstadoAtual) throw erroEstadoAtual;
        if (estadoAtual?.primeiro_acesso !== false) throw new Error("FIRST_ACCESS_ACTIVATION_FAILED");
      }

      const { error: erroLimpezaComprovante } = await adminClient.auth.admin.updateUserById(authData.user.id, {
        app_metadata: {
          ...authData.user.app_metadata,
          employee_first_access: false,
          employee_first_access_expired: null,
          temporary_password_proof: null,
        },
      });
      if (erroLimpezaComprovante) throw erroLimpezaComprovante;

      return jsonResponse(200, { completed: true, requiresFreshLogin: true });
    }

    const { data: perfil, error: erroPerfil } = await adminClient
      .from("perfis")
      .select("auth_user_id, tipo")
      .eq("auth_user_id", authData.user.id)
      .eq("tipo", "diretor")
      .maybeSingle();
    if (erroPerfil) throw erroPerfil;
    if (!perfil) return jsonResponse(403, { error: "Esta conta não possui acesso administrativo." });

    if (action === "delete_employee") {
      const funcionarioId = requiredString(body?.funcionarioId, "funcionario_id", 20);
      if (!/^\d+$/.test(funcionarioId) || /^0+$/.test(funcionarioId)) {
        return jsonResponse(400, { error: "Selecione um funcionário válido." });
      }

      const { data: funcionario, error: erroFuncionario } = await adminClient
        .from("Funcionarios")
        .select("id, nome, auth_user_id")
        .eq("id", funcionarioId)
        .maybeSingle();
      if (erroFuncionario) throw erroFuncionario;
      if (!funcionario) return jsonResponse(404, { error: "O funcionário selecionado não existe mais." });

      if (funcionario.auth_user_id) {
        const { data: perfilDiretor, error: erroPerfilDiretor } = await adminClient
          .from("perfis")
          .select("auth_user_id")
          .eq("auth_user_id", funcionario.auth_user_id)
          .eq("tipo", "diretor")
          .maybeSingle();
        if (erroPerfilDiretor) throw erroPerfilDiretor;
        if (perfilDiretor) return jsonResponse(403, { error: "A conta de Diretor não pode ser excluída como funcionário." });

        const { data: authUser, error: erroBuscaAuth } = await adminClient.auth.admin.getUserById(funcionario.auth_user_id);
        const usuarioAuthAusente = erroBuscaAuth
          && (erroBuscaAuth.status === 404 || /user.*not found|not found.*user/i.test(erroBuscaAuth.message || ""));
        if (erroBuscaAuth && !usuarioAuthAusente) throw erroBuscaAuth;

        if (authUser?.user) {
          const { error: erroExclusaoAuth } = await adminClient.auth.admin.deleteUser(funcionario.auth_user_id);
          const usuarioJaExcluido = erroExclusaoAuth
            && (erroExclusaoAuth.status === 404 || /user.*not found|not found.*user/i.test(erroExclusaoAuth.message || ""));
          if (erroExclusaoAuth && !usuarioJaExcluido) throw erroExclusaoAuth;
        }
      }

      const { data: resultadoExclusao, error: erroExclusaoDados } = await adminClient.rpc("excluir_funcionario", {
        p_funcionario_id: funcionarioId,
      });
      if (erroExclusaoDados) {
        console.error("Employee Auth account was removed, but database cleanup failed:", erroExclusaoDados);
        return jsonResponse(500, {
          error: "A conta de acesso foi removida, mas a exclusão dos registros ainda não terminou. Tente novamente.",
        });
      }

      return jsonResponse(200, {
        deleted: true,
        funcionarioId: String(funcionario.id),
        nome: funcionario.nome,
        pontosExcluidos: resultadoExclusao?.pontosExcluidos ?? 0,
      });
    }

    if (action === "create_employee" || action === "create_employee_test") {
      const teste = action === "create_employee_test";
      const nome = teste ? "Funcionário Teste" : requiredString(body?.nome, "nome", 120);
      const email = teste
        ? `funcionario.teste.${crypto.randomUUID().replaceAll("-", "").slice(0, 18)}@example.com`
        : requiredString(body?.email, "email", 254).toLowerCase();
      const password = generateTemporaryPassword();
      const passwordProof = await temporaryPasswordProof(password);
      const funcao = teste ? "SDR" : requiredString(body?.funcao, "funcao", 40);
      if (!allowedFunctions.includes(funcao)) return jsonResponse(400, { error: "Selecione uma função válida." });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonResponse(400, { error: "Informe um e-mail válido." });

      const { data: userData, error: erroCriacao } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: nome },
        app_metadata: {
          employee_first_access: true,
          temporary_password_proof: passwordProof,
        },
      });
      if (erroCriacao) throw erroCriacao;
      createdAuthUserId = userData.user.id;

      const expiresAt = new Date(Date.now() + TEMPORARY_PASSWORD_VALIDITY_MS).toISOString();
      const { data: funcionario, error: erroFuncionario } = await adminClient
        .from("Funcionarios")
        .insert({
          nome,
          funcao,
          auth_user_id: createdAuthUserId,
          primeiro_acesso: true,
          primeiro_acesso_expira_em: expiresAt,
          primeiro_acesso_concluido_em: null,
        })
        .select("id, nome, funcao, auth_user_id, created_at, primeiro_acesso_expira_em")
        .single();
      if (erroFuncionario) {
        await adminClient.auth.admin.deleteUser(createdAuthUserId);
        createdAuthUserId = null;
        throw erroFuncionario;
      }

      return jsonResponse(201, {
        funcionario: { ...funcionario, email, ativo: true },
        temporaryPassword: password,
      });
    }

    if (action === "dashboard") {
      const [funcionarios, pontos, diretores] = await Promise.all([
        readAllRows("Funcionarios", "id, created_at, nome, funcao, auth_user_id", "nome", true),
        readAllRows("pontos", "id, funcionario_id, entrada, saida", "entrada"),
        adminClient.from("perfis").select("auth_user_id").eq("tipo", "diretor"),
      ]);
      if (diretores.error) throw diretores.error;

      const idsDiretores = new Set((diretores.data || []).map((diretor) => diretor.auth_user_id));
      const funcionariosDaEquipe = funcionarios.filter((funcionario) => !idsDiretores.has(funcionario.auth_user_id));
      const funcionariosComEmail = await Promise.all(funcionariosDaEquipe.map(async (funcionario) => {
        if (!funcionario.auth_user_id) return { ...funcionario, email: "", ativo: false };
        const { data: userData, error: erroUsuario } = await adminClient.auth.admin.getUserById(funcionario.auth_user_id);
        if (erroUsuario) {
          console.error("Unable to resolve employee account status:", erroUsuario);
          return { ...funcionario, email: "", ativo: false };
        }
        const suspenso = userData.user.banned_until && new Date(userData.user.banned_until) > new Date();
        return { ...funcionario, email: userData.user.email || "", ativo: !suspenso };
      }));

      return jsonResponse(200, { funcionarios: funcionariosComEmail, pontos });
    }

    return jsonResponse(400, { error: "Ação desconhecida." });
  } catch (error) {
    console.error("admin Edge Function error:", error);
    if (createdAuthUserId) {
      const { error: erroExclusao } = await adminClient.auth.admin.deleteUser(createdAuthUserId);
      if (erroExclusao) console.error("Failed to roll back newly created Auth user:", erroExclusao);
    }
    return jsonResponse(400, { error: publicMessage(error) });
  }
});
