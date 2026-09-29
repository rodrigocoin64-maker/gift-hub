const RAIO_PERMITIDO = 100;

const botaoEntrada = document.getElementById("botaoEntrada");
const botaoSaida = document.getElementById("botaoSaida");
const status = document.getElementById("status");
const statusBox = document.getElementById("statusBox");
const locationBadge = document.getElementById("locationBadge");
const locationLabel = document.getElementById("locationLabel");
const locationDetail = document.getElementById("locationDetail");
const listaRegistros = document.getElementById("listaRegistros");
const emptyRecords = document.getElementById("emptyRecords");
const historicoPonto = document.getElementById("historicoPonto");
const formFuncionario = document.getElementById("formFuncionario");
const nomeCadastro = document.getElementById("nomeCadastro");
const funcaoCadastro = document.getElementById("funcaoCadastro");
const funcaoTrigger = document.getElementById("funcaoTrigger");
const funcaoSelecionada = document.getElementById("funcaoSelecionada");
const funcaoMenu = document.getElementById("funcaoMenu");
const funcaoOpcoes = Array.from(funcaoMenu.querySelectorAll("[role='option']"));
const functionPicker = funcaoTrigger.parentElement;
const statusCadastro = document.getElementById("statusCadastro");
const funcionarioSalvo = document.getElementById("funcionarioSalvo");
const nomeFuncionarioSalvo = document.getElementById("nomeFuncionarioSalvo");
const funcaoFuncionarioSalvo = document.getElementById("funcaoFuncionarioSalvo");
const nomeFuncionarioPerfil = document.getElementById("nomeFuncionario");
const funcionarioAtivoSelect = document.getElementById("funcionarioAtivo");
const loginView = document.getElementById("loginView");
const firstAccessView = document.getElementById("firstAccessView");
const appShell = document.getElementById("appShell");
const directorShell = document.getElementById("directorShell");
const formLogin = document.getElementById("formLogin");
const mostrarRecuperacaoSenhaButton = document.getElementById("mostrarRecuperacaoSenha");
const formRecuperacaoSenha = document.getElementById("formRecuperacaoSenha");
const emailRecuperacaoSenha = document.getElementById("emailRecuperacaoSenha");
const botaoRecuperacaoSenha = document.getElementById("botaoRecuperacaoSenha");
const statusRecuperacaoSenha = document.getElementById("statusRecuperacaoSenha");
const voltarLoginRecuperacaoButton = document.getElementById("voltarLoginRecuperacao");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const firstAccessTitle = document.getElementById("firstAccessTitle");
const firstAccessKicker = document.getElementById("firstAccessKicker");
const firstAccessDescription = document.getElementById("firstAccessDescription");
const formNovaSenha = document.getElementById("formNovaSenha");
const novaSenhaDefinitiva = document.getElementById("novaSenhaDefinitiva");
const confirmarNovaSenha = document.getElementById("confirmarNovaSenha");
const botaoCriarSenhaDefinitiva = document.getElementById("botaoCriarSenhaDefinitiva");
const statusNovaSenha = document.getElementById("statusNovaSenha");
const botaoSairTrocaSenha = document.getElementById("botaoSairTrocaSenha");
const requisitosSenha = {
    tamanho: document.getElementById("requisitoTamanho"),
    letra: document.getElementById("requisitoLetra"),
    numero: document.getElementById("requisitoNumero")
};
const loginKicker = document.getElementById("loginKicker");
const loginTitle = document.getElementById("loginTitle");
const loginDescription = document.getElementById("loginDescription");
const loginStatus = document.getElementById("loginStatus");
const botaoLogin = document.getElementById("botaoLogin");
const modoFuncionarioButton = document.getElementById("modoFuncionario");
const modoDiretorButton = document.getElementById("modoDiretor");
const alternarSenhaButton = document.getElementById("alternarSenha");
const mostrarCadastroDiretorButton = document.getElementById("mostrarCadastroDiretor");
const formCadastroDiretor = document.getElementById("formCadastroDiretor");
const nomeDiretorCadastro = document.getElementById("nomeDiretorCadastro");
const emailDiretorCadastro = document.getElementById("emailDiretorCadastro");
const senhaDiretorCadastro = document.getElementById("senhaDiretorCadastro");
const confirmarSenhaDiretor = document.getElementById("confirmarSenhaDiretor");
const codigoBootstrapDiretor = document.getElementById("codigoBootstrapDiretor");
const cadastroDiretorStatus = document.getElementById("cadastroDiretorStatus");
const voltarLoginDiretorButton = document.getElementById("voltarLoginDiretor");
const botaoSair = document.getElementById("botaoSair");
const botaoSairDiretor = document.getElementById("botaoSairDiretor");
const boasVindas = document.getElementById("boasVindas");
const directorGreeting = document.getElementById("directorGreeting");
const directorEmail = document.getElementById("directorEmail");
const totalFuncionarios = document.getElementById("totalFuncionarios");
const presencasHoje = document.getElementById("presencasHoje");
const presencasSemana = document.getElementById("presencasSemana");
const presencasMes = document.getElementById("presencasMes");
const trabalhandoAgora = document.getElementById("trabalhandoAgora");
const listaFuncionariosDiretor = document.getElementById("listaFuncionariosDiretor");
const deleteEmployeeDialog = document.getElementById("deleteEmployeeDialog");
const deleteEmployeeName = document.getElementById("deleteEmployeeName");
const deleteEmployeeStatus = document.getElementById("deleteEmployeeStatus");
const cancelDeleteEmployeeButton = document.getElementById("cancelDeleteEmployee");
const confirmDeleteEmployeeButton = document.getElementById("confirmDeleteEmployee");
const filtroFuncionario = document.getElementById("filtroFuncionario");
const filtroPeriodo = document.getElementById("filtroPeriodo");
const filtroMes = document.getElementById("filtroMes");
const filtroDataInicio = document.getElementById("filtroDataInicio");
const filtroDataFim = document.getElementById("filtroDataFim");
const aplicarFiltrosButton = document.getElementById("aplicarFiltros");
const statusDashboard = document.getElementById("statusDashboard");
const alternarFormularioFuncionarioButton = document.getElementById("alternarFormularioFuncionario");
const formNovoFuncionario = document.getElementById("formNovoFuncionario");
const novoFuncionarioNome = document.getElementById("novoFuncionarioNome");
const novoFuncionarioEmail = document.getElementById("novoFuncionarioEmail");
const novaFuncaoFuncionario = document.getElementById("novaFuncaoFuncionario");
const statusNovoFuncionario = document.getElementById("statusNovoFuncionario");
const criarFuncionarioTesteButton = document.getElementById("criarFuncionarioTeste");
const employeeCredentialsDialog = document.getElementById("employeeCredentialsDialog");
const credentialEmployeeName = document.getElementById("credentialEmployeeName");
const credentialEmployeeEmail = document.getElementById("credentialEmployeeEmail");
const credentialEmployeePassword = document.getElementById("credentialEmployeePassword");
const credentialsCopyStatus = document.getElementById("credentialsCopyStatus");
const copyEmployeeCredentialsButton = document.getElementById("copyEmployeeCredentials");
const closeEmployeeCredentialsButton = document.getElementById("closeEmployeeCredentials");
const detalheFuncionarioDiretor = document.getElementById("detalheFuncionarioDiretor");
const detalheFuncionarioTitulo = document.getElementById("detalheFuncionarioTitulo");
const detalheFuncionarioContato = document.getElementById("detalheFuncionarioContato");
const detalheDiasMes = document.getElementById("detalheDiasMes");
const detalheHorasMes = document.getElementById("detalheHorasMes");
const detalheDiasSemana = document.getElementById("detalheDiasSemana");
const detalheHorasSemana = document.getElementById("detalheHorasSemana");
const detalheMediaEntrada = document.getElementById("detalheMediaEntrada");
const detalheMediaSaida = document.getElementById("detalheMediaSaida");
const resumoSemanalDiretor = document.getElementById("resumoSemanalDiretor");
const historicoFuncionarioDiretor = document.getElementById("historicoFuncionarioDiretor");
const fecharDetalheFuncionarioButton = document.getElementById("fecharDetalheFuncionario");
const estadoJornada = document.getElementById("estadoJornada");
const estadoJornadaTitulo = document.getElementById("estadoJornadaTitulo");
const estadoJornadaDetalhe = document.getElementById("estadoJornadaDetalhe");
const FUNCOES_FUNCIONARIO = ["Limpeza", "Assessor", "Programador", "Proprietário", "SDR", "Comercial"];
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
let funcionarioCadastrado = null;
let funcionariosDisponiveis = [];
let funcionariosCarregados = false;
let registrosPonto = [];
let verificacaoEmAndamento = false;
let salvandoFuncionario = false;
let operacaoPontoEmAndamento = false;
let pontosCarregados = false;
let consultaJornadaEmAndamento = false;
let versaoConsultaJornada = 0;
let usuarioAutenticado = null;
let versaoFluxoAutenticacao = 0;
let modoAcesso = "funcionario";
let modoFluxoSenha = "first_access";
let recuperacaoSenhaAoCarregar = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("type") === "recovery";
let dadosPainelDiretor = { funcionarios: [], pontos: [] };
let funcionarioDetalhadoAtual = null;
let funcionarioPendenteExclusao = null;
let exclusaoFuncionarioEmAndamento = false;

function atualizarSeletorFuncao(funcao) {
    if (!FUNCOES_FUNCIONARIO.includes(funcao)) return;

    funcaoCadastro.value = funcao;
    funcaoSelecionada.textContent = funcao;
    funcaoOpcoes.forEach(function (opcao) {
        const selecionada = opcao.dataset.value === funcao;
        opcao.setAttribute("aria-selected", String(selecionada));
        opcao.classList.toggle("is-selected", selecionada);
    });
}

function fecharSeletorFuncao(devolverFoco = false) {
    funcaoMenu.hidden = true;
    funcaoTrigger.setAttribute("aria-expanded", "false");
    if (devolverFoco) funcaoTrigger.focus();
}

function abrirSeletorFuncao(focarOpcao = true) {
    funcaoMenu.hidden = false;
    funcaoTrigger.setAttribute("aria-expanded", "true");
    if (focarOpcao) {
        const atual = funcaoOpcoes.find((opcao) => opcao.dataset.value === funcaoCadastro.value);
        if (atual) atual.focus();
    }
}

funcaoTrigger.addEventListener("click", function () {
    if (funcaoMenu.hidden) abrirSeletorFuncao();
    else fecharSeletorFuncao();
});

funcaoTrigger.addEventListener("keydown", function (evento) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
        evento.preventDefault();
        abrirSeletorFuncao();
    } else if (evento.key === "Escape" && !funcaoMenu.hidden) {
        evento.preventDefault();
        fecharSeletorFuncao(true);
    }
});

