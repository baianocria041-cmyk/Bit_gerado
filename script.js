// --- 1. ESTADO GLOBAL DO JOGADOR ---
let p = {
    nome: "Carlos", sobrenome: "Silva", idade: 18, grana: 1250,
    stats: { fel: 50, sau: 80, int: 60, apa: 50 },
    vivo: true, preso: false, herdeiro: "Filho", namorada: null,
    job: null, path: "", level: -1
};

// --- 2. BANCO DE DADOS (EMPREGOS E CRIMES) ---
const DB = {
    comum: [
        {n: "Gari", sal: 2200}, {n: "Entregador", sal: 2500}, 
        {n: "Vendedor", sal: 2800}, {n: "Cozinheiro", sal: 3200},
        {n: "Eletricista", sal: 3800}, {n: "Recepcionista", sal: 2400},
        {n: "Segurança", sal: 3000}, {n: "Motorista", sal: 3500}
    ],
    crimes: [
        { n: "Furtar Loja", ganho: 500, risco: 30 },
        { n: "Roubar Carro", ganho: 12000, risco: 65 },
        { n: "Assalto a Banco", ganho: 150000, risco: 85 }
    ]
};

// --- 3. MOTOR PRINCIPAL (ENVELHECER) ---
function envelhecer() {
    if (!p.vivo) return;
    p.idade++;

    // Salário e Economia
    if (p.job) p.grana += p.job.sal;
    
    // Sorteio de Eventos
    let sorte = Math.random();
    if (sorte > 0.8) spawnTinder();
    else if (sorte < 0.15) processarDoenca();

    // Lógica de Morte por Idade ou Saúde
    if (p.stats.sau <= 0 || (p.idade > 70 && Math.random() < 0.1)) {
        morrer("Causas Naturais");
        return;
    }

    update();
}

// --- 4. SISTEMA DE MORTE E HERDEIRO ---
function morrer(motivo) {
    p.vivo = false;
    const msg = `💀 Você morreu de ${motivo} aos ${p.idade} anos.\nPatrimônio: R$ ${p.grana.toLocaleString()}.\nSeu ${p.herdeiro} herdou sua fortuna.`;
    
    alert(msg);
    // Reinicia o jogo mantendo 80% da grana (Herança)
    let granaHerdada = p.grana * 0.8;
    p = {
        nome: "Júnior", sobrenome: p.sobrenome, idade: 0, grana: granaHerdada,
        stats: { fel: 50, sau: 100, int: 70, apa: 50 },
        vivo: true, preso: false, herdeiro: "Filho", namorada: null, job: null
    };
    document.getElementById('event-log').innerHTML = "";
    addLog("Vida nova iniciada como herdeiro!", "var(--primary)");
    update();
}

// --- 5. MINI-GAME DE FUGA (PRISÃO/CRIME) ---
function iniciarMiniGameFuga() {
    const body = document.getElementById('m-content');
    body.innerHTML = `
        <div style="text-align:center">
            <p>A polícia te cercou! Fuja no momento certo!</p>
            <div style="width:100%; height:20px; background:#444; border-radius:10px; margin:20px 0; position:relative; overflow:hidden">
                <div id="bar-fuga" style="width:20px; height:100%; background:red; position:absolute; animation: moveBar 1s infinite alternate linear"></div>
            </div>
            <button class="btn-like" style="width:100%" onclick="tentarFuga()">ESCAPAR!</button>
        </div>
    `;
    abrirModal("🚓 TENTATIVA DE FUGA");
}

function tentarFuga() {
    const bar = document.getElementById('bar-fuga');
    const pos = bar.offsetLeft;
    // Se a barra estiver no meio (entre 120 e 180px aprox)
    if (pos > 100 && pos < 200) {
        addLog("🕊️ Você deu um drible na polícia e escapou!", "var(--primary)");
        fecharModal();
    } else {
        p.preso = true;
        addLog("⛓️ Você foi preso e perdeu o emprego.", "orange");
        p.job = null;
        fecharModal();
    }
}

// --- 6. TINDER ---
function spawnTinder() {
    const nomes = ["Marina", "Julia", "Beatriz", "Sophia"];
    let n = nomes[Math.floor(Math.random()*nomes.length)];
    const html = `
        <div class="log-item tinder-card">
            <b>🔥 TINDER 🧡</b><br>
            <small>Match com ${n}. Dar like?</small>
            <div class="tinder-btns">
                <button class="btn-like" onclick="tinderResp(true, '${n}')">Like</button>
                <button class="btn-dislike" onclick="tinderResp(false)">Dislike</button>
            </div>
        </div>`;
    document.getElementById('event-log').insertAdjacentHTML('afterbegin', html);
}

function tinderResp(sim, nome) {
    if (sim) {
        p.namorada = nome;
        p.stats.fel = 100;
        addLog(`💕 Você está namorando ${nome}!`, "#2ecc71");
    } else {
        addLog("Você ignorou o match.");
    }
    update();
}

// --- 7. EMPREGOS (COM ROLAGEM) ---
function abrirJobs() {
    const body = document.getElementById('m-content');
    body.style.maxHeight = "300px";
    body.style.overflowY = "auto";
    
    let html = "<h3>Empregos Disponíveis</h3>";
    DB.comum.forEach(j => {
        html += `
            <div class="log-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px">
                <span>${j.n} <br><small>R$ ${j.sal}</small></span>
                <button onclick="setJob('${j.n}', ${j.sal})" style="padding:5px 10px; background:var(--primary); border:none; border-radius:5px">ASSINAR</button>
            </div>`;
    });
    body.innerHTML = html;
    abrirModal("CARREIRA");
}

function setJob(nome, salario) {
    p.job = {n: nome, sal: salario};
    addLog(`💼 Comecei a trabalhar como ${nome}!`);
    fecharModal();
}

// --- 8. UTILITÁRIOS ---
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

function abrirModal(t) { document.getElementById('modal').style.display = 'flex'; document.getElementById('modal-title').innerText = t; }
function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }
function processarDoenca() { p.stats.sau -= 20; addLog("🤒 Você adoeceu seriamente.", "red"); }

// Ativar botões extras
function abrirAtividades() {
    const body = document.getElementById('m-content');
    body.innerHTML = `
        <button class="btn-close" style="background:#e67e22; width:100%; margin-bottom:10px" onclick="iniciarMiniGameFuga()">🎭 ASSALTAR (CRIME)</button>
        <button class="btn-close" style="background:#3498db; width:100%" onclick="p.stats.sau=100; fecharModal(); addLog('🏥 Fui ao médico e recuperei a saúde.')">🏥 IR AO MÉDICO</button>
    `;
    abrirModal("ATIVIDADES");
}

function abrir(tipo) {
    if (tipo === 'jobs') abrirJobs();
    else if (tipo === 'assets') {
        abrirModal("ATIVOS");
        document.getElementById('m-content').innerHTML = `<p>Dinheiro: R$ ${p.grana.toLocaleString()}</p><p>Herdeiro: ${p.herdeiro}</p>`;
    } else {
        abrirModal(tipo.toUpperCase());
        document.getElementById('m-content').innerHTML = "Em breve...";
    }
}

update();
