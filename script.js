// --- ESTADO INICIAL ---
let p = {
    nome: "Carlos", sobrenome: "Silva", idade: 0, grana: 100,
    stats: { fel: 50, int: 50, sau: 80, apa: 50 },
    vivo: true, job: null, namorada: null, 
    formacao: null, imoveis: [], veiculos: [],
    familia: [{tipo: "Pai", rel: 80}, {tipo: "Mãe", rel: 90}]
};

const DB = {
    faculdade: [
        {n: "Direito", anos: 5, intReq: 70},
        {n: "Medicina", anos: 6, intReq: 85},
        {n: "TI", anos: 4, intReq: 60}
    ],
    carros: [
        {n: "Celta Usado", v: 15000, manut: 200},
        {n: "Civic", v: 110000, manut: 800}
    ],
    casas: [
        {n: "Apartamento", v: 250000, manut: 1200},
        {n: "Mansão", v: 5000000, manut: 15000}
    ]
};

// --- MOTOR DE ENVELHECIMENTO ---
function envelhecer() {
    if (!p.vivo) return;
    p.idade++;

    // Economia
    if (p.job) p.grana += p.job.sal;
    p.veiculos.forEach(v => p.grana -= v.manut);
    p.imoveis.forEach(i => p.grana -= i.manut);

    // Eventos
    let sorte = Math.random();
    if (p.idade > 18 && sorte > 0.8) spawnTinder();
    if (sorte < 0.1) addLog("Você estudou um pouco mais e ficou mais inteligente.", "var(--social)");

    if (p.stats.sau <= 0 || (p.idade > 80 && Math.random() < 0.15)) morrer();
    update();
}

// --- SISTEMA DE MORTE E HERANÇA ---
function morrer() {
    p.vivo = false;
    alert(`Morreu aos ${p.idade} anos. Seu filho herdou R$ ${(p.grana * 0.8).toLocaleString()}`);
    let heranca = p.grana * 0.8;
    p = { nome: "Júnior", sobrenome: p.sobrenome, idade: 0, grana: heranca, stats: {fel:50, int:60, sau:100, apa:50}, vivo:true, job:null, imoveis:[], veiculos:[], familia:[] };
    document.getElementById('event-log').innerHTML = "";
    update();
}

// --- SHOPPING & ATIVOS ---
function abrirAtividades() {
    const c = document.getElementById('m-content');
    c.innerHTML = `
        <button class="btn-opt" onclick="menuShopping('carros')">🚗 COMPRAR CARRO</button>
        <button class="btn-opt" onclick="menuShopping('casas')">🏠 COMPRAR CASA</button>
        <button class="btn-opt" style="background:red" onclick="iniciarMiniGameFuga()">🎭 ASSALTAR</button>
        <button class="btn-opt" onclick="menuEdu()">🎓 FACULDADE</button>
    `;
    abrirModal("ATIVIDADES");
}

function menuShopping(tipo) {
    const items = DB[tipo];
    let html = `<h3>Loja de ${tipo}</h3>`;
    items.forEach(i => {
        html += `<button class="btn-opt" onclick="comprar('${tipo}', '${i.n}')">${i.n} - R$ ${i.v}</button>`;
    });
    document.getElementById('m-content').innerHTML = html;
}

function comprar(tipo, nome) {
    const item = DB[tipo].find(x => x.n === nome);
    if (p.grana >= item.v) {
        p.grana -= item.v;
        if (tipo === 'carros') p.veiculos.push(item);
        else p.imoveis.push(item);
        addLog(`💰 Você comprou um(a) ${nome}!`);
        fecharModal();
    } else { alert("Sem dinheiro!"); }
}

// --- FACULDADE ---
function menuEdu() {
    let html = "<h3>Escolha um curso</h3>";
    DB.faculdade.forEach(f => {
        html += `<button class="btn-opt" onclick="entrarFaculdade('${f.n}')">${f.n} (Int: ${f.intReq})</button>`;
    });
    document.getElementById('m-content').innerHTML = html;
}

function entrarFaculdade(nome) {
    const curso = DB.faculdade.find(f => f.n === nome);
    if (p.stats.int >= curso.intReq) {
        p.formacao = nome;
        addLog(`🎓 Você se formou em ${nome}!`);
        fecharModal();
    } else { alert("Você não é inteligente o suficiente!"); }
}

// --- UTILITÁRIOS INTERFACE ---
function update() {
    document.getElementById('v-money').innerText = "R$ " + Math.floor(p.grana).toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
}

function addLog(msg, cor = "#2d3640") {
    const log = document.getElementById('event-log');
    log.insertAdjacentHTML('afterbegin', `<div class="log-item" style="border-left:4px solid ${cor}"><b>Ano ${p.idade}</b>: ${msg}</div>`);
}

function abrirModal(t) { document.getElementById('modal').style.display = 'flex'; document.getElementById('modal-title').innerText = t; }
function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }

// --- TINDER & MINI-GAME (Reutilizando as funções anteriores) ---
function spawnTinder() {
    const html = `<div class="log-item tinder-card"><b>🔥 TINDER</b><br><div class="tinder-btns"><button class="btn-like" onclick="addLog('Namoro iniciado!')">Like</button><button class="btn-dislike" onclick="update()">Dislike</button></div></div>`;
    document.getElementById('event-log').insertAdjacentHTML('afterbegin', html);
}

update();