funcaoOpcoes.forEach(function (opcao, indice) {
    opcao.addEventListener("click", function () {
        atualizarSeletorFuncao(opcao.dataset.value);
        fecharSeletorFuncao(true);
    });

    opcao.addEventListener("keydown", function (evento) {
        if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
            evento.preventDefault();
            const direcao = evento.key === "ArrowDown" ? 1 : -1;
            const proximoIndice = (indice + direcao + funcaoOpcoes.length) % funcaoOpcoes.length;
            funcaoOpcoes[proximoIndice].focus();
        } else if (evento.key === "Home" || evento.key === "End") {
            evento.preventDefault();
            funcaoOpcoes[evento.key === "Home" ? 0 : funcaoOpcoes.length - 1].focus();
        } else if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            atualizarSeletorFuncao(opcao.dataset.value);
            fecharSeletorFuncao(true);
        } else if (evento.key === "Escape") {
            evento.preventDefault();
            fecharSeletorFuncao(true);
        }
    });
});

document.addEventListener("click", function (evento) {
    if (!functionPicker.contains(evento.target)) fecharSeletorFuncao();
});

functionPicker.addEventListener("focusout", function (evento) {
    if (!functionPicker.contains(evento.relatedTarget)) fecharSeletorFuncao();
});

atualizarSeletorFuncao(funcaoCadastro.value);

function funcionarioValido(dados) {
    return dados
        && typeof dados.nome === "string"
        && dados.nome.trim().length > 0
        && FUNCOES_FUNCIONARIO.includes(dados.funcao);
}

function horaLocalAtual(instante = new Date()) {
    return instante.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function minutosTrabalhados(registro, agora = new Date()) {
    const entrada = new Date(registro?.entrada);
    const saida = registro?.saida ? new Date(registro.saida) : agora;
    if (Number.isNaN(entrada.getTime()) || Number.isNaN(saida.getTime())) return null;
    return Math.max(0, Math.round((saida - entrada) / 60000));
}

function formatarDuracao(registro, agora = new Date()) {
    const minutos = minutosTrabalhados(registro, agora);
    if (minutos === null) return "—";
    return `${Math.floor(minutos / 60)}h ${String(minutos % 60).padStart(2, "0")}m${registro.saida ? "" : " · em andamento"}`;
}

function buscarFuncionarioAtivo() {
    return usuarioAutenticado && funcionarioCadastrado
        && funcionarioCadastrado.auth_user_id === usuarioAutenticado.id
        ? funcionarioCadastrado
        : null;
}

function renderizarSeletorFuncionarios(funcionario = funcionarioCadastrado) {
    funcionarioAtivoSelect.replaceChildren();
    const opcaoInicial = document.createElement("option");
    if (!funcionario) {
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Entre para identificar o funcionário";
        funcionarioAtivoSelect.append(opcaoInicial);
        funcionarioAtivoSelect.value = "";
        funcionarioAtivoSelect.disabled = true;
        return;
    }
        const opcao = document.createElement("option");
        opcao.value = String(funcionario.id);
        opcao.textContent = `${funcionario.nome} · ${funcionario.funcao}`;
    funcionarioAtivoSelect.append(opcao);
    funcionarioAtivoSelect.value = String(funcionario.id);
    funcionarioAtivoSelect.disabled = true;
}

function atualizarFuncionarioAtivo() {
    const funcionario = buscarFuncionarioAtivo();
    renderizarSeletorFuncionarios(funcionario);
    exibirFuncionario(funcionario);
    sincronizarBotoesPonto(true);
    renderizarHistorico();
    void consultarJornadaAbertaSupabase();
}

function buscarJornadaAberta(funcionarioId = funcionarioCadastrado?.id) {
    for (let indice = registrosPonto.length - 1; indice >= 0; indice--) {
        const registro = registrosPonto[indice];
        if (String(registro.funcionario_id) === String(funcionarioId) && registro.entrada && !registro.saida) return { indice, registro };
    }
    return null;
}

function mostrarEstadoJornada(estado, registro = null) {
    estadoJornada.className = `shift-status shift-status-${estado}`;
    if (estado === "on" && registro) {
        estadoJornadaTitulo.textContent = "EM EXPEDIENTE";
        estadoJornadaDetalhe.textContent = `Entrada às ${horaLocalAtual(new Date(registro.entrada))}. Registre a saída ao finalizar.`;
    } else if (estado === "off") {
        estadoJornadaTitulo.textContent = "FORA DO EXPEDIENTE";
        estadoJornadaDetalhe.textContent = "Pronto para registrar uma nova entrada.";
    } else if (estado === "error") {
        estadoJornadaTitulo.textContent = "STATUS INDISPONÍVEL";
        estadoJornadaDetalhe.textContent = "Não foi possível consultar o expediente no servidor.";
    } else {
        estadoJornadaTitulo.textContent = "CONSULTANDO EXPEDIENTE";
        estadoJornadaDetalhe.textContent = "Carregando o status do funcionário.";
    }
}

async function consultarJornadaAbertaSupabase() {
    const funcionario = funcionarioCadastrado;
    const versao = ++versaoConsultaJornada;
    if (!funcionario) {
        consultaJornadaEmAndamento = false;
        mostrarEstadoJornada("off");
        sincronizarBotoesPonto();
        return;
    }
    if (!supabaseClient || !pontosCarregados) {
        mostrarEstadoJornada("loading");
        return;
    }

    consultaJornadaEmAndamento = true;
    mostrarEstadoJornada("loading");
    sincronizarBotoesPonto();
    try {
        const { data, error } = await supabaseClient
            .from("pontos")
            .select("id, funcionario_id, entrada, saida")
            .eq("funcionario_id", funcionario.id)
            .is("saida", null)
            .order("entrada", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        if (versao !== versaoConsultaJornada || String(funcionarioCadastrado?.id) !== String(funcionario.id)) return;

        registrosPonto = registrosPonto.filter((registro) => !(
            String(registro.funcionario_id) === String(funcionario.id) && !registro.saida
        ));
        if (data) registrosPonto.unshift(data);
        renderizarHistorico();
        mostrarEstadoJornada(data ? "on" : "off", data);
    } catch (erro) {
        if (versao !== versaoConsultaJornada) return;
        registrarErroSupabase("erro ao consultar a jornada aberta", erro);
        mostrarEstadoJornada("error");
    } finally {
        if (versao === versaoConsultaJornada) {
            consultaJornadaEmAndamento = false;
            sincronizarBotoesPonto();
        }
    }
}

function renderizarHistorico() {
    const registrosOrdenados = registrosPonto.slice().sort((a, b) => new Date(b.entrada) - new Date(a.entrada));
    listaRegistros.replaceChildren();
    emptyRecords.hidden = registrosOrdenados.length > 0;
    historicoPonto.hidden = registrosOrdenados.length === 0;
    if (pontosCarregados) {
        emptyRecords.querySelector("p").textContent = "Nenhum registro ainda";
        emptyRecords.querySelector("span:last-child").textContent = "Seus registros de ponto aparecerão aqui.";
    }

    registrosOrdenados.forEach((registro) => {
        const linha = document.createElement("tr");
        const funcionario = funcionariosDisponiveis.find((item) => String(item.id) === String(registro.funcionario_id));
        const dataEntrada = new Date(registro.entrada);
        const celulas = [
            Number.isNaN(dataEntrada.getTime()) ? "—" : dataEntrada.toLocaleDateString("pt-BR"),
            funcionario?.nome || registro.nome || "Funcionário indisponível",
            funcionario?.funcao || registro.funcao || "—",
            Number.isNaN(dataEntrada.getTime()) ? "—" : horaLocalAtual(dataEntrada),
            registro.saida && !Number.isNaN(new Date(registro.saida).getTime()) ? horaLocalAtual(new Date(registro.saida)) : "Em aberto",
            formatarDuracao(registro),
            registro.saida ? "Expediente encerrado" : "Em expediente"
        ];

        celulas.forEach((valor) => {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.append(celula);
        });
        listaRegistros.append(linha);
    });
}

function sincronizarBotoesPonto(mostrarOrientacao = false) {
    const jornadaAberta = buscarJornadaAberta();
    const semFuncionario = !funcionarioCadastrado;

    botaoEntrada.disabled = semFuncionario || !pontosCarregados || consultaJornadaEmAndamento || verificacaoEmAndamento || operacaoPontoEmAndamento || Boolean(jornadaAberta);
    botaoSaida.disabled = semFuncionario || !pontosCarregados || consultaJornadaEmAndamento || verificacaoEmAndamento || operacaoPontoEmAndamento || !jornadaAberta;
    funcionarioAtivoSelect.disabled = true;

    if (!mostrarOrientacao) return;
    if (semFuncionario) {
        atualizarStatus("Cadastre um funcionário para registrar o ponto.", "neutral");
    } else if (jornadaAberta) {
        atualizarStatus("Há uma Entrada sem Saída. Bata a Saída para finalizar a jornada.", "neutral");
    } else {
        atualizarStatus("Funcionário identificado. Você pode bater a Entrada para iniciar.", "neutral");
    }
}

function exibirFuncionario(funcionario) {
    funcionarioCadastrado = funcionario;
    funcionarioSalvo.hidden = !funcionario;

    if (!funcionario) {
        nomeFuncionarioPerfil.value = "Meu perfil";
        boasVindas.textContent = "";
        nomeFuncionarioSalvo.textContent = "";
        funcaoFuncionarioSalvo.textContent = "";
        return;
    }

    nomeFuncionarioPerfil.value = funcionario.nome;
    boasVindas.textContent = `Olá, ${funcionario.nome} 👋`;
    nomeFuncionarioSalvo.textContent = funcionario.nome;
    funcaoFuncionarioSalvo.textContent = `Função: ${funcionario.funcao}`;
}

function converterFuncionarioSupabase(registro) {
    if (!registro || typeof registro.nome !== "string") return null;
    const funcionario = {
        id: registro.id,
        nome: registro.nome,
        funcao: registro.funcao,
        auth_user_id: registro.auth_user_id,
        primeiro_acesso: registro.primeiro_acesso === true,
        primeiro_acesso_expira_em: registro.primeiro_acesso_expira_em || null
    };
    return funcionarioValido(funcionario) ? funcionario : null;
}

function atualizarRequisitosSenha(senha) {
    const requisitos = [
        [requisitosSenha.tamanho, senha.length >= 8],
        [requisitosSenha.letra, /[A-Za-zÀ-ÿ]/.test(senha)],
        [requisitosSenha.numero, /\d/.test(senha)]
    ];
    requisitos.forEach(([elemento, atendido]) => {
        elemento.classList.toggle("is-met", atendido);
        elemento.setAttribute("aria-checked", String(atendido));
    });
}

function mostrarFormularioSenha(modo = "first_access") {
    modoFluxoSenha = modo;
    appShell.hidden = true;
    directorShell.hidden = true;
    loginView.hidden = true;
    firstAccessView.hidden = false;
    firstAccessKicker.textContent = modo === "recovery" ? "RECUPERAÇÃO DE SENHA" : "PRIMEIRO ACESSO";
    firstAccessTitle.textContent = modo === "recovery" ? "Crie uma nova senha" : "Crie sua senha definitiva";
    firstAccessDescription.textContent = modo === "recovery"
        ? "Defina uma nova senha para voltar a acessar sua conta."
        : "Este é seu primeiro acesso. Por segurança, você precisa criar uma senha pessoal antes de continuar.";
    statusNovaSenha.textContent = "";
    statusNovaSenha.className = "auth-status";
    formNovaSenha.reset();
    atualizarRequisitosSenha("");
    novaSenhaDefinitiva.focus();
}

async function carregarPontosSupabase() {
    pontosCarregados = false;
    emptyRecords.querySelector("p").textContent = "Carregando registros...";
    emptyRecords.querySelector("span:last-child").textContent = "Buscando o histórico no Supabase.";
    emptyRecords.hidden = false;
    historicoPonto.hidden = true;
    sincronizarBotoesPonto();
    try {
        const { data, error } = await supabaseClient
            .from("pontos")
            .select("id, funcionario_id, entrada, saida")
            .eq("funcionario_id", funcionarioCadastrado.id)
            .order("entrada", { ascending: false });

        if (error) throw error;
        registrosPonto = (data || []).filter((registro) => registro?.id != null
            && registro?.funcionario_id != null
            && typeof registro?.entrada === "string");
        pontosCarregados = true;
        renderizarHistorico();
        sincronizarBotoesPonto(true);
        void consultarJornadaAbertaSupabase();
    } catch (erro) {
        registrosPonto = [];
        renderizarHistorico();
        emptyRecords.querySelector("p").textContent = "Não foi possível carregar o histórico";
        emptyRecords.querySelector("span:last-child").textContent = "Verifique a tabela de ponto e as permissões no Supabase.";
        registrarErroSupabase("erro ao consultar a tabela pontos", erro);
        atualizarStatus("Não foi possível carregar os registros de ponto do servidor.", "error");
    }
}

async function carregarFuncionarioAutenticado(usuario) {
    const { data, error } = await supabaseClient
        .from("Funcionarios")
        .select("id, created_at, nome, funcao, auth_user_id, primeiro_acesso, primeiro_acesso_expira_em")
        .eq("auth_user_id", usuario.id)
        .maybeSingle();

    if (error) throw error;
    if (!data) {
        const erroVinculo = new Error("Conta sem funcionário vinculado.");
        erroVinculo.code = "FUNCIONARIO_NAO_VINCULADO";
        throw erroVinculo;
    }

    const funcionario = converterFuncionarioSupabase(data);
    if (!funcionario) throw new Error("Os dados do funcionário vinculado são inválidos.");
    return funcionario;
}

function atualizarModoAcesso(modo) {
    modoAcesso = modo === "diretor" ? "diretor" : "funcionario";
    const diretor = modoAcesso === "diretor";
    modoFuncionarioButton.classList.toggle("is-active", !diretor);
    modoDiretorButton.classList.toggle("is-active", diretor);
    modoFuncionarioButton.setAttribute("aria-pressed", String(!diretor));
    modoDiretorButton.setAttribute("aria-pressed", String(diretor));
    loginKicker.textContent = diretor ? "ACESSO ADMINISTRATIVO" : "ACESSO DO FUNCIONÁRIO";
    loginTitle.textContent = diretor ? "Entrar no sistema" : "Entrar no sistema";
    loginDescription.textContent = diretor
        ? "Acesse o painel administrativo com sua conta autorizada de diretor."
        : "Entre com o e-mail e a senha da sua conta de funcionário.";
    mostrarCadastroDiretorButton.hidden = !diretor || !formCadastroDiretor.hidden;
    mostrarRecuperacaoSenhaButton.hidden = diretor;
    formCadastroDiretor.hidden = true;
    formRecuperacaoSenha.hidden = true;
    formLogin.hidden = false;
    statusRecuperacaoSenha.textContent = "";
    loginStatus.textContent = "";
    loginStatus.className = "auth-status";
}

modoFuncionarioButton.addEventListener("click", () => atualizarModoAcesso("funcionario"));
modoDiretorButton.addEventListener("click", () => atualizarModoAcesso("diretor"));

alternarSenhaButton.addEventListener("click", function () {
    const mostrar = loginPassword.type === "password";
    loginPassword.type = mostrar ? "text" : "password";
    alternarSenhaButton.textContent = mostrar ? "Ocultar senha" : "Mostrar senha";
    alternarSenhaButton.setAttribute("aria-pressed", String(mostrar));
});

mostrarRecuperacaoSenhaButton.addEventListener("click", function () {
    formLogin.hidden = true;
    formCadastroDiretor.hidden = true;
    formRecuperacaoSenha.hidden = false;
    emailRecuperacaoSenha.value = loginEmail.value.trim();
    statusRecuperacaoSenha.textContent = "";
    statusRecuperacaoSenha.className = "auth-status";
    emailRecuperacaoSenha.focus();
});

voltarLoginRecuperacaoButton.addEventListener("click", function () {
    formRecuperacaoSenha.reset();
    formRecuperacaoSenha.hidden = true;
    formLogin.hidden = false;
    statusRecuperacaoSenha.textContent = "";
    loginEmail.value = emailRecuperacaoSenha.value.trim() || loginEmail.value;
    mostrarRecuperacaoSenhaButton.hidden = modoAcesso === "diretor";
});

formRecuperacaoSenha.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const email = emailRecuperacaoSenha.value.trim();
    if (!email) {
        statusRecuperacaoSenha.textContent = "Informe seu e-mail.";
        emailRecuperacaoSenha.focus();
        return;
    }

    botaoRecuperacaoSenha.disabled = true;
    statusRecuperacaoSenha.textContent = "Enviando solicitação...";
    statusRecuperacaoSenha.className = "auth-status";
    try {
        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw error;
        statusRecuperacaoSenha.textContent = "Se esse e-mail estiver cadastrado, você receberá um link para redefinir a senha.";
        statusRecuperacaoSenha.className = "auth-status auth-success";
    } catch {
        statusRecuperacaoSenha.textContent = "Não foi possível enviar o link agora. Confira o e-mail e tente novamente.";
    } finally {
        botaoRecuperacaoSenha.disabled = false;
    }
});

