// --- DATABASE DE 40 EMPREGOS ---
const DB_JOBS = [
    { n: "Gari", s: 1500, e: "🧹", rInt: 0 }, { n: "Caixa", s: 1900, e: "🛒", rInt: 15 },
    { n: "Vendedor", s: 2200, e: "👕", rInt: 20 }, { n: "YouTuber", s: 2800, e: "🎥", rInt: 30 },
    { n: "Modelo", s: 8000, e: "📸", rApa: 85 }, { n: "Cantor", s: 15000, e: "🎤", rInt: 40, rFama: 1000 },
    { n: "Médico", s: 22000, e: "🏥", rInt: 85, rFac: "Medicina" },
    { n: "Advogado", s: 11000, e: "⚖️", rInt: 75, rFac: "Direito" },
    { n: "Juiz", s: 42000, e: "🏛️", rInt: 95, rCon: true, rFac: "Direito" },
    { n: "Policial", s: 6800, e: "👮", rInt: 50, rCon: true },
    { n: "Astronauta", s: 75000, e: "🚀", rInt: 99, rFac: "Física" },
    { n: "Piloto", s: 25000, e: "✈️", rInt: 90, rFac: "Aviação" },
    { n: "Cientista", s: 12500, e: "🧪", rInt: 92, rFac: "Ciência" },
    { n: "Engenheiro", s: 10500, e: "🏗️", rInt: 80, rFac: "Engenharia" },
    { n: "Desenvolvedor", s: 14500, e: "💻", rInt: 82, rFac: "Sistemas" },
    { n: "Jogador", s: 55000, e: "⚽", rInt: 25, rFama: 500 },
    { n: "Chef", s: 6000, e: "👨‍🍳", rInt: 55 }, { n: "Barbeiro", s: 3500, e: "💈", rInt: 30 },
    { n: "Escritor", s: 4800, e: "✍️", rInt: 70 }, { n: "Ator", s: 20000, e: "🎭", rApa: 80, rFama: 2000 },
    { n: "Mecânico", s: 3800, e: "🔧", rInt: 40 }, { n: "Bombeiro", s: 6200, e: "👨‍🚒", rCon: true },
    { n: "Arquiteto", s: 8500, e: "📐", rInt: 75, rFac: "Arquitetura" }, { n: "Psicólogo", s: 7200, e: "🧠", rFac: "Psicologia" },
    { n: "Diplomata", s: 28000, e: "🌍", rInt: 90, rCon: true, rFac: "Letras" }, { n: "Garçom", s: 1700, e: "☕", rInt: 10 },
    { n: "Eletricista", s: 4200, e: "⚡", rInt: 45 }, { n: "Professor", s: 5100, e: "📚", rFac: "Letras" },
    { n: "Padeiro", s: 2300, e: "🥖", rInt: 25 }, { n: "Segurança", s: 3100, e: "🛡️", rInt: 35 },
    { n: "Tradutor", s: 5500, e: "🗣️", rInt: 65, rFac: "Letras" }, { n: "Designer", s: 6800, e: "🎨", rInt: 60, rFac: "Artes" },
    { n: "Dentista", s: 9800, e: "🦷", rInt: 80, rFac: "Odonto" }, { n: "Farmacêutico", s: 8200, e: "💊", rFac: "Farmácia" },
    { n: "Streamer", s: 9000, e: "🎮", rFama: 5000 }, { n: "Fotógrafo", s: 4500, e: "📷", rInt: 50 },
    { n: "Contador", s: 7500, e: "🧾", rInt: 70, rFac: "Economia" }, { n: "Veterinário", s: 8900, e: "🐾", rFac: "Medicina" },
    { n: "Jornalista", s: 5800, e: "🎤", rFac: "Letras" }, { n: "Pescador", s: 1900, e: "🎣", rInt: 15 }
];

// --- ESTADO INICIAL ---
let p = {
    nome: "Valentina", sobrenome: "Pereira", idade: 0, grana: 0,
    stats: { fel: 80, sau: 100, int: 50, apa: 50, notas: 50 },
    job: null, faltas: 0, faculdade: [], logs: [],
    redes: { ig: 0, tt: 0 }
};

// --- CORE FUNCTIONS ---
function salvar() {
    localStorage.setItem('bitlife_mega_save', JSON.stringify(p));
    localStorage.setItem('bitlife_mega_logs', document.getElementById('event-log').innerHTML);
}

function carregar() {
    const s = localStorage.getItem('bitlife_mega_save');
    if (s) {
        p = JSON.parse(s);
        document.getElementById('event-log').innerHTML = localStorage.getItem('bitlife_mega_logs');
        update();
    }
}

function envelhecer() {
    p.idade++;
    if (p.job) p.grana += p.job.s;
    if (p.idade > 6 && p.idade < 18) p.stats.notas = Math.max(0, p.stats.notas - 7);
    
    // Eventos de vida
    addLog(`Você agora tem ${p.idade} anos.`);
    if (p.idade === 6) addLog("🎒 Escola primária começou! Estude para garantir seu futuro.");
    if (p.idade === 18) addLog("🎓 Você se formou no ensino médio!");

    // Chance de eventos aleatórios
    if (Math.random() > 0.85) dispararEventoSocial();

    update();
    salvar();
}

function update() {
    document.getElementById('v-name').innerText = p.nome + " " + p.sobrenome;
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('v-job-title').innerText = p.job ? p.job.n : (p.idade < 18 ? "Estudante" : "Desempregado");
    
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
    document.getElementById('bar-grades').style.width = p.stats.notas + "%";
}

