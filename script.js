// --- ESTADO GLOBAL DO JOGADOR ---
let p = {
    nome: "Carlos", idade: 18, grana: 1250,
    stats: { fel: 50, int: 60, sau: 80, apa: 50 },
    vivo: true, job: null
};

// --- FUNÇÃO PARA ABRIR O MENU DE ATIVIDADES ---
function abrirAtividades() {
    const html = `
        <div class="menu-scroll">
            <button class="btn-opt" onclick="fazerAtividade('academia')">🏋️ Ir à Academia (R$ 50)</button>
            <button class="btn-opt" onclick="fazerAtividade('meditar')">🧘 Meditar (Grátis)</button>
            <button class="btn-opt" onclick="fazerAtividade('ler')">📖 Ler um Livro (Grátis)</button>
            <button class="btn-opt" onclick="fazerAtividade('balada')">🕺 Sair para Balada (R$ 200)</button>
            <button class="btn-opt" onclick="fazerAtividade('cinema')">🎬 Ir ao Cinema (R$ 60)</button>
            <button class="btn-opt" style="background:#e74c3c" onclick="iniciarMiniGameFuga()">🎭 Cometer um Crime</button>
        </div>
    `;
    abrirModal("ATIVIDADES DIÁRIAS", html);
}

// --- LÓGICA DO QUE CADA ATIVIDADE FAZ ---
function fazerAtividade(tipo) {
    if (!p.vivo) return;

    switch(tipo) {
        case 'academia':
            if(p.grana >= 50) {
                p.grana -= 50;
                p.stats.sau = Math.min(100, p.stats.sau + 15);
                p.stats.apa = Math.min(100, p.stats.apa + 5);
                addLog("Treinei pesado na academia! +Saúde +Aparência", "#2ecc71");
            } else { alert("Dinheiro insuficiente!"); }
            break;
        case 'meditar':
            p.stats.fel = Math.min(100, p.stats.fel + 10);
            addLog("Meditei e me sinto em paz. +Felicidade");
            break;
        case 'ler':
            p.stats.int = Math.min(100, p.stats.int + 12);
            addLog("Li um livro interessante. +Inteligência", "#3498db");
            break;
        case 'balada':
            if(p.grana >= 200) {
                p.grana -= 200;
                p.stats.fel = Math.min(100, p.stats.fel + 30);
                p.stats.sau -= 5;
                addLog("A noite foi louca! ++Felicidade -Saúde", "purple");
            } else { alert("Sem grana para a entrada!"); }
            break;
        case 'cinema':
            if(p.grana >= 60) {
                p.grana -= 60;
                p.stats.fel = Math.min(100, p.stats.fel + 15);
                addLog("Vi um lançamento no cinema.");
            } else { alert("Sem dinheiro!"); }
            break;
    }
    fecharModal();
    update();
}

// --- FUNÇÕES DE SUPORTE (MODAL E UPDATE) ---
function abrirModal(titulo, conteudo) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('m-content').innerHTML = conteudo;
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

function update() {
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
}

function addLog(msg, cor = "#2d3640") {
    const log = document.getElementById('event-log');
    log.insertAdjacentHTML('afterbegin', `<div class="log-item" style="border-left:4px solid ${cor}"><b>Ano ${p.idade}</b>: ${msg}</div>`);
}

function envelhecer() {
    p.idade++;
    // Diminui um pouco a saúde e felicidade naturalmente ao envelhecer
    p.stats.sau = Math.max(0, p.stats.sau - 2);
    p.stats.fel = Math.max(0, p.stats.fel - 5);
    addLog("Mais um ano se passou.");
    update();
}

window.onload = update;