document.querySelectorAll("[data-password-toggle]").forEach((botao) => {
    botao.addEventListener("click", function () {
        const campo = document.getElementById(botao.dataset.passwordToggle);
        const mostrar = campo.type === "password";
        campo.type = mostrar ? "text" : "password";
        botao.textContent = mostrar ? "Ocultar senha" : "Mostrar senha";
        botao.setAttribute("aria-pressed", String(mostrar));
    });
});

novaSenhaDefinitiva.addEventListener("input", () => atualizarRequisitosSenha(novaSenhaDefinitiva.value));

formNovaSenha.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const novaSenha = novaSenhaDefinitiva.value;
    const confirmacao = confirmarNovaSenha.value;
    const senhaValida = novaSenha.length >= 8 && /[A-Za-zÀ-ÿ]/.test(novaSenha) && /\d/.test(novaSenha);

    atualizarRequisitosSenha(novaSenha);
    if (!senhaValida) {
        statusNovaSenha.textContent = "A senha não atende aos requisitos de segurança.";
        statusNovaSenha.className = "auth-status";
        return;
    }
    if (novaSenha !== confirmacao) {
        statusNovaSenha.textContent = "As senhas não coincidem.";
        statusNovaSenha.className = "auth-status";
        confirmarNovaSenha.focus();
        return;
    }
    if (!usuarioAutenticado || !supabaseClient?.auth) {
        statusNovaSenha.textContent = "Sua sessão expirou. Entre novamente e tente outra vez.";
        statusNovaSenha.className = "auth-status";
        return;
    }

    botaoCriarSenhaDefinitiva.disabled = true;
    statusNovaSenha.textContent = "Atualizando sua senha...";
    statusNovaSenha.className = "auth-status";
    try {
        // Se este pedido já tiver sido aplicado mas a confirmação de primeiro acesso falhou,
        // a Edge Function valida a senha atual e permite repetir a conclusão com segurança.
        const { error: erroAtualizacaoSenha } = await supabaseClient.auth.updateUser({ password: novaSenha });
        const { data: conclusao, error: erroConclusao } = await supabaseClient.functions.invoke("admin", {
            body: { action: "complete_employee_first_access", newPassword: novaSenha }
        });
        if (erroConclusao) throw erroConclusao;
        if (erroAtualizacaoSenha && !conclusao?.completed) {
            throw new Error("PASSWORD_UPDATE_UNCONFIRMED");
        }

        formNovaSenha.reset();
        atualizarRequisitosSenha("");
        if (conclusao?.requiresFreshLogin === true) {
            loginEmail.value = usuarioAutenticado?.email || loginEmail.value;
            mensagemLoginAposLogout = "Senha criada. Entre novamente com sua nova senha para invalidar sessões anteriores.";
            const { error: erroSaidaLocal } = await supabaseClient.auth.signOut({ scope: "local" });
            if (erroSaidaLocal) throw erroSaidaLocal;
            return;
        }

        statusNovaSenha.textContent = "Senha criada com sucesso!";
        statusNovaSenha.className = "auth-status auth-success";
        await new Promise((resolve) => window.setTimeout(resolve, 650));
        const { data: sessaoAtual, error: erroSessao } = await supabaseClient.auth.getSession();
        if (erroSessao || !sessaoAtual?.session) throw new Error("SESSION_EXPIRED");
        recuperacaoSenhaAoCarregar = false;
        await abrirSistemaParaSessao(sessaoAtual.session, modoAcesso);
    } catch {
        statusNovaSenha.textContent = "Não foi possível concluir a alteração. Se a senha temporária expirou, solicite um novo acesso ao Diretor.";
        statusNovaSenha.className = "auth-status";
    } finally {
        botaoCriarSenhaDefinitiva.disabled = false;
    }
});

botaoSairTrocaSenha.addEventListener("click", () => void sairDaConta(botaoSairTrocaSenha));

mostrarCadastroDiretorButton.addEventListener("click", function () {
    formLogin.hidden = true;
    formCadastroDiretor.hidden = false;
    mostrarCadastroDiretorButton.hidden = true;
    cadastroDiretorStatus.textContent = "A criação pública funciona somente enquanto ainda não existe um diretor cadastrado.";
    cadastroDiretorStatus.className = "auth-status";
    nomeDiretorCadastro.focus();
});

