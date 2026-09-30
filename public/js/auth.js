/* auth: responsabilidades do auth. */

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
