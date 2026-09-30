/* diretor: responsabilidades do diretor. */

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