voltarLoginDiretorButton.addEventListener("click", function () {
    formCadastroDiretor.reset();
    formCadastroDiretor.hidden = true;
    formLogin.hidden = false;
    mostrarCadastroDiretorButton.hidden = false;
    cadastroDiretorStatus.textContent = "";
});

formCadastroDiretor.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const nome = nomeDiretorCadastro.value.trim();
    const email = emailDiretorCadastro.value.trim();
    const password = senhaDiretorCadastro.value;
    const confirmarSenha = confirmarSenhaDiretor.value;
    const bootstrapCode = codigoBootstrapDiretor.value;
    const botao = formCadastroDiretor.querySelector("button[type='submit']");

    if (!nome || !email || !password || !confirmarSenha || !bootstrapCode) {
        cadastroDiretorStatus.textContent = "Preencha todos os campos.";
        return;
    }
    if (password.length < 8) {
        cadastroDiretorStatus.textContent = "A senha deve ter pelo menos 8 caracteres.";
        return;
    }
    if (password !== confirmarSenha) {
        cadastroDiretorStatus.textContent = "As senhas não conferem.";
        confirmarSenhaDiretor.focus();
        return;
    }

    botao.disabled = true;
    cadastroDiretorStatus.textContent = "Criando a primeira conta de diretor...";
    cadastroDiretorStatus.className = "auth-status";
    try {
        const { data, error } = await supabaseClient.functions.invoke("bootstrap-director", {
            body: { nome, email, password, bootstrapCode }
        });
        if (error) throw error;
        formCadastroDiretor.reset();
        formCadastroDiretor.hidden = true;
        formLogin.hidden = false;
        mostrarCadastroDiretorButton.hidden = false;
        if (data?.session?.access_token && data?.session?.refresh_token) {
            const { error: erroSessao } = await supabaseClient.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token
            });
            if (erroSessao) throw erroSessao;
            cadastroDiretorStatus.textContent = "Conta criada. Abrindo painel administrativo...";
            cadastroDiretorStatus.className = "auth-status auth-success";
        } else {
            atualizarModoAcesso("diretor");
            loginStatus.textContent = "Conta criada. Entre com o e-mail e a senha que acabou de cadastrar.";
            loginStatus.className = "auth-status auth-success";
        }
    } catch (erro) {
        registrarErroSupabase("erro ao criar a primeira conta de diretor", erro);
        const statusHttp = erro?.context?.status;
        cadastroDiretorStatus.textContent = statusHttp === 410 || statusHttp === 409
            ? "O cadastro inicial de Diretor está desativado ou já foi utilizado. Entre com a conta de Diretor existente."
            : statusHttp === 403
                ? "Código ou e-mail não autorizados para o primeiro acesso administrativo."
                : statusHttp === 503
                    ? "O primeiro acesso administrativo ainda não foi configurado no servidor."
                    : "Não foi possível criar a conta. Confirme os dados e tente novamente.";
    } finally {
        botao.disabled = false;
    }
});

function mostrarLogin(mensagem = "", sucesso = false) {
    appShell.hidden = true;
    directorShell.hidden = true;
    firstAccessView.hidden = true;
    loginView.hidden = false;
    formRecuperacaoSenha.hidden = true;
    mostrarRecuperacaoSenhaButton.hidden = modoAcesso === "diretor";
    loginStatus.textContent = mensagem;
    loginStatus.className = sucesso ? "auth-status auth-success" : "auth-status";
    loginPassword.value = "";
    loginPassword.type = "password";
    alternarSenhaButton.textContent = "Mostrar senha";
    alternarSenhaButton.setAttribute("aria-pressed", "false");
}

function limparEstadoAutenticado() {
    versaoFluxoAutenticacao++;
    if (employeeCredentialsDialog.open && typeof employeeCredentialsDialog.close === "function") {
        employeeCredentialsDialog.close();
    } else {
        employeeCredentialsDialog.removeAttribute("open");
        limparCredenciaisFuncionario();
    }
    usuarioAutenticado = null;
    modoFluxoSenha = "first_access";
    recuperacaoSenhaAoCarregar = false;
    formNovaSenha.reset();
    statusNovaSenha.textContent = "";
    statusNovaSenha.className = "auth-status";
    formRecuperacaoSenha.reset();
    formRecuperacaoSenha.hidden = true;
    statusRecuperacaoSenha.textContent = "";
    funcionarioCadastrado = null;
    funcionariosDisponiveis = [];
    registrosPonto = [];
    dadosPainelDiretor = { funcionarios: [], pontos: [] };
    funcionarioDetalhadoAtual = null;
    pontosCarregados = false;
    verificacaoEmAndamento = false;
    operacaoPontoEmAndamento = false;
    consultaJornadaEmAndamento = false;
    formFuncionario.hidden = true;
    statusCadastro.textContent = "";
    statusCadastro.className = "employee-form-status";
    formNovoFuncionario.reset();
    formNovoFuncionario.hidden = true;
    statusNovoFuncionario.textContent = "";
    statusNovoFuncionario.className = "admin-status";
    formCadastroDiretor.reset();
    formCadastroDiretor.hidden = true;
    formLogin.hidden = false;
    mostrarCadastroDiretorButton.hidden = modoAcesso !== "diretor";
    directorGreeting.textContent = "Olá";
    directorEmail.textContent = "";
    detalheFuncionarioDiretor.hidden = true;
    listaFuncionariosDiretor.replaceChildren();
    historicoFuncionarioDiretor.replaceChildren();
    statusDashboard.textContent = "";
    totalFuncionarios.textContent = "—";
    presencasHoje.textContent = "—";
    presencasSemana.textContent = "—";
    presencasMes.textContent = "—";
    trabalhandoAgora.textContent = "—";
    renderizarSeletorFuncionarios(null);
    exibirFuncionario(null);
    renderizarHistorico();
    mostrarEstadoJornada("loading");
    atualizarLocalizacao("unknown", "Aguardando verificação da sua localização...");
    botaoEntrada.disabled = true;
    botaoSaida.disabled = true;
}

async function buscarPerfilDiretor(usuario) {
    const { data, error } = await supabaseClient
        .from("perfis")
        .select("nome, email, tipo")
        .eq("auth_user_id", usuario.id)
        .eq("tipo", "diretor")
        .maybeSingle();

    if (error) throw error;
    return data;
}

function abrirPainelDiretor(usuario, perfil) {
    usuarioAutenticado = usuario;
    funcionarioCadastrado = null;
    funcionariosDisponiveis = [];
    registrosPonto = [];
    pontosCarregados = false;
    renderizarSeletorFuncionarios(null);
    exibirFuncionario(null);
    renderizarHistorico();
    appShell.hidden = true;
    loginView.hidden = true;
    firstAccessView.hidden = true;
    directorShell.hidden = false;
    directorGreeting.textContent = `Olá, ${perfil.nome || "Diretor"}`;
    directorEmail.textContent = usuario.email || perfil.email || "E-mail não disponível";
    detalheFuncionarioDiretor.hidden = true;
    void carregarDadosDashboardDiretor();
}

