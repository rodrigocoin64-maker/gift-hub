/* utils: responsabilidades do utils. */

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
