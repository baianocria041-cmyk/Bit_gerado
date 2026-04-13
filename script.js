// --- ESTADO GLOBAL DO JOGADOR ---
let p = {
    nome: "Carlos", sobrenome: "Silva", idade: 18, grana: 1250,
    stats: { fel: 50, int: 60, sau: 80, apa: 50 },
    vivo: true, preso: false, namorada: null, job: null,
    imoveis: [], veiculos: [], formacao: null
};

// --- BANCO DE DADOS ---
const DB = {
    faculdade: [
        {n: "Direito", anos: 5, intReq: 70},
        {n: "Medicina", anos: 6, intReq: 85},
        {n: "TI", anos: 4, intReq: 60}
    ],
    empregos: [
        {n: "Vendedor", sal: 2500}, {n: "Desenvolvedor", sal: 5000, req: "TI"},
        {n: "Advogado", sal: 8000, req: "Direito"}, {n: "Médico", sal: 15000, req: "Medicina"}
    ],
    loja: {
        carros: [{n: "Celta", v: 15000, m: 200}, {n: "Civic", v: 110000, m: 800}],
        casas: [{n: "Apartamento", v: 250000, m: 1200}, {n: "Mansão", v: 5000000, m: 15000}]
    }
};

// --- FUNÇÃO PRINCIPAL: ENVELHECER ---
function envelhecer() {
    if (!p.vivo) return;

    // 1. Limpeza de Segurança (Evita travar o scroll)
    const log = document.getElementById('event-log');
    if (log.children.length > 30) log.removeChild(log.lastChild);

    p.idade++;

    // 2. Economia (Salário - Manutenção)
    if (p.job) p.grana += p.job.sal;
    p.veiculos.forEach(v => p.grana -= v.m);
    p.imoveis.forEach(i => p.grana -= i.m);

    // 3. Eventos Aleatórios
    let sorte = Math.random();
    if (sorte > 0.8) spawnTinder();
    else if (sorte < 0.15) {
        p.stats.sau -= 20;
        addLog("Você adoeceu seriamente e perdeu saúde. 🤒", "red");
    }

    // 4. Checagem de Morte
    if (p.stats.sau <= 0 || (p.idade > 80 && Math.random() < 0.2)) {
        morrer();
        return;
    }

    update();
}

// --- SISTEMA DE MORTE E HERANÇA ---
function morrer() {
    p.vivo = false;
    let heranca = p.grana * 0.8;
    alert(`💀 Fim da vida aos ${p.idade} anos.\nPatrimônio: R$ ${p.grana.toLocaleString()}\nSeu herdeiro recebeu R$ ${heranca.toLocaleString()}.`);
    
    // Reseta para o Herdeiro
    p = { 
        nome: "Carlos Jr", sobrenome: p.sobrenome, idade: 0, grana: heranca,
        stats: { fel: 50, int: 70, sau: 100, apa: 50 },
        vivo: true, preso: false, namorada: null, job: null, imoveis: [], veiculos: []
    };
    document.getElementById('event-log').innerHTML = "";
    addLog("Vida nova iniciada como herdeiro!", "var(--primary)");
    update();
}

// --- MINI-GAME DE FUGA (ASSALTO) ---
function iniciarMiniGameFuga() {
    const html = `
        <div style="text-align:center">
            <p>A polícia te cercou! Clique no verde!</p>
            <div style="width:100%; height:30px; background:#333; position:relative; margin:15px 0; overflow:hidden">
                <div id="bar-fuga" style="width:30px; height:100%; background:red; position:absolute; animation: moveBar 0.8s infinite alternate linear"></div>
                <div style="width:40px; height:100%; background:green; position:absolute; left:50%; transform:translateX(-50%); opacity:0.5"></div>
            </div>
            <button class="btn-opt" onclick="tentarFuga()">ESCAPAR!</button>
        </div>`;
    abrirModal("🚓 TENTATIVA DE FUGA", html);
}

function tentarFuga() {
    const bar = document.getElementById('bar-fuga');
    const pos = bar.offsetLeft;
    const containerWidth = bar.parentElement.offsetWidth;
    const centro = containerWidth / 2;

    if (Math.abs(pos - (centro - 15)) < 30) {
        addLog("🕊️ Fuga espetacular! Você escapou!", "var(--primary)");
        fecharModal();
    } else {
        p.preso = true;
        p.job = null;
        addLog("⛓️ Preso! Você perdeu tudo e foi para a cadeia.", "orange");
        fecharModal();
    }
}

