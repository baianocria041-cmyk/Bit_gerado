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
// --- MENU DE ATIVIDADES ---
function abrirAtividades() {
    let html = `
        <div class="menu-scroll">
            <button class="btn-opt" onclick="rotina('academia')">🏋️ Ir à Academia (R$ 50)</button>
            <button class="btn-opt" onclick="rotina('meditar')">🧘 Meditar (Grátis)</button>
            <button class="btn-opt" onclick="rotina('ler')">📖 Ler um Livro (Grátis)</button>
            <button class="btn-opt" onclick="rotina('balada')">🕺 Sair para Balada (R$ 200)</button>
            <button class="btn-opt" onclick="rotina('cinema')">🎬 Ir ao Cinema (R$ 60)</button>
            <button class="btn-opt" style="background:#e74c3c" onclick="iniciarMiniGameFuga()">🎭 Cometer um Crime</button>
        </div>
    `;
    abrirModal("ATIVIDADES DIÁRIAS", html);
}

// --- LÓGICA DAS ATIVIDADES ---
function rotina(tipo) {
    switch(tipo) {
        case 'academia':
            if(p.grana >= 50) {
                p.grana -= 50;
                p.stats.sau = Math.min(100, p.stats.sau + 15);
                p.stats.apa = Math.min(100, p.stats.apa + 5);
                addLog("Treinei pesado na academia! Me sinto mais forte.", "var(--primary)");
            } else { alert("Sem dinheiro para a mensalidade!"); }
            break;
            
        case 'meditar':
            p.stats.fel = Math.min(100, p.stats.fel + 10);
            p.stats.sau = Math.min(100, p.stats.sau + 5);
            addLog("Tirei um tempo para meditar. Paz interior alcançada.");
            break;
            
        case 'ler':
            p.stats.int = Math.min(100, p.stats.int + 10);
            p.stats.fel = Math.min(100, p.stats.fel + 2);
            addLog("Li um livro de filosofia. Me sinto mais culto.", "var(--blue)");
            break;
            
        case 'balada':
            if(p.grana >= 200) {
                p.grana -= 200;
                p.stats.fel = Math.min(100, p.stats.fel + 30);
                p.stats.sau -= 5; // Ressaca!
                addLog("A festa foi épica! Mas acordei com um pouco de dor de cabeça.", "purple");
            } else { alert("Estou quebrado, não dá para sair hoje."); }
            break;

        case 'cinema':
            if(p.grana >= 60) {
                p.grana -= 60;
                p.stats.fel = Math.min(100, p.stats.fel + 15);
                addLog("Assisti a um filme incrível no cinema.");
            } else { alert("Pipoca está cara, sem dinheiro!"); }
            break;
    }
    fecharModal();
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
