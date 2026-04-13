// --- DADOS DO JOGO ---
const NOVO_PERSONAGEM = (nome = "Carlos") => ({
    id: Date.now(),
    nome: nome, idade: 18, grana: 1500,
    stats: { fel: 50, int: 50, sau: 80, apa: 50 },
    job: null, faltas: 0,
    redes: {
        instagram: { ativa: false, seguidores: 0, posts: 0 },
        tiktok: { ativa: false, seguidores: 0, posts: 0 }
    }
});

let p = NOVO_PERSONAGEM();

const empregos = [
    { n: "Gari", s: 1500, e: "🧹" }, { n: "Vendedor", s: 2200, e: "👕" }, { n: "Caixa", s: 1800, e: "🛒" },
    { n: "Motoboy", s: 2500, e: "🏍️" }, { n: "Pedreiro", s: 3000, e: "🧱" }, { n: "Segurança", s: 2800, e: "🛡️" },
    { n: "Garçom", s: 1600, e: "☕" }, { n: "Cozinheiro", s: 3500, e: "👨‍🍳" }, { n: "Motorista", s: 2400, e: "🚗" },
    { n: "Porteiro", s: 1900, e: "🔑" }, { n: "TI Junior", s: 4500, e: "💻" }, { n: "Designer", s: 4000, e: "🎨" },
    { n: "Professor", s: 3200, e: "📚" }, { n: "Enfermeiro", s: 5000, e: "💉" }, { n: "Advogado", s: 8500, e: "⚖️" },
    { n: "Médico", s: 15000, e: "🏥" }, { n: "Piloto", s: 12000, e: "✈️" }, { n: "YouTuber", s: 2500, e: "🎥" },
    { n: "Modelo", s: 5000, e: "📸" }, { n: "Policial", s: 4800, e: "👮" }, { n: "Bombeiro", s: 4700, e: "👩‍🚒" },
    { n: "DJ", s: 3000, e: "🎧" }, { n: "Padeiro", s: 2100, e: "🥖" }, { n: "Barbeiro", s: 2800, e: "💈" },
    { n: "Eletricista", s: 3200, e: "⚡" }, { n: "Encanador", s: 3100, e: "🔧" }, { n: "Jornalista", s: 3800, e: "🎤" },
    { n: "Arquiteto", s: 7500, e: "📐" }, { n: "Dentista", s: 9000, e: "🦷" }, { n: "Veterinário", s: 6500, e: "🐾" },
    { n: "Atleta", s: 4500, e: "⚽" }, { n: "Cantor", s: 3500, e: "🎤" }, { n: "Ator", s: 5500, e: "🎭" },
    { n: "Cientista", s: 8500, e: "🧪" }, { n: "Astronauta", s: 25000, e: "🚀" }, { n: "Fazendeiro", s: 2200, e: "🚜" },
    { n: "Pescador", s: 1800, e: "🎣" }, { n: "Juiz", s: 32000, e: "🏛️" }, { n: "Político", s: 18000, e: "📜" },
    { n: "Empresário", s: 12000, e: "💼" }
];

// --- CORE ---
function abrirModal(t, h) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = t;
    document.getElementById('m-content').innerHTML = h;
}
function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }

function addLog(m, c = "#444") {
    const log = document.getElementById('event-log');
    log.insertAdjacentHTML('afterbegin', `<div class="log-item" style="border-left-color:${c}"><b>Ano ${p.idade}</b>: ${m}</div>`);
}

// --- EMPREGOS ---
function abrirJobs() {
    if (p.job) {
        abrirModal("EMPREGO ATUAL", `
            <div class="work-anim">${p.job.e}</div>
            <p>Trabalhando como ${p.job.n}</p>
            <p>Salário: R$ ${p.job.s.toLocaleString()}</p>
            <button class="btn-opt" style="background:orange; margin-top:15px" onclick="faltar()">🚪 Faltar ao Trabalho</button>
            <button class="btn-opt" style="background:red" onclick="p.job=null; fecharModal(); addLog('Você se demitiu.')">🚶 Pedir Demissão</button>
        `);
    } else {
        let h = "";
        empregos.forEach(j => h += `<button class="btn-opt" onclick="contratar('${j.n}',${j.s},'${j.e}')">${j.e} ${j.n} (R$ ${j.s})</button>`);
        abrirModal("VAGAS", h);
    }
}

function contratar(n, s, e) { p.job = { n, s, e }; p.faltas = 0; addLog(`💼 Iniciou como ${n}`); fecharModal(); }