// --- MINI-GAME DE ESFORÇO ---
let countMg = 0;
function playMiniGame(tipo) {
    countMg = 0;
    abrirModal("MINI-GAME: ESFORÇO", `
        <p>Clique 15 vezes no círculo para melhorar seu ${tipo}!</p>
        <div class="target-circle" onclick="clickMg('${tipo}')">CLIQUE</div>
        <p id="mg-text">Progresso: 0/15</p>
    `);
}

function clickMg(tipo) {
    countMg++;
    document.getElementById('mg-text').innerText = `Progresso: ${countMg}/15`;
    if (countMg >= 15) {
        if (tipo === 'Estudo') p.stats.notas = Math.min(100, p.stats.notas + 20);
        else { p.grana += (p.job.s * 0.1); p.stats.fel += 5; }
        addLog(`Sucesso no mini-game! Seu desempenho em ${tipo} subiu.`);
        fecharModal();
    }
}

// --- TRABALHO & OCUPAÇÃO ---
function abrirOcupacao() {
    if (p.idade < 18) {
        return abrirModal("ESCOLA", `
            <p>Seu desempenho escolar: ${p.stats.notas}%</p>
            <button class="btn-choice" onclick="playMiniGame('Estudo')">📖 Estudar Muito</button>
        `);
    }
    
    if (p.job) {
        abrirModal("CARREIRA", `
            <h3>${p.job.e} ${p.job.n}</h3>
            <button class="btn-choice" onclick="playMiniGame('Trabalho')">🔨 Esforçar-se</button>
            <button class="btn-choice" style="color:#e84118" onclick="faltarTrabalho()">🚫 Faltar (Risco)</button>
            <button class="btn-choice" onclick="demissao()">🚪 Pedir Demissão</button>
        `);
    } else {
        let h = "<h3>Vagas Disponíveis</h3>";
        DB_JOBS.forEach(j => {
            let block = (j.rFac && !p.faculdade.includes(j.rFac)) || p.stats.int < (j.rInt || 0);
            h += `<button class="btn-choice" style="opacity:${block?0.5:1}" onclick="tentarContratar('${j.n}')">
                ${j.e} ${j.n} (R$ ${j.s})
            </button>`;
        });
        abrirModal("MERCADO", h);
    }
}

function faltarTrabalho() {
    p.faltas++;
    document.getElementById('game-container').classList.add('shake-anim');
    setTimeout(() => document.getElementById('game-container').classList.remove('shake-anim'), 400);
    
    if (p.faltas >= 3) {
        p.job = null; p.faltas = 0;
        abrirModal("DEMITIDO", "🤬 JUSTA CAUSA! O chefe não aguentou suas faltas e te demitiu.");
        addLog("Você foi demitido por excesso de faltas.", "#e84118");
    } else {
        alert("😠 CHEFE: " + p.faltas + "ª FALTA! Na próxima você está na rua!");
    }
    salvar();
}

// --- ATIVIDADES & REDES ---
function abrirAtividades() {
    abrirModal("ATIVIDADES", `
        <button class="btn-choice" onclick="abrirRede('ig')">📸 Instagram (${p.redes.ig} seg.)</button>
        <button class="btn-choice" onclick="abrirRede('tt')">📱 TikTok (${p.redes.tt} seg.)</button>
        <button class="btn-choice" onclick="irFaculdade()">🎓 Ir para Faculdade</button>
        <button class="btn-choice" style="background:#c23616" onclick="resetGame()">✨ Nova Vida (Reset)</button>
    `);
}

function postar(rede) {
    let ganho = Math.floor(Math.random() * 50) + (p.stats.apa / 2);
    p.redes[rede] += Math.floor(ganho);
    addLog(`Postagem no ${rede.toUpperCase()}! +${Math.floor(ganho)} seguidores.`);
    fecharModal();
    salvar();
}

function abrirRede(r) {
    abrirModal(r.toUpperCase(), `
        <p>Seguidores: ${p.redes[r]}</p>
        <button class="btn-choice" onclick="postar('${r}')">📝 Criar Postagem</button>
    `);
}

function irFaculdade() {
    if (p.idade < 18) return alert("Espere terminar a escola!");
    let cursos = ["Medicina", "Direito", "Engenharia", "Sistemas", "Letras", "Economia"];
    let h = "<h3>Escolha seu curso</h3>";
    cursos.forEach(c => {
        h += `<button class="btn-choice" onclick="fazerCurso('${c}')">${c}</button>`;
    });
    abrirModal("UNIVERSIDADE", h);
}

function fazerCurso(c) {
    if (p.grana < 5000 && c === "Medicina") return alert("Sem dinheiro para a mensalidade!");
    p.faculdade.push(c);
    addLog(`Você se matriculou em ${c}!`);
    fecharModal();
}

// --- AUXILIARES ---
function abrirModal(t, b) { document.getElementById('modal').style.display = 'flex'; document.getElementById('modal-title').innerText = t; document.getElementById('m-body').innerHTML = b; }
function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }
function addLog(m, c = "#fff") { const l = document.getElementById('event-log'); l.innerHTML = `<p style="color:${c}">• ${m}</p>` + l.innerHTML; }
function resetGame() { if(confirm("Deseja apagar esta vida?")) { localStorage.clear(); location.reload(); } }
function tentarContratar(n) { 
    let j = DB_JOBS.find(x => x.n === n); 
    if (j.rFac && !p.faculdade.includes(j.rFac)) return alert("Requer diploma em " + j.rFac);
    p.job = j; addLog(`Você agora é ${j.n}!`); fecharModal(); 
}

window.onload = () => { carregar(); update(); if(p.idade === 0) addLog("Você nasceu!"); };
