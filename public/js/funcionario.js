/* funcionario: responsabilidades do funcionario. */

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

formFuncionario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    statusCadastro.textContent = "O cadastro de funcionários é restrito ao administrador.";
});
