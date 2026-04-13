// --- ESTADO GLOBAL DO JOGADOR ---
let p = {
    nome: "Carlos", sobrenome: "Silva", idade: 18, grana: 1250,
    stats: { fel: 50, int: 60, sau: 80, apa: 50 },
    vivo: true, namorada: null, job: null
};

function envelhecer() {
    if (!p.vivo) return;
    p.idade++;
    
    // Pequena lógica de sorte para não ficar repetitivo
    let r = Math.random();
    if (r > 0.8) {
        addLog("Conheci uma pessoa interessante no Tinder! 🔥", "orange");
    } else if (r < 0.2) {
        p.stats.sau -= 10;
        addLog("Fui ao hospital após passar mal. 🤒", "red");
    } else {
        addLog("Mais um ano de vida se passou.");
    }

    if (p.stats.sau <= 0) {
        p.vivo = false;
        alert("Você morreu!");
        location.reload();
    }
    
    update();
}

function update() {
    // Atualiza Textos
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('v-name').innerText = p.nome;

    // Atualiza Barras
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
}

function addLog(msg, cor = "#2d3640") {
    const log = document.getElementById('event-log');
    const item = `<div class="log-item" style="border-left: 4px solid ${cor}"><b>Ano ${p.idade}</b>: ${msg}</div>`;
    log.insertAdjacentHTML('afterbegin', item);
}

function abrir(tipo) {
    const m = document.getElementById('modal');
    m.style.display = 'flex';
    document.getElementById('modal-title').innerText = tipo.toUpperCase();
    document.getElementById('m-content').innerHTML = `<p>Menu de ${tipo} em desenvolvimento!</p>`;
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

// Inicia o jogo
window.onload = update;
