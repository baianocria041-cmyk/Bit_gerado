// --- ESTADO INICIAL ---
const NOVO_PERSONAGEM = () => ({
    id: Date.now(),
    nome: "Carlos", sobrenome: "Silva", idade: 18, grana: 1250,
    stats: { fel: 50, int: 60, sau: 80, apa: 50 },
    vivo: true, job: null, imoveis: [], veiculos: [],
    redes: { instagram: { ativa: false, seguidores: 0 }, tiktok: { ativa: false, seguidores: 0 } }
});

let p = NOVO_PERSONAGEM();

// --- CARREGAR DADOS AO INICIAR ---
window.onload = () => {
    const salvo = localStorage.getItem('bitlife_current');
    if (salvo) p = JSON.parse(salvo);
    update();
};

// --- BASE DE DADOS ---
const rotinas = [
    { n: "🏋️ Ir à Academia", c: 50, f: () => { p.stats.sau += 10; p.stats.apa += 5; return "Treinei pesado!"; } },
    { n: "🧘 Meditar", c: 0, f: () => { p.stats.fel += 10; return "Paz interior..."; } },
    { n: "📖 Ler Livro", c: 0, f: () => { p.stats.int += 10; return "Fiquei mais culto!"; } }
];

const empregos = [{ n: "Gari", s: 1500 }, { n: "Vendedor", s: 2200 }, { n: "Caixa", s: 1800 }];

// --- GERENCIAMENTO DE VIDAS ---
function salvarVida() {
    let saves = JSON.parse(localStorage.getItem('bitlife_saves') || "[]");
    const index = saves.findIndex(s => s.id === p.id);
    if (index !== -1) saves[index] = p; else saves.push(p);
    localStorage.setItem('bitlife_saves', JSON.stringify(saves));
    localStorage.setItem('bitlife_current', JSON.stringify(p));
}

function novaVida() {
    if (confirm("Deseja salvar a vida atual e começar uma nova?")) {
        salvarVida();
        p = NOVO_PERSONAGEM();
        p.nome = prompt("Nome do novo personagem:", "Carlos") || "Carlos";
        document.getElementById('event-log').innerHTML = "";
        fecharModal();
        addLog(`✨ Uma nova vida começou: ${p.nome}!`);
        salvarVida();
    }
}

function abrirAtivos() {
    let saves = JSON.parse(localStorage.getItem('bitlife_saves') || "[]");
    let html = `<h3>Meus Bens</h3>
                <p>💰 Dinheiro: R$ ${p.grana.toLocaleString()}</p>
                <hr style="margin:10px 0; opacity:0.3">
                <h4>Gerenciar Vidas</h4>
                <button class="btn-opt" onclick="novaVida()" style="background:#3498db; margin-top:10px">+ Começar Nova Vida</button>
                <div style="margin-top:10px; max-height:150px; overflow-y:auto">`;
    
    saves.forEach(s => {
        html += `<div class="save-card">
                    <span style="font-size:12px">${s.nome} (${s.idade} anos)</span>
                    <button class="btn-load" onclick="carregarVida(${s.id})">Carregar</button>
                 </div>`;
    });
    html += `</div>`;
    abrirModal("ATIVOS", html);
}

function carregarVida(id) {
    salvarVida();
    let saves = JSON.parse(localStorage.getItem('bitlife_saves'));
    p = saves.find(s => s.id === id);
    document.getElementById('event-log').innerHTML = "";
    addLog(`🔄 Vida de ${p.nome} carregada.`);
    fecharModal();
}

// --- OUTRAS FUNÇÕES (REPETIDAS PARA MANTER O CÓDIGO TODO) ---
function abrirModal(titulo, html) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('m-content').innerHTML = html;
}
function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }

function addLog(msg, cor = "#2d3640") {
    const log = document.getElementById('event-log');
    log.insertAdjacentHTML('afterbegin', `<div class="log-item" style="border-left:4px solid ${cor}"><b>Ano ${p.idade}</b>: ${msg}</div>`);
}

function envelhecer() {
    if (!p.vivo) return;
    p.idade++;
    if (p.job) p.grana += p.job.s;
    p.stats.fel -= 5; p.stats.sau -= 2;
    addLog("Um novo ano começou.");
    salvarVida();
    update();
}

function update() {
    document.getElementById('v-money').innerText = "R$ " + Math.floor(p.grana).toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('v-name').innerText = p.nome + " " + p.sobrenome;
    document.getElementById('bar-happy').style.width = Math.max(0, p.stats.fel) + "%";
    document.getElementById('bar-smart').style.width = Math.max(0, p.stats.int) + "%";
    document.getElementById('bar-health').style.width = Math.max(0, p.stats.sau) + "%";
    document.getElementById('bar-looks').style.width = Math.max(0, p.stats.apa) + "%";
}

function abrirSocial() {
    let html = `<button class="btn-opt" onclick="fecharModal(); addLog('Match no Tinder!'); p.stats.fel=100;">🔥 Tinder</button>
                <button class="btn-opt" onclick="fecharModal(); addLog('Passei tempo com a família.'); p.stats.fel+=10;">👨‍👩‍👧 Família</button>`;
    abrirModal("SOCIAL", html);
}

function abrirJobs() {
    let html = "";
    empregos.forEach(j => { html += `<button class="btn-opt" onclick="contratar('${j.n}', ${j.s})">${j.n} - R$ ${j.s}</button>`; });
    abrirModal("EMPREGOS", html);
}

function contratar(n, s) { p.job = { n, s }; addLog(`💼 Comecei a trabalhar como ${n}!`); fecharModal(); }

function abrirAtividades() {
    let html = "";
    rotinas.forEach((atv, i) => { html += `<button class="btn-opt" onclick="fazerRotina(${i})">${atv.n} (R$ ${atv.c})</button>`; });
    abrirModal("ATIVIDADES", html);
}

function fazerRotina(i) {
    const a = rotinas[i];
    if (p.grana >= a.c) { p.grana -= a.c; addLog(a.f(), "var(--primary)"); fecharModal(); } else { alert("Sem dinheiro!"); }
}
