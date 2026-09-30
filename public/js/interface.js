/* interface: responsabilidades do interface. */


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