function faltar() {
    p.faltas++;
    document.getElementById('game-container').classList.add('shake');
    setTimeout(() => document.getElementById('game-container').classList.remove('shake'), 500);
    
    let multa = Math.floor(p.job.s * 0.1);
    p.grana -= multa;
    let msg = ""; let boss = "😠";

    if (p.faltas == 1) msg = "O chefe gritou com você!";
    else if (p.faltas == 2) { boss = "😡"; msg = `Multa de R$ ${multa} por faltar!`; }
    else { boss = "🤬"; msg = "VOCÊ FOI DEMITIDO!"; p.job = null; }

    abrirModal("CHEFE", `<div style="font-size:50px">${boss}</div><p>${msg}</p>`);
    addLog(`🚫 Falta: ${msg}`, "red");
}

// --- REDES SOCIAIS ---
function abrirSocial() {
    let h = `
        <button class="btn-opt btn-insta" onclick="menuRede('instagram')">📸 Instagram ${p.redes.instagram.ativa ? `(${p.redes.instagram.seguidores})` : '(Criar)'}</button>
        <button class="btn-opt btn-tiktok" onclick="menuRede('tiktok')">📱 TikTok ${p.redes.tiktok.ativa ? `(${p.redes.tiktok.seguidores})` : '(Criar)'}</button>
        <button class="btn-opt" onclick="fecharModal(); p.stats.fel+=10; addLog('Tempo com a família.')">👨‍👩‍👧 Família</button>
    `;
    abrirModal("SOCIAL", h);
}

function menuRede(r) {
    if (!p.redes[r].ativa) {
        abrirModal(r, `<button class="btn-opt" onclick="p.redes['${r}'].ativa=true; fecharModal(); addLog('Criou conta no ${r}')">✅ Criar Conta</button>`);
    } else {
        abrirModal(r, `
            <p>Seguidores: ${p.redes[r].seguidores}</p>
            <button class="btn-opt" onclick="postar('${r}','selfie')">🤳 Selfie</button>
            <button class="btn-opt" onclick="postar('${r}','dança')">💃 Dança</button>
            <button class="btn-opt" onclick="postar('${r}','polêmica')">☣️ Polêmica</button>
        `);
    }
}

function postar(r, t) {
    if (p.redes[r].posts > 3) return alert("Limite anual!");
    let ganho = Math.floor(Math.random() * (p.stats.apa + 10));
    if (t == 'polêmica') ganho = Math.random() > 0.5 ? ganho * 5 : -100;
    if (Math.random() > 0.95) { ganho *= 10; addLog("🚀 VIRALIZOU!", "gold"); }
    
    p.redes[r].seguidores = Math.max(0, p.redes[r].seguidores + ganho);
    p.redes[r].posts++;
    addLog(`📱 ${r}: Postou ${t} (${ganho} seg.)`);
    fecharModal();
}

// --- SISTEMA DE VIDAS ---
function abrirAtivos() {
    let saves = JSON.parse(localStorage.getItem('bit_saves') || "[]");
    let h = `<h3>Dinheiro: R$ ${p.grana.toLocaleString()}</h3>
             <button class="btn-opt" style="background:#3498db" onclick="novaVida()">+ Nova Vida</button>
             <div style="margin-top:10px">`;
    saves.forEach(s => {
        h += `<div style="display:flex; justify-content:space-between; background:#2d3640; padding:10px; margin-bottom:5px; border-radius:10px">
                <span>${s.nome} (${s.idade}a)</span>
                <button onclick="carregarVida(${s.id})" style="background:green; color:white; border:none; padding:5px 10px; border-radius:5px">Carregar</button>
              </div>`;
    });
    h += `</div>`;
    abrirModal("ATIVOS / VIDAS", h);
}

function carregarVida(id) {
    let saves = JSON.parse(localStorage.getItem('bit_saves'));
    p = saves.find(s => s.id === id);
    document.getElementById('event-log').innerHTML = "";
    fecharModal();
}

function novaVida() {
    salvar();
    p = NOVO_PERSONAGEM(prompt("Nome do Personagem:") || "Carlos");
    document.getElementById('event-log').innerHTML = "";
    fecharModal();
}

function salvar() {
    let saves = JSON.parse(localStorage.getItem('bit_saves') || "[]");
    const idx = saves.findIndex(s => s.id === p.id);
    if (idx !== -1) saves[idx] = p; else saves.push(p);
    localStorage.setItem('bit_saves', JSON.stringify(saves));
    localStorage.setItem('bit_curr', JSON.stringify(p));
}

// --- ENGINE ---
function envelhecer() {
    p.idade++;
    if (p.job) p.grana += p.job.s;
    p.redes.instagram.posts = 0;
    p.redes.tiktok.posts = 0;
    addLog("Mais um ano se passou.");
    salvar();
    update();
}

function update() {
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('v-name').innerText = p.nome;
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
}

function abrirAtividades() {
    abrirModal("ROTINA", `<button class="btn-opt" onclick="p.stats.sau+=10; fecharModal(); addLog('Academia feita.')">🏋️ Academia (Gratis)</button>`);
}

window.onload = () => {
    const curr = localStorage.getItem('bit_curr');
    if (curr) p = JSON.parse(curr);
    update();
};