// --- INTERFACE E MENUS ---
function update() {
    try {
        document.getElementById('v-money').innerText = "R$ " + Math.floor(p.grana).toLocaleString();
        document.getElementById('v-age').innerText = p.idade + " anos";
        document.getElementById('v-name').innerText = `${p.nome} ${p.sobrenome}`;
        
        document.getElementById('bar-happy').style.width = p.stats.fel + "%";
        document.getElementById('bar-smart').style.width = p.stats.int + "%";
        document.getElementById('bar-health').style.width = p.stats.sau + "%";
        document.getElementById('bar-looks').style.width = p.stats.apa + "%";
    } catch(e) {}
}

function addLog(msg, cor = "#2d3640") {
    const log = document.getElementById('event-log');
    log.insertAdjacentHTML('afterbegin', `<div class="log-item" style="border-left:4px solid ${cor}"><b>Ano ${p.idade}</b>: ${msg}</div>`);
}

function abrirModal(titulo, html) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('m-content').innerHTML = html;
}

function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }

// --- ATIVIDADES (SHOPPING, EDUCAÇÃO, CRIMES) ---
function abrirAtividades() {
    let html = `
        <button class="btn-opt" onclick="menuShop('carros')">🚗 COMPRAR VEÍCULO</button>
        <button class="btn-opt" onclick="menuShop('casas')">🏠 IMOBILIÁRIA</button>
        <button class="btn-opt" onclick="menuEdu()">🎓 EDUCAÇÃO</button>
        <button class="btn-opt" style="background:#e74c3c" onclick="iniciarMiniGameFuga()">🎭 COMETER CRIME</button>
    `;
    abrirModal("ATIVIDADES", html);
}

function menuShop(tipo) {
    let html = "";
    DB.loja[tipo].forEach(i => {
        html += `<button class="btn-opt" onclick="comprar('${tipo}', '${i.n}')">${i.n} - R$ ${i.v}</button>`;
    });
    abrirModal("SHOPPING", html);
}

function comprar(tipo, nome) {
    const item = DB.loja[tipo].find(x => x.n === nome);
    if (p.grana >= item.v) {
        p.grana -= item.v;
        if (tipo === 'carros') p.veiculos.push(item);
        else p.imoveis.push(item);
        addLog(`💰 Comprado: ${nome}!`);
        fecharModal();
    } else { alert("Saldo insuficiente!"); }
}

function menuEdu() {
    let html = "";
    DB.faculdade.forEach(f => {
        html += `<button class="btn-opt" onclick="estudar('${f.n}')">${f.n} (Requer ${f.intReq} Int)</button>`;
    });
    abrirModal("UNIVERSIDADE", html);
}

function estudar(nome) {
    const f = DB.faculdade.find(x => x.n === nome);
    if (p.stats.int >= f.intReq) {
        p.formacao = nome;
        addLog(`🎓 Formado em ${nome}!`);
        fecharModal();
    } else { alert("Inteligência baixa!"); }
}

function abrirJobs() {
    let html = "";
    DB.empregos.forEach(j => {
        html += `<button class="btn-opt" onclick="contratar('${j.n}')">${j.n} - R$ ${j.sal}</button>`;
    });
    abrirModal("EMPREGOS", html);
}

function contratar(nome) {
    const j = DB.empregos.find(x => x.n === nome);
    if (!j.req || p.formacao === j.req) {
        p.job = j;
        addLog(`💼 Novo emprego: ${nome}!`);
        fecharModal();
    } else { alert(`Requer diploma de ${j.req}!`); }
}

function spawnTinder() {
    const html = `
        <div class="log-item" style="border:2px solid #e67e22; text-align:center">
            <b>🔥 TINDER</b><br><small>Novo Match!</small><br>
            <button class="btn-age" style="width:40px; height:40px; font-size:15px; display:inline-block" onclick="addLog('💖 Iniciou um namoro!', 'pink'); fecharModal();">❤</button>
        </div>`;
    document.getElementById('event-log').insertAdjacentHTML('afterbegin', html);
}

// Inicialização
window.onload = update;
