// --- 1. ESTADO DO JOGADOR ---
let p = {
    nome: "Carlos", sobrenome: "Silva", idade: 18, grana: 1250,
    stats: { fel: 50, int: 60, sau: 80, apa: 50 },
    vivo: true, formacao: null, job: null
};

// --- 2. BANCO DE DADOS (ATIVIDADES) ---
const atividadesRotina = [
    { n: "Ir à Academia", custo: 50, efeito: () => { p.stats.sau += 10; p.stats.apa += 5; return "Treinei pesado! 💪"; } },
    { n: "Meditar", custo: 0, efeito: () => { p.stats.fel += 10; return "Paz interior... 🧘"; } },
    { n: "Ler Livro", custo: 0, efeito: () => { p.stats.int += 10; return "Fiquei mais culto! 📖"; } },
    { n: "Sair com Amigos", custo: 100, efeito: () => { p.stats.fel += 20; return "Foi divertido! 🍻"; } }
];

// --- 3. FUNÇÕES DE INTERFACE (A CHAVE PARA FUNCIONAR) ---

function abrirModal(titulo, html) {
    const modal = document.getElementById('modal');
    const mContent = document.getElementById('m-content');
    const mTitle = document.getElementById('modal-title');
    
    mTitle.innerText = titulo;
    mContent.innerHTML = html;
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
    update();
}

// --- 4. AS FUNÇÕES QUE OS BOTÕES CHAMAM ---

function abrirAtividades() {
    let html = `<div class="menu-scroll">`;
    atividadesRotina.forEach((atv, index) => {
        html += `<button class="btn-opt" onclick="executarAtv(${index})">${atv.n} (R$ ${atv.custo})</button>`;
    });
    html += `<button class="btn-opt" style="background:#e74c3c" onclick="fecharModal(); addLog('Tentei um crime e fugi!');">🎭 Crime (Fuga)</button>`;
    html += `</div>`;
    abrirModal("ROTINA DIÁRIA", html);
}

function executarAtv(index) {
    const atv = atividadesRotina[index];
    if (p.grana >= atv.custo) {
        p.grana -= atv.custo;
        const msg = atv.efeito();
        addLog(msg, "var(--primary)");
        fecharModal();
    } else {
        alert("Dinheiro insuficiente!");
    }
}

function abrirSocial() {
    let html = `
        <div class="menu-scroll">
            <button class="btn-opt" onclick="fecharModal(); spawnTinder();">🔥 Tinder</button>
            <button class="btn-opt" onclick="fecharModal(); addLog('Passei tempo com a família');">👨‍👩‍👧 Família</button>
        </div>
    `;
    abrirModal("SOCIAL", html);
}

function abrirJobs() {
    let html = `
        <div class="menu-scroll">
            <button class="btn-opt" onclick="fecharModal(); p.job={n:'Vendedor', sal:2000}; addLog('Novo emprego: Vendedor');">💼 Vendedor (R$ 2.000)</button>
            <button class="btn-opt" onclick="fecharModal(); p.job={n:'Gari', sal:1500}; addLog('Novo emprego: Gari');">🧹 Gari (R$ 1.500)</button>
        </div>
    `;
    abrirModal("OCUPAÇÃO", html);
}

function abrirAtivos() {
    let html = `
        <div class="menu-scroll">
            <p style="color:white">Dinheiro: R$ ${p.grana}</p>
            <p style="color:white">Emprego: ${p.job ? p.job.n : "Desempregado"}</p>
        </div>
    `;
    abrirModal("MEUS BENS", html);
}

// --- 5. LOGICA DE JOGO ---

function envelhecer() {
    p.idade++;
    if (p.job) p.grana += p.job.sal;
    p.stats.fel -= 5; // Cansaço da idade
    addLog("Um novo ano começou.");
    update();
}

function update() {
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('v-name').innerText = p.nome;
    
    document.getElementById('bar-happy').style.width = Math.min(100, p.stats.fel) + "%";
    document.getElementById('bar-health').style.width = Math.min(100, p.stats.sau) + "%";
    document.getElementById('bar-smart').style.width = Math.min(100, p.stats.int) + "%";
    document.getElementById('bar-looks').style.width = Math.min(100, p.stats.apa) + "%";
}

function addLog(msg, cor = "#fff") {
    const log = document.getElementById('event-log');
    log.insertAdjacentHTML('afterbegin', `<div class="log-item" style="border-left:4px solid ${cor}">Ano ${p.idade}: ${msg}</div>`);
}

function spawnTinder() {
    addLog("💖 Match no Tinder! Você começou a namorar.", "pink");
    p.stats.fel = 100;
    update();
}

// Inicializa
window.onload = update;
