/* supabase: responsabilidades do supabase. */

// Chave pública apropriada para uso no navegador. Nunca coloque aqui uma secret/service_role key.
const SUPABASE_URL = 'https://dyjldrcoeureqpaacjqs.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_3qrgOpcGpfm1_Oy8KbYeTQ_1L5WrdBJ";
const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

function registrarErroSupabase(operacao, erro) {
    console.error(`[Supabase] ${operacao}`, erro, {
        name: erro?.name ?? null,
        message: erro?.message ?? null,
        status: erro?.status ?? erro?.statusCode ?? null,
        statusText: erro?.statusText ?? null,
        code: erro?.code ?? null,
        details: erro?.details ?? null,
        hint: erro?.hint ?? null,
        cause: erro?.cause ?? null
    });
}

let supabaseClient = null;
try {
    if (supabaseConfigurado && window.supabase?.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            auth: {
                // A sessão continua sendo gerenciada pelo Supabase Auth e sobrevive ao reload da aba,
                // sem guardar autenticação em localStorage da aplicação.
                storage: window.sessionStorage,
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
    }
} catch (erro) {
    registrarErroSupabase("erro ao inicializar o cliente", erro);
}

console.info("[Supabase] diagnóstico de inicialização", {
    supabaseUrl: SUPABASE_URL,
    publishableKeyConfigurada: SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_"),
    bibliotecaCarregada: Boolean(window.supabase?.createClient),
    clienteInicializado: Boolean(supabaseClient)
});
if (!window.supabase?.createClient) {
    console.error("[Supabase] @supabase/supabase-js não está disponível em window.supabase.");
}
