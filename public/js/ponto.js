/* ponto: responsabilidades do ponto. */

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