function chaveDataLocal(valor) {
    const data = valor instanceof Date ? valor : new Date(valor);
    if (Number.isNaN(data.getTime())) return "";
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function dataInicioSemana(data = new Date()) {
    const inicio = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const diferenca = (inicio.getDay() + 6) % 7;
    inicio.setDate(inicio.getDate() - diferenca);
    return inicio;
}

function obterIntervaloDashboard() {
    const hoje = new Date();
    if (filtroPeriodo.value === "todos") return { inicio: "", fim: "" };
    if (filtroPeriodo.value === "hoje") {
        const dataHoje = chaveDataLocal(hoje);
        return { inicio: dataHoje, fim: dataHoje };
    }
    if (filtroPeriodo.value === "semana") {
        const inicio = dataInicioSemana(hoje);
        const fim = new Date(inicio);
        fim.setDate(fim.getDate() + 6);
        return { inicio: chaveDataLocal(inicio), fim: chaveDataLocal(fim) };
    }
    if (filtroPeriodo.value === "mes") {
        const [ano, mes] = (filtroMes.value || chaveDataLocal(hoje).slice(0, 7)).split("-").map(Number);
        const inicio = new Date(ano, mes - 1, 1);
        const fim = new Date(ano, mes, 0);
        return { inicio: chaveDataLocal(inicio), fim: chaveDataLocal(fim) };
    }
    return { inicio: filtroDataInicio.value, fim: filtroDataFim.value };
}

function registroNoIntervalo(registro, intervalo) {
    const data = chaveDataLocal(registro.entrada);
    return Boolean(data && (!intervalo.inicio || data >= intervalo.inicio) && (!intervalo.fim || data <= intervalo.fim));
}

function diasUnicos(registros) {
    return new Set(registros.map((registro) => chaveDataLocal(registro.entrada)).filter(Boolean)).size;
}

function formatarHoraServidor(valor) {
    if (!valor) return "—";
    const data = new Date(valor);
    return Number.isNaN(data.getTime()) ? "—" : horaLocalAtual(data);
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto;
    return celula;
}

function renderizarFiltrosFuncionarios() {
    const selecionado = filtroFuncionario.value || "todos";
    filtroFuncionario.replaceChildren(new Option("Todos", "todos"));
    dadosPainelDiretor.funcionarios.forEach((funcionario) => {
        filtroFuncionario.add(new Option(funcionario.nome, String(funcionario.id)));
    });
    filtroFuncionario.value = [...filtroFuncionario.options].some((opcao) => opcao.value === selecionado) ? selecionado : "todos";
}

function calcularDiasTrabalhados(funcionarioId, intervalo) {
    return diasUnicos(dadosPainelDiretor.pontos.filter((registro) => (
        String(registro.funcionario_id) === String(funcionarioId) && registroNoIntervalo(registro, intervalo)
    )));
}

function contarPresencasUnicas(registros, intervalo) {
    return new Set(registros
        .filter((registro) => registroNoIntervalo(registro, intervalo))
        .map((registro) => `${registro.funcionario_id}:${chaveDataLocal(registro.entrada)}`)
    ).size;
}

function formatarTotalMinutos(totalMinutos) {
    const total = Math.max(0, Math.round(totalMinutos));
    return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, "0")}m`;
}

async function obterMensagemErroFunction(erro) {
    const contexto = erro?.context;
    if (contexto && typeof contexto.clone === "function") {
        try {
            const corpo = await contexto.clone().json();
            if (typeof corpo?.error === "string") return corpo.error;
        } catch (_) {
            // A resposta pode não conter JSON; usa abaixo a mensagem genérica do SDK.
        }
    }
    if (typeof contexto?.body?.error === "string") return contexto.body.error;
    return typeof erro?.message === "string" ? erro.message : "";
}

function renderizarResumoDashboard() {
    const pontos = dadosPainelDiretor.pontos;
    const hoje = new Date();
    const dataHoje = chaveDataLocal(hoje);
    const inicioSemana = dataInicioSemana(hoje);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(fimSemana.getDate() + 6);
    const intervaloSemana = { inicio: chaveDataLocal(inicioSemana), fim: chaveDataLocal(fimSemana) };
    const intervaloMes = { inicio: `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`, fim: chaveDataLocal(hoje) };
    totalFuncionarios.textContent = String(dadosPainelDiretor.funcionarios.length);
    presencasHoje.textContent = String(contarPresencasUnicas(pontos, { inicio: dataHoje, fim: dataHoje }));
    presencasSemana.textContent = String(contarPresencasUnicas(pontos, intervaloSemana));
    presencasMes.textContent = String(contarPresencasUnicas(pontos, intervaloMes));
    trabalhandoAgora.textContent = String(pontos.filter((registro) => !registro.saida).length);
}

function renderizarListaFuncionariosDiretor() {
    const intervalo = obterIntervaloDashboard();
    const selecionado = filtroFuncionario.value;
    const funcionarios = dadosPainelDiretor.funcionarios.filter((funcionario) => (
        selecionado === "todos" || String(funcionario.id) === selecionado
    ));
    listaFuncionariosDiretor.replaceChildren();

    funcionarios.forEach((funcionario) => {
        const pontos = dadosPainelDiretor.pontos
            .filter((registro) => String(registro.funcionario_id) === String(funcionario.id))
            .sort((a, b) => new Date(b.entrada) - new Date(a.entrada));
        const recentesNoFiltro = pontos.filter((registro) => registroNoIntervalo(registro, intervalo));
        const ultimaEntrada = recentesNoFiltro[0];
        const ultimaSaida = recentesNoFiltro.find((registro) => registro.saida)?.saida;
        const jornadaAberta = pontos.some((registro) => !registro.saida);
        const statusFuncionario = funcionario.ativo
            ? jornadaAberta ? "Ativo · jornada aberta" : "Ativo"
            : funcionario.auth_user_id ? jornadaAberta ? "Inativo · jornada aberta" : "Inativo" : "Sem acesso";
        const linha = document.createElement("tr");
        linha.dataset.employeeId = String(funcionario.id);
        linha.append(
            criarCelula(funcionario.nome),
            criarCelula(funcionario.funcao),
            (() => {
                const celula = document.createElement("td");
                const link = document.createElement("a");
                link.href = `mailto:${funcionario.email || ""}`;
                link.textContent = funcionario.email || "E-mail indisponível";
                celula.append(link);
                return celula;
            })(),
            criarCelula(statusFuncionario),
            criarCelula(String(calcularDiasTrabalhados(funcionario.id, intervaloSemanaDashboard()))),
            criarCelula(String(calcularDiasTrabalhados(funcionario.id, intervaloMesDashboard()))),
            criarCelula(ultimaEntrada ? formatarHoraServidor(ultimaEntrada.entrada) : "—"),
            criarCelula(ultimaSaida ? formatarHoraServidor(ultimaSaida) : "—"),
            (() => {
                const celula = document.createElement("td");
                const botaoExcluir = document.createElement("button");
                botaoExcluir.type = "button";
                botaoExcluir.className = "director-delete-button";
                botaoExcluir.textContent = "Excluir funcionário";
                botaoExcluir.setAttribute("aria-label", `Excluir funcionário ${funcionario.nome}`);
                botaoExcluir.addEventListener("click", (evento) => {
                    evento.stopPropagation();
                    solicitarExclusaoFuncionario(funcionario);
                });
                celula.append(botaoExcluir);
                return celula;
            })()
        );
        linha.addEventListener("click", () => abrirDetalheFuncionario(funcionario));
        listaFuncionariosDiretor.append(linha);
    });

    if (funcionarios.length === 0) {
        const linha = document.createElement("tr");
        const celula = criarCelula("Nenhum funcionário encontrado.");
        celula.colSpan = 9;
        linha.append(celula);
        listaFuncionariosDiretor.append(linha);
    }
}

function solicitarExclusaoFuncionario(funcionario) {
    if (!funcionario || !directorShell || directorShell.hidden) return;
    funcionarioPendenteExclusao = funcionario;
    deleteEmployeeName.textContent = funcionario.nome;
    deleteEmployeeStatus.textContent = "";
    deleteEmployeeStatus.className = "admin-status";
    confirmDeleteEmployeeButton.disabled = false;
    if (typeof deleteEmployeeDialog.showModal === "function") {
        deleteEmployeeDialog.showModal();
    }
}

cancelDeleteEmployeeButton.addEventListener("click", function () {
    if (!exclusaoFuncionarioEmAndamento) deleteEmployeeDialog.close();
});

deleteEmployeeDialog.addEventListener("cancel", function (evento) {
    if (exclusaoFuncionarioEmAndamento) evento.preventDefault();
});

deleteEmployeeDialog.addEventListener("close", function () {
    if (exclusaoFuncionarioEmAndamento) return;
    funcionarioPendenteExclusao = null;
    deleteEmployeeName.textContent = "";
    deleteEmployeeStatus.textContent = "";
});

confirmDeleteEmployeeButton.addEventListener("click", async function () {
    const funcionario = funcionarioPendenteExclusao;
    if (!funcionario || exclusaoFuncionarioEmAndamento) return;

    exclusaoFuncionarioEmAndamento = true;
    confirmDeleteEmployeeButton.disabled = true;
    cancelDeleteEmployeeButton.disabled = true;
    deleteEmployeeStatus.textContent = "Excluindo funcionário e registros de ponto...";
    deleteEmployeeStatus.className = "admin-status";

    try {
        const { data, error } = await supabaseClient.functions.invoke("admin", {
            body: { action: "delete_employee", funcionarioId: String(funcionario.id) }
        });
        if (error) throw error;
        if (data?.deleted !== true) throw new Error("A exclusão não foi confirmada pelo servidor.");

        dadosPainelDiretor.funcionarios = dadosPainelDiretor.funcionarios.filter(
            (item) => String(item.id) !== String(funcionario.id)
        );
        dadosPainelDiretor.pontos = dadosPainelDiretor.pontos.filter(
            (item) => String(item.funcionario_id) !== String(funcionario.id)
        );
        if (funcionarioDetalhadoAtual && String(funcionarioDetalhadoAtual.id) === String(funcionario.id)) {
            detalheFuncionarioDiretor.hidden = true;
            funcionarioDetalhadoAtual = null;
        }
        renderizarFiltrosFuncionarios();
        renderizarResumoDashboard();
        renderizarListaFuncionariosDiretor();
        deleteEmployeeDialog.close();
        statusDashboard.textContent = `Funcionário ${funcionario.nome} e seus registros de ponto foram excluídos.`;
        statusDashboard.className = "admin-status admin-success";
    } catch (erro) {
        registrarErroSupabase("erro ao excluir funcionário pelo painel", erro);
        const mensagem = await obterMensagemErroFunction(erro);
        deleteEmployeeStatus.textContent = mensagem || "Não foi possível concluir a exclusão. Tente novamente.";
        deleteEmployeeStatus.className = "admin-status";
    } finally {
        exclusaoFuncionarioEmAndamento = false;
        if (deleteEmployeeDialog.open) {
            confirmDeleteEmployeeButton.disabled = false;
            cancelDeleteEmployeeButton.disabled = false;
        } else {
            funcionarioPendenteExclusao = null;
            deleteEmployeeName.textContent = "";
            deleteEmployeeStatus.textContent = "";
        }
    }
});

function intervaloSemanaDashboard() {
    const inicio = dataInicioSemana();
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 6);
    return { inicio: chaveDataLocal(inicio), fim: chaveDataLocal(fim) };
}

function intervaloMesDashboard() {
    const hoje = new Date();
    return {
        inicio: `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`,
        fim: chaveDataLocal(hoje)
    };
}

function intervaloMesDetalhado() {
    if (filtroPeriodo.value === "mes") {
        const [ano, mes] = (filtroMes.value || chaveDataLocal(new Date()).slice(0, 7)).split("-").map(Number);
        return { inicio: chaveDataLocal(new Date(ano, mes - 1, 1)), fim: chaveDataLocal(new Date(ano, mes, 0)) };
    }
    if (filtroPeriodo.value === "personalizado") return obterIntervaloDashboard();
    return intervaloMesDashboard();
}

function minutosDoHorario(valor) {
    if (!valor) return null;
    const data = new Date(valor);
    return Number.isNaN(data.getTime()) ? null : data.getHours() * 60 + data.getMinutes();
}

function formatarMediaHorario(minutos) {
    if (!Number.isFinite(minutos)) return "—";
    const valor = Math.round(minutos);
    return `${String(Math.floor(valor / 60) % 24).padStart(2, "0")}:${String(valor % 60).padStart(2, "0")}`;
}

function abrirDetalheFuncionario(funcionario) {
    funcionarioDetalhadoAtual = funcionario;
    detalheFuncionarioDiretor.hidden = false;
    detalheFuncionarioTitulo.textContent = `${funcionario.nome} · ${funcionario.funcao}`;
    detalheFuncionarioContato.textContent = funcionario.email || "E-mail indisponível";
    const intervalo = obterIntervaloDashboard();
    const registros = dadosPainelDiretor.pontos
        .filter((registro) => String(registro.funcionario_id) === String(funcionario.id) && registroNoIntervalo(registro, intervalo))
        .sort((a, b) => new Date(b.entrada) - new Date(a.entrada));
    const intervaloSemanaAtual = intervaloSemanaDashboard();
    const intervaloMesAtual = intervaloMesDashboard();
    const registrosSemana = dadosPainelDiretor.pontos.filter((registro) => (
        String(registro.funcionario_id) === String(funcionario.id)
        && registroNoIntervalo(registro, intervaloSemanaAtual)
    ));
    const registrosMes = dadosPainelDiretor.pontos.filter((registro) => (
        String(registro.funcionario_id) === String(funcionario.id)
        && registroNoIntervalo(registro, intervaloMesAtual)
    ));
    const minutosEntrada = registrosMes.map((registro) => minutosDoHorario(registro.entrada)).filter(Number.isFinite);
    const minutosSaida = registrosMes.map((registro) => minutosDoHorario(registro.saida)).filter(Number.isFinite);
    const totalMinutosMes = registrosMes.reduce((total, registro) => total + (minutosTrabalhados(registro) || 0), 0);
    const totalMinutosSemana = registrosSemana.reduce((total, registro) => total + (minutosTrabalhados(registro) || 0), 0);
    detalheDiasSemana.textContent = String(diasUnicos(registrosSemana));
    detalheHorasSemana.textContent = formatarTotalMinutos(totalMinutosSemana);
    detalheDiasMes.textContent = String(diasUnicos(registrosMes));
    detalheHorasMes.textContent = formatarTotalMinutos(totalMinutosMes);
    detalheMediaEntrada.textContent = formatarMediaHorario(minutosEntrada.length ? minutosEntrada.reduce((a, b) => a + b, 0) / minutosEntrada.length : NaN);
    detalheMediaSaida.textContent = formatarMediaHorario(minutosSaida.length ? minutosSaida.reduce((a, b) => a + b, 0) / minutosSaida.length : NaN);

    resumoSemanalDiretor.replaceChildren();
    const inicioSemana = dataInicioSemana();
    const nomesDias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    nomesDias.forEach((nomeDia, indice) => {
        const data = new Date(inicioSemana);
        data.setDate(data.getDate() + indice);
        const chave = chaveDataLocal(data);
        const pontosDia = dadosPainelDiretor.pontos
            .filter((registro) => String(registro.funcionario_id) === String(funcionario.id) && chaveDataLocal(registro.entrada) === chave)
            .sort((a, b) => new Date(a.entrada) - new Date(b.entrada));
        const card = document.createElement("div");
        card.className = "weekly-day";
        const titulo = document.createElement("strong");
        titulo.textContent = nomeDia;
        const entrada = document.createElement("span");
        entrada.textContent = `Entrada: ${pontosDia.length ? pontosDia.map((ponto) => formatarHoraServidor(ponto.entrada)).join(", ") : "—"}`;
        const saida = document.createElement("span");
        saida.textContent = `Saída: ${pontosDia.length ? pontosDia.map((ponto) => ponto.saida ? formatarHoraServidor(ponto.saida) : "Em aberto").join(", ") : "—"}`;
        card.append(titulo, entrada, saida);
        resumoSemanalDiretor.append(card);
    });

    historicoFuncionarioDiretor.replaceChildren();
    registros.forEach((registro) => {
        const entrada = new Date(registro.entrada);
        const linha = document.createElement("tr");
        linha.append(
            criarCelula(Number.isNaN(entrada.getTime()) ? "—" : entrada.toLocaleDateString("pt-BR", { weekday: "long" })),
            criarCelula(Number.isNaN(entrada.getTime()) ? "—" : entrada.toLocaleDateString("pt-BR")),
            criarCelula(formatarHoraServidor(registro.entrada)),
            criarCelula(registro.saida ? formatarHoraServidor(registro.saida) : "Em aberto"),
            criarCelula(formatarDuracao(registro))
        );
        historicoFuncionarioDiretor.append(linha);
    });
    detalheFuncionarioDiretor.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function carregarDadosDashboardDiretor() {
    statusDashboard.textContent = "Carregando equipe e registros...";
    try {
        const { data, error } = await supabaseClient.functions.invoke("admin", { body: { action: "dashboard" } });
        if (error) throw error;
        dadosPainelDiretor = {
            funcionarios: Array.isArray(data?.funcionarios) ? data.funcionarios : [],
            pontos: Array.isArray(data?.pontos) ? data.pontos : []
        };
        renderizarFiltrosFuncionarios();
        renderizarResumoDashboard();
        renderizarListaFuncionariosDiretor();
        statusDashboard.textContent = "Dados atualizados.";
        statusDashboard.className = "admin-status admin-success";
    } catch (erro) {
        registrarErroSupabase("erro ao carregar o dashboard administrativo", erro);
        statusDashboard.textContent = "Não foi possível carregar os dados. Confira se a Edge Function admin está publicada e se as permissões do diretor estão configuradas.";
        statusDashboard.className = "admin-status";
    }
}

function atualizarCamposPeriodo() {
    const personalizado = filtroPeriodo.value === "personalizado";
    const mes = filtroPeriodo.value === "mes";
    filtroMes.disabled = !mes;
    filtroDataInicio.disabled = !personalizado;
    filtroDataFim.disabled = !personalizado;
}

filtroPeriodo.addEventListener("change", atualizarCamposPeriodo);
filtroFuncionario.addEventListener("change", renderizarListaFuncionariosDiretor);
aplicarFiltrosButton.addEventListener("click", function () {
    const intervalo = obterIntervaloDashboard();
    if (filtroPeriodo.value !== "todos" && (!intervalo.inicio || !intervalo.fim || intervalo.inicio > intervalo.fim)) {
        statusDashboard.textContent = "Escolha um intervalo de datas válido.";
        statusDashboard.className = "admin-status";
        return;
    }
    renderizarListaFuncionariosDiretor();
    if (funcionarioDetalhadoAtual) abrirDetalheFuncionario(funcionarioDetalhadoAtual);
});

alternarFormularioFuncionarioButton.addEventListener("click", function () {
    formNovoFuncionario.hidden = !formNovoFuncionario.hidden;
    if (!formNovoFuncionario.hidden) novoFuncionarioNome.focus();
});

async function cadastrarFuncionarioPeloPainel({ teste = false } = {}) {
    const nome = novoFuncionarioNome.value.trim();
    const email = novoFuncionarioEmail.value.trim();
    const funcao = novaFuncaoFuncionario.value;

    if (!teste && (!nome || !email || !FUNCOES_FUNCIONARIO.includes(funcao))) {
        statusNovoFuncionario.textContent = "Preencha todos os campos do funcionário.";
        return;
    }

    const submitButton = formNovoFuncionario.querySelector("button[type='submit']");
    const buttons = [submitButton, criarFuncionarioTesteButton].filter(Boolean);
    buttons.forEach((button) => { button.disabled = true; });
    statusNovoFuncionario.textContent = "Criando conta e cadastro do funcionário...";
    try {
        const { data, error } = await supabaseClient.functions.invoke("admin", {
            body: teste
                ? { action: "create_employee_test" }
                : { action: "create_employee", nome, email, funcao }
        });
        if (error) throw error;
        const senhaTemporaria = data?.temporaryPassword
            || data?.temporary_password
            || data?.password
            || data?.credentials?.temporaryPassword
            || data?.credentials?.temporary_password
            || data?.credentials?.password;
        const funcionarioCriado = data?.funcionario;
        if (!funcionarioCriado || typeof senhaTemporaria !== "string" || !senhaTemporaria) {
            throw new Error("A Edge Function não retornou as credenciais temporárias do funcionário.");
        }
        formNovoFuncionario.reset();
        statusNovoFuncionario.className = "admin-status admin-success";
        statusNovoFuncionario.textContent = teste
            ? `Funcionário teste ${funcionarioCriado.nome} cadastrado e pronto para entrar.`
            : `Funcionário ${funcionarioCriado.nome} cadastrado e pronto para entrar.`;
        abrirCredenciaisFuncionario({
            nome: funcionarioCriado.nome || nome,
            email: funcionarioCriado.email || (teste ? data?.credentials?.email : email) || email,
            senha: senhaTemporaria
        });
        await carregarDadosDashboardDiretor();
    } catch (erro) {
        registrarErroSupabase("erro ao cadastrar funcionário pelo painel", erro);
        const mensagem = await obterMensagemErroFunction(erro);
        statusNovoFuncionario.className = "admin-status";
        statusNovoFuncionario.textContent = /already|registered|duplicate|já existe|cadastrad/i.test(mensagem)
            ? "Já existe uma conta com esse e-mail. Confira o endereço e tente novamente."
            : "Não foi possível cadastrar o funcionário. Confira os dados e tente novamente.";
    } finally {
        buttons.forEach((button) => { button.disabled = false; });
    }
}

function limparCredenciaisFuncionario() {
    credentialEmployeeName.textContent = "";
    credentialEmployeeEmail.textContent = "";
    credentialEmployeePassword.textContent = "";
    credentialsCopyStatus.textContent = "";
}

function abrirCredenciaisFuncionario({ nome, email, senha }) {
    limparCredenciaisFuncionario();
    credentialEmployeeName.textContent = nome;
    credentialEmployeeEmail.textContent = email;
    credentialEmployeePassword.textContent = senha;
    if (typeof employeeCredentialsDialog.showModal === "function") {
        employeeCredentialsDialog.showModal();
    } else {
        employeeCredentialsDialog.setAttribute("open", "");
    }
    closeEmployeeCredentialsButton.focus();
}

function fecharCredenciaisFuncionario() {
    if (employeeCredentialsDialog.open && typeof employeeCredentialsDialog.close === "function") {
        employeeCredentialsDialog.close();
    } else {
        employeeCredentialsDialog.removeAttribute("open");
        limparCredenciaisFuncionario();
    }
}

employeeCredentialsDialog.addEventListener("close", limparCredenciaisFuncionario);
closeEmployeeCredentialsButton.addEventListener("click", fecharCredenciaisFuncionario);
employeeCredentialsDialog.addEventListener("click", function (evento) {
    if (evento.target === employeeCredentialsDialog) fecharCredenciaisFuncionario();
});
copyEmployeeCredentialsButton.addEventListener("click", async function () {
    const textoCredenciais = [
        `Funcionário: ${credentialEmployeeName.textContent}`,
        `E-mail: ${credentialEmployeeEmail.textContent}`,
        `Senha: ${credentialEmployeePassword.textContent}`
    ].join("\n");

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(textoCredenciais);
        } else {
            const campoTemporario = document.createElement("textarea");
            campoTemporario.value = textoCredenciais;
            campoTemporario.setAttribute("readonly", "");
            campoTemporario.className = "clipboard-fallback";
            document.body.append(campoTemporario);
            campoTemporario.select();
            const copiado = document.execCommand("copy");
            campoTemporario.remove();
            if (!copiado) throw new Error("A cópia não foi autorizada pelo navegador.");
        }
        credentialsCopyStatus.textContent = "Credenciais copiadas.";
    } catch {
        credentialsCopyStatus.textContent = "Não foi possível copiar automaticamente. Selecione e copie as credenciais manualmente.";
    }
});

formNovoFuncionario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    void cadastrarFuncionarioPeloPainel();
});

criarFuncionarioTesteButton.addEventListener("click", function () {
    void cadastrarFuncionarioPeloPainel({ teste: true });
});

fecharDetalheFuncionarioButton.addEventListener("click", function () {
    detalheFuncionarioDiretor.hidden = true;
    funcionarioDetalhadoAtual = null;
});

const hojeInicialDashboard = new Date();
const inicioInicialDashboard = dataInicioSemana(hojeInicialDashboard);
const fimInicialDashboard = new Date(inicioInicialDashboard);
fimInicialDashboard.setDate(fimInicialDashboard.getDate() + 6);
filtroMes.value = chaveDataLocal(hojeInicialDashboard).slice(0, 7);
filtroDataInicio.value = chaveDataLocal(inicioInicialDashboard);
filtroDataFim.value = chaveDataLocal(fimInicialDashboard);
atualizarCamposPeriodo();

let mensagemLoginAposLogout = "";

async function encerrarSessaoComMensagem(mensagem, escopo = "global") {
    mensagemLoginAposLogout = mensagem;
    const { error } = await supabaseClient.auth.signOut({ scope: escopo });
    if (error) {
        registrarErroSupabase("erro ao encerrar sessão sem permissão", error);
        mensagemLoginAposLogout = "";
        limparEstadoAutenticado();
        mostrarLogin(mensagem);
    }
}

async function abrirSistemaParaSessao(sessao, modoSolicitado = modoAcesso) {
    if (!sessao?.user || !supabaseClient?.auth) {
        limparEstadoAutenticado();
        mostrarLogin();
        return;
    }

    const versao = ++versaoFluxoAutenticacao;
    appShell.hidden = true;
    directorShell.hidden = true;
    firstAccessView.hidden = true;
    loginView.hidden = false;
    loginStatus.textContent = "Verificando sua conta...";
    botaoLogin.disabled = true;

    try {
        const { data: userData, error: erroUsuario } = await supabaseClient.auth.getUser();
        if (erroUsuario) throw erroUsuario;
        const usuario = userData?.user;
        if (!usuario) throw new Error("Sessão expirada. Entre novamente.");
        if (versao !== versaoFluxoAutenticacao) return;

        let perfilDiretor = null;
        try {
            perfilDiretor = await buscarPerfilDiretor(usuario);
        } catch (erroPerfil) {
            registrarErroSupabase("erro ao consultar public.perfis", erroPerfil);
            if (modoSolicitado === "diretor") {
                await encerrarSessaoComMensagem("Não foi possível verificar o acesso administrativo. Confirme a configuração de perfis e tente novamente.");
                return;
            }
        }
        if (versao !== versaoFluxoAutenticacao) return;

        if (perfilDiretor?.tipo === "diretor") {
            abrirPainelDiretor(usuario, perfilDiretor);
            return;
        }

        if (modoSolicitado === "diretor") {
            await encerrarSessaoComMensagem("Esta conta não possui acesso ao painel administrativo.");
            return;
        }

        const funcionario = await carregarFuncionarioAutenticado(usuario);
        if (versao !== versaoFluxoAutenticacao) return;

        usuarioAutenticado = usuario;
        if (funcionario.primeiro_acesso) {
            const { data: acessoInicial, error: erroAcessoInicial } = await supabaseClient.functions.invoke("admin", {
                body: { action: "check_employee_first_access" }
            });
            if (erroAcessoInicial) throw erroAcessoInicial;
            if (acessoInicial?.expired === true) {
                await encerrarSessaoComMensagem("A senha temporária expirou. Solicite ao Diretor um novo acesso.", "local");
                return;
            }
            if (acessoInicial?.firstAccess !== true || !acessoInicial.expiresAt) {
                throw new Error("O servidor não confirmou o prazo do primeiro acesso.");
            }
            funcionarioCadastrado = funcionario;
            funcionariosDisponiveis = [funcionario];
            funcionariosCarregados = true;
            mostrarFormularioSenha("first_access");
            return;
        }

        funcionariosDisponiveis = [funcionario];
        funcionariosCarregados = true;
        registrosPonto = [];
        pontosCarregados = false;
        renderizarSeletorFuncionarios(funcionario);
        exibirFuncionario(funcionario);
        formFuncionario.hidden = true;
        statusCadastro.textContent = "O cadastro de funcionários é gerenciado pelo administrador.";
        statusCadastro.className = "employee-form-status";
        appShell.hidden = false;
        loginView.hidden = true;
        sincronizarBotoesPonto();
        await carregarPontosSupabase();
    } catch (erro) {
        if (versao !== versaoFluxoAutenticacao) return;
        registrarErroSupabase("erro ao autenticar ou localizar o perfil", erro);

        if (erro?.code === "FUNCIONARIO_NAO_VINCULADO") {
            await encerrarSessaoComMensagem("Esta conta ainda não está vinculada a um funcionário. Solicite o vínculo ao administrador.");
            return;
        }

        limparEstadoAutenticado();
        mostrarLogin("Não foi possível identificar sua conta. Verifique a conexão ou solicite ajuda ao administrador.");
    } finally {
        botaoLogin.disabled = false;
    }
}

formLogin.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    if (!supabaseClient?.auth || botaoLogin.disabled) return;

    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    if (!email) {
        mostrarLogin("Informe seu e-mail.");
        loginEmail.focus();
        return;
    }
    if (!password) {
        mostrarLogin("Informe sua senha.");
        loginPassword.focus();
        return;
    }

    botaoLogin.disabled = true;
    loginStatus.textContent = "Entrando...";
    loginStatus.className = "auth-status";
    try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        loginPassword.value = "";
    } catch (erro) {
        registrarErroSupabase("erro no login", erro);
        const credenciaisInvalidas = /invalid login credentials|invalid email or password/i.test(erro?.message || "");
        mostrarLogin(credenciaisInvalidas
            ? "E-mail ou senha incorretos. Confira os dados e tente novamente."
            : "Não foi possível conectar ao sistema. Tente novamente.");
    } finally {
        botaoLogin.disabled = false;
    }
});

async function sairDaConta(botao) {
    if (!supabaseClient?.auth) return;
    botao.disabled = true;
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    } catch (erro) {
        registrarErroSupabase("erro ao sair da conta", erro);
        if (botao === botaoSairDiretor) {
            mostrarLogin("Não foi possível sair agora. Tente novamente.");
        } else {
            atualizarStatus("Não foi possível sair agora. Tente novamente.", "error");
        }
        botao.disabled = false;
    }
}

botaoSair.addEventListener("click", () => void sairDaConta(botaoSair));
botaoSairDiretor.addEventListener("click", () => void sairDaConta(botaoSairDiretor));

async function inicializarAutenticacao() {
    if (!supabaseClient?.auth) {
        mostrarLogin("Não foi possível iniciar a autenticação. Verifique se a biblioteca Supabase carregou.");
        return;
    }

    supabaseClient.auth.onAuthStateChange((evento, sessao) => {
        if (evento === "SIGNED_OUT") {
            const mensagem = mensagemLoginAposLogout;
            mensagemLoginAposLogout = "";
            limparEstadoAutenticado();
            mostrarLogin(mensagem);
            botaoSair.disabled = false;
            botaoSairDiretor.disabled = false;
        } else if (evento === "SIGNED_IN" && sessao?.user) {
            setTimeout(() => void abrirSistemaParaSessao(sessao, modoAcesso), 0);
        } else if (evento === "PASSWORD_RECOVERY" && sessao?.user) {
            recuperacaoSenhaAoCarregar = true;
            usuarioAutenticado = sessao.user;
            mostrarFormularioSenha("recovery");
        }
    });

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
        registrarErroSupabase("erro ao recuperar sessão", error);
        mostrarLogin("Não foi possível verificar sua sessão. Tente entrar novamente.");
        return;
    }
    if (data?.session && recuperacaoSenhaAoCarregar) {
        usuarioAutenticado = data.session.user;
        mostrarFormularioSenha("recovery");
    } else if (data?.session) await abrirSistemaParaSessao(data.session, "funcionario");
    else mostrarLogin();
}

formFuncionario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    statusCadastro.textContent = "O cadastro de funcionários é restrito ao administrador.";
});

renderizarHistorico();
sincronizarBotoesPonto();
renderizarSeletorFuncionarios(null);
inicializarAutenticacao();

function iniciarFundoAnimado() {
    const canvas = document.getElementById("backgroundNetwork");
    const contexto = canvas.getContext("2d");
    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pontosLivres = Array.from({ length: 62 }, () => ({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.7 + 0.5,
        alpha: Math.random() * 0.42 + 0.12,
        speed: Math.random() * 0.00012 + 0.00004,
        phase: Math.random() * Math.PI * 2
    }));
    const niveis = 13;
    const segmentos = 24;
    let largura = 0;
    let altura = 0;
    let escala = 1;
    let inicio = performance.now();

    const redimensionar = () => {
        largura = window.innerWidth;
        altura = window.innerHeight;
        escala = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(largura * escala);
        canvas.height = Math.round(altura * escala);
        contexto.setTransform(escala, 0, 0, escala, 0, 0);
        if (movimentoReduzido) desenhar(performance.now());
    };

    function desenhar(agora) {
        contexto.clearRect(0, 0, largura, altura);
        const tempo = movimentoReduzido ? 0 : (agora - inicio) / 1000;
        const raio = Math.min(largura * 0.235, altura * 0.36, 350);
        const centroX = largura * (largura < 700 ? 0.75 : 0.78);
        const centroY = altura * (largura < 700 ? 0.49 : 0.41) + Math.sin(tempo * 0.34) * (movimentoReduzido ? 0 : 9);

        const brilho = contexto.createRadialGradient(centroX, centroY, raio * 0.05, centroX, centroY, raio * 1.3);
        brilho.addColorStop(0, "rgba(18, 145, 118, 0.105)");
        brilho.addColorStop(0.58, "rgba(11, 100, 91, 0.045)");
        brilho.addColorStop(1, "rgba(5, 30, 36, 0)");
        contexto.fillStyle = brilho;
        contexto.beginPath();
        contexto.arc(centroX, centroY, raio * 1.3, 0, Math.PI * 2);
        contexto.fill();

        contexto.save();
        contexto.translate(centroX, centroY);
        contexto.rotate(-0.22 + Math.sin(tempo * 0.15) * 0.035);
        for (let orbita = 0; orbita < 3; orbita++) {
            contexto.beginPath();
            contexto.ellipse(0, 0, raio * (1.17 + orbita * 0.1), raio * (0.36 + orbita * 0.035), orbita * 0.52, 0, Math.PI * 2);
            contexto.strokeStyle = `rgba(48, 199, 167, ${0.13 - orbita * 0.025})`;
            contexto.lineWidth = 1;
            contexto.stroke();
        }
        contexto.restore();

        const rotacao = tempo * 0.105;
        const inclinacao = -0.23;
        const pontos = [];
        for (let nivel = 1; nivel < niveis; nivel++) {
            const latitude = -Math.PI / 2 + Math.PI * nivel / niveis;
            for (let segmento = 0; segmento < segmentos; segmento++) {
                const longitude = Math.PI * 2 * segmento / segmentos;
                const x0 = Math.cos(latitude) * Math.cos(longitude + rotacao);
                const y0 = Math.sin(latitude);
                const z0 = Math.cos(latitude) * Math.sin(longitude + rotacao);
                const y = y0 * Math.cos(inclinacao) - z0 * Math.sin(inclinacao);
                const z = y0 * Math.sin(inclinacao) + z0 * Math.cos(inclinacao);
                pontos.push({ x: x0, y, z, px: centroX + x0 * raio, py: centroY + y * raio });
            }
        }

        contexto.lineWidth = 0.75;
        for (let nivel = 0; nivel < niveis - 1; nivel++) {
            for (let segmento = 0; segmento < segmentos; segmento++) {
                const atual = nivel * segmentos + segmento;
                const vizinhoLongitude = nivel * segmentos + (segmento + 1) % segmentos;
                const origem = pontos[atual];
                const conexoes = [pontos[vizinhoLongitude]];
                if (nivel < niveis - 2) conexoes.push(pontos[(nivel + 1) * segmentos + segmento]);
                for (const destino of conexoes) {
                    const profundidade = Math.max(0, (origem.z + destino.z + 2) / 4);
                    contexto.strokeStyle = `rgba(46, 197, 169, ${0.045 + profundidade * 0.22})`;
                    contexto.beginPath();
                    contexto.moveTo(origem.px, origem.py);
                    contexto.lineTo(destino.px, destino.py);
                    contexto.stroke();
                }
            }
        }

        for (const ponto of pontos) {
            const profundidade = Math.max(0, (ponto.z + 1) / 2);
            if (profundidade < 0.08) continue;
            const tamanho = 0.75 + profundidade * 1.55;
            contexto.beginPath();
            contexto.arc(ponto.px, ponto.py, tamanho, 0, Math.PI * 2);
            contexto.fillStyle = `rgba(74, 232, 198, ${0.16 + profundidade * 0.72})`;
            contexto.shadowColor = "rgba(53, 227, 188, 0.85)";
            contexto.shadowBlur = profundidade > 0.7 ? 8 : 3;
            contexto.fill();
        }
        contexto.shadowBlur = 0;

        for (const ponto of pontosLivres) {
            if (!movimentoReduzido) ponto.y -= ponto.speed;
            if (ponto.y < -0.02) ponto.y = 1.02;
            const cintilacao = 0.65 + Math.sin(tempo * 1.4 + ponto.phase) * 0.35;
            const x = ponto.x * largura;
            const y = ponto.y * altura;
            contexto.beginPath();
            contexto.arc(x, y, ponto.radius, 0, Math.PI * 2);
            contexto.fillStyle = `rgba(74, 205, 184, ${ponto.alpha * cintilacao})`;
            contexto.shadowColor = "rgba(43, 205, 176, 0.55)";
            contexto.shadowBlur = ponto.radius * 4;
            contexto.fill();
        }
        contexto.shadowBlur = 0;

        if (!movimentoReduzido) requestAnimationFrame(desenhar);
    }

    window.addEventListener("resize", redimensionar, { passive: true });
    redimensionar();
    if (!movimentoReduzido) requestAnimationFrame(desenhar);
}

iniciarFundoAnimado();

function atualizarRelogio() {
    const agora = new Date();
    document.getElementById("relogio").textContent = agora.toLocaleTimeString("pt-BR");
    document.getElementById("dataAtual").textContent = agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function atualizarStatus(mensagem, estilo = "neutral") {
    status.textContent = mensagem;
    statusBox.className = `status-box status-${estilo}`;
    const simbolo = statusBox.querySelector(".status-symbol");
    simbolo.textContent = estilo === "success" ? "✓" : estilo === "error" ? "!" : estilo === "pending" ? "…" : "i";
}

function atualizarLocalizacao(estado, detalhe) {
    locationBadge.className = `location-badge location-${estado}`;
    locationLabel.textContent = estado === "inside" ? "Dentro da área" : estado === "outside" ? "Fora da área" : estado === "pending" ? "Verificando" : "Não verificada";
    locationDetail.textContent = detalhe;
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);

function registrarPonto(tipo) {
    if (!usuarioAutenticado || funcionarioCadastrado?.auth_user_id !== usuarioAutenticado.id) {
        atualizarStatus("Sua sessão não está autenticada. Entre novamente para registrar o ponto.", "error");
        return;
    }
    if (!funcionarioCadastrado) {
        atualizarStatus("Selecione um funcionário antes de registrar o ponto.", "error");
        return;
    }
    if (!pontosCarregados) {
        atualizarStatus("O histórico ainda não está disponível. Tente novamente em instantes.", "error");
        return;
    }

    const jornadaAberta = buscarJornadaAberta();
    if (tipo === "Entrada" && jornadaAberta) {
        atualizarStatus("Já existe uma Entrada sem Saída. Bata a Saída para finalizar a jornada.", "error");
        sincronizarBotoesPonto();
        return;
    }
    if (tipo === "Saída" && !jornadaAberta) {
        atualizarStatus("Registre uma Entrada antes de bater a Saída.", "error");
        sincronizarBotoesPonto();
        return;
    }
    if (verificacaoEmAndamento || operacaoPontoEmAndamento) return;

    if (!navigator.geolocation) {
        atualizarLocalizacao("unknown", "Este navegador não oferece suporte à localização");
        atualizarStatus("Este navegador não oferece suporte à localização.", "error");
        return;
    }

    verificacaoEmAndamento = true;
    sincronizarBotoesPonto();
    atualizarStatus("Solicitando acesso à localização. Autorize no navegador para continuar.", "pending");
    atualizarLocalizacao("pending", "Aguardando verificação da sua localização...");

    navigator.geolocation.getCurrentPosition(
        async function (posicao) {
            verificacaoEmAndamento = false;
            operacaoPontoEmAndamento = true;
            sincronizarBotoesPonto();
            atualizarStatus(tipo === "Entrada" ? "Validando localização e registrando entrada..." : "Validando localização e registrando saída...", "pending");

            try {
                const { latitude, longitude, accuracy } = posicao.coords;
                // Dados do Geolocation API são controláveis pelo navegador/dispositivo.
                // A RPC verifica distância no servidor, mas uma página web não consegue
                // atestar que as coordenadas vieram de GPS físico.
                const { data, error } = await supabaseClient.rpc("registrar_ponto", {
                    p_tipo: tipo,
                    p_latitude: latitude,
                    p_longitude: longitude,
                    p_accuracy: accuracy,
                    p_timestamp: Math.trunc(posicao.timestamp)
                });
                if (error) throw error;

                const registroAtualizado = Array.isArray(data) ? data[0] : data;
                if (registroAtualizado?.id == null || !registroAtualizado?.entrada
                    || (tipo === "Saída" && !registroAtualizado?.saida)) {
                    throw new Error("O servidor não retornou o registro de ponto criado.");
                }

                atualizarLocalizacao("inside", "Distância aceita pela validação do servidor; GPS não é atestação física");
                const horario = horaLocalAtual(new Date(tipo === "Entrada" ? registroAtualizado.entrada : registroAtualizado.saida));
                atualizarStatus(tipo === "Entrada"
                    ? `Entrada registrada com sucesso às ${horario}.`
                    : `Saída registrada com sucesso às ${horario}.`, "success");

                registrosPonto = [
                    registroAtualizado,
                    ...registrosPonto.filter((registro) => String(registro.id) !== String(registroAtualizado.id))
                ];
                renderizarHistorico();
                await consultarJornadaAbertaSupabase();
            } catch (erro) {
                registrarErroSupabase(`erro ao registrar ${tipo.toLowerCase()} na tabela pontos`, erro);
                const mensagemBanco = String(erro?.message || "");
                if (/FORA_DO_HORARIO/i.test(mensagemBanco)) {
                    atualizarStatus("Fora do horário permitido. O registro de ponto está disponível das 07:00 às 20:00.", "error");
                } else if (/FORA_DA_AREA/i.test(mensagemBanco)) {
                    atualizarLocalizacao("outside", "Coordenadas recebidas pelo servidor fora da área permitida");
                    atualizarStatus(`Você está fora da área permitida de ${RAIO_PERMITIDO} metros.`, "error");
                } else if (/LOCALIZACAO_IMPRECISA/i.test(mensagemBanco)) {
                    atualizarLocalizacao("unknown", "Precisão da localização insuficiente");
                    atualizarStatus("A localização do dispositivo está imprecisa. Tente novamente em uma área com melhor sinal.", "error");
                } else if (/LOCALIZACAO_DESATUALIZADA/i.test(mensagemBanco)) {
                    atualizarLocalizacao("unknown", "Leitura de localização expirada");
                    atualizarStatus("A leitura da localização expirou. Tente novamente.", "error");
                } else if (/JORNADA_ABERTA/i.test(mensagemBanco)) {
                    atualizarStatus("Já existe uma Entrada sem Saída. Bata a Saída para finalizar a jornada.", "error");
                    await consultarJornadaAbertaSupabase();
                } else if (/SEM_JORNADA_ABERTA/i.test(mensagemBanco)) {
                    atualizarStatus("Registre uma Entrada antes de bater a Saída.", "error");
                    await consultarJornadaAbertaSupabase();
                } else if (/FUNCIONARIO_NAO_VINCULADO/i.test(mensagemBanco)) {
                    atualizarStatus("Esta conta não está vinculada a um funcionário ativo. Solicite ajuda ao diretor.", "error");
                } else if (/PRIMEIRO_ACESSO_EXPIRADO/i.test(mensagemBanco)) {
                    await encerrarSessaoComMensagem("A senha temporária expirou. Solicite ao Diretor um novo acesso.", "local");
                } else if (/PRIMEIRO_ACESSO_PENDENTE/i.test(mensagemBanco)) {
                    if (funcionarioCadastrado) funcionarioCadastrado.primeiro_acesso = true;
                    mostrarFormularioSenha("first_access");
                } else if (/SESSAO_ANTERIOR_A_TROCA/i.test(mensagemBanco)) {
                    await encerrarSessaoComMensagem("Sua senha foi atualizada. Entre novamente para continuar.", "local");
                } else {
                    atualizarStatus("Não foi possível registrar o ponto no servidor. Tente novamente.", "error");
                }
            } finally {
                operacaoPontoEmAndamento = false;
                sincronizarBotoesPonto();
            }
        },
        function (erro) {
            verificacaoEmAndamento = false;
            if (erro.code === erro.PERMISSION_DENIED) {
                atualizarLocalizacao("unknown", "Acesso à localização não autorizado");
                atualizarStatus("Acesso à localização negado. Autorize a localização nas configurações do navegador e tente novamente.", "error");
            } else if (erro.code === erro.POSITION_UNAVAILABLE) {
                atualizarLocalizacao("unknown", "Não foi possível obter a posição do dispositivo");
                atualizarStatus("A localização não está disponível. Verifique o GPS ou os serviços de localização do dispositivo e tente novamente.", "error");
            } else if (erro.code === erro.TIMEOUT) {
                atualizarLocalizacao("unknown", "Verificação da localização expirou");
                atualizarStatus("A localização demorou para responder. Tente novamente.", "error");
            } else {
                atualizarLocalizacao("unknown", "Localização não verificada");
                atualizarStatus("Não foi possível obter sua localização. Tente novamente.", "error");
            }
            sincronizarBotoesPonto();
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

botaoEntrada.addEventListener("click", function () {
    registrarPonto("Entrada");
});

botaoSaida.addEventListener("click", function () {
    registrarPonto("Saída");
});
