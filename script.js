// --- ESTADO DO PERSONAGEM ---
const NOVO_PERSONAGEM = (nome = "Carlos") => ({
    id: Date.now(),
    nome: nome, idade: 18, grana: 2000,
    stats: { fel: 50, int: 60, sau: 80, apa: 50 },
    formacao: [], 
    job: null, faltas: 0,
    redes: { instagram: { ativa: false, seguidores: 0, posts: 0 }, tiktok: { ativa: false, seguidores: 0, posts: 0 } }
});

let p = NOVO_PERSONAGEM();

// --- BANCO DE DADOS ORGANIZADO ---
const jobs_comuns = [
    { n: "Gari", s: 1500, e: "🧹", rInt: 0 }, { n: "Vendedor", s: 2200, e: "👕", rInt: 20 },
    { n: "Caixa", s: 1800, e: "🛒", rInt: 10 }, { n: "Garçom", s: 1600, e: "☕", rInt: 10 },
    { n: "Motoboy", s: 2500, e: "🏍️", rInt: 20 }, { n: "Cozinheiro", s: 3000, e: "👨‍🍳", rInt: 40 }
];

const jobs_publicos = [
    { n: "Policial Militar", s: 5000, e: "👮", rInt: 50, rCon: true },
    { n: "Bombeiro", s: 4800, e: "👨‍🚒", rInt: 45, rCon: true },
    { n: "Juiz de Direito", s: 32000, e: "🏛️", rInt: 90, rCon: true, rFac: "Direito" },
    { n: "Diplomata", s: 19000, e: "🌍", rInt: 85, rCon: true, rFac: "Relações Internacionais" },
    { n: "Auditor Fiscal", s: 22000, e: "📑", rInt: 80, rCon: true, rFac: "Economia" }
];

const cursos_superiores = [
    { n: "Medicina", c: 15000, t: "Saúde", rInt: 70 },
    { n: "Direito", c: 6000, t: "Humanas", rInt: 50 },
    { n: "Engenharia", c: 8000, t: "Exatas", rInt: 65 },
    { n: "Sistemas de Informação", c: 4500, t: "Exatas", rInt: 55 },
    { n: "Economia", c: 5500, t: "Humanas", rInt: 55 }
];

// --- SISTEMA DE EMPREGO (SUBCAMADAS) ---
function abrirJobs() {
    if (p.job) {
        mostrarTrabalhoAtivo();
    } else {
        let h = `<div class="sub-header">💼 Empregos Comuns</div>`;
        jobs_comuns.forEach(j => h += gerarBotaoJob(j));

        h += `<div class="sub-header">🏛️ Concursos Públicos</div>`;
        jobs_publicos.forEach(j => h += gerarBotaoJob(j));

        abrirModal("CARREIRA", h);
    }
}

function gerarBotaoJob(j) {
    let bloqueado = (j.rFac && !p.formacao.includes(j.rFac)) || (p.stats.int < j.rInt);
    let tag = j.rCon ? '<span class="req-tag">CONCURSO</span>' : '';
    let req = j.rFac ? `<br><small>Requer: ${j.rFac}</small>` : '';
    
    return `<button class="btn-opt ${bloqueado ? 'btn-locked' : ''}" onclick="tentarJob('${j.n}', ${j.rCon})">
                ${j.e} ${j.n} - R$ ${j.s} ${tag} ${req}
            </button>`;
}

function tentarJob(nome, isConcurso) {
    const lista = [...jobs_comuns, ...jobs_publicos];
    const j = lista.find(x => x.n === nome);

    if (j.rFac && !p.formacao.includes(j.rFac)) return alert("Você não tem o diploma necessário!");
    if (p.stats.int < j.rInt) return alert("Sua inteligência é insuficiente para este cargo.");

    if (isConcurso) {
        if (confirm(`Deseja prestar o concurso para ${nome}?`)) {
            let sorte = (p.stats.int + Math.random() * 100) / 2;
            if (sorte > 75) {
                p.job = j;
                addLog(`🎯 APROVADO! Você agora é ${nome}.`, "gold");
                fecharModal();
            } else {
                addLog(`❌ Reprovado no concurso de ${nome}. Estude mais!`, "red");
                fecharModal();
            }
        }
    } else {
        p.job = j;
        addLog(`💼 Iniciou como ${nome}.`);
        fecharModal();
    }
}

// --- SISTEMA DE EDUCAÇÃO (SUBCAMADAS) ---
function abrirEducacao() {
    let categorias = ["Saúde", "Exatas", "Humanas"];
    let h = "";

    categorias.forEach(cat => {
        h += `<div class="sub-header">🎓 Área: ${cat}</div>`;
        cursos_superiores.filter(c => c.t === cat).forEach(curso => {
            let jaFormado = p.formacao.includes(curso.n);
            h += `<button class="btn-opt ${jaFormado ? 'btn-locked' : ''}" onclick="fazerFaculdade('${curso.n}', ${curso.c})">
                    ${jaFormado ? '✅' : '🎓'} ${curso.n} (R$ ${curso.c.toLocaleString()})
                  </button>`;
        });
    });

    abrirModal("UNIVERSIDADE", h);
}

function fazerFaculdade(nome, custo) {
    if (p.formacao.includes(nome)) return alert("Você já é formado nisso!");
    if (p.grana < custo) return alert("Dinheiro insuficiente!");
    
    p.grana -= custo;
    p.formacao.push(nome);
    p.stats.int += 25;
    addLog(`🎓 Parabéns! Você concluiu o curso de ${nome}!`, "#3498db");
    fecharModal();
}

// --- CONSEQUÊNCIAS DE FALTAR (ANIMAÇÃO) ---
function faltar() {
    p.faltas++;
    document.getElementById('game-container').classList.add('shake');
    setTimeout(() => document.getElementById('game-container').classList.remove('shake'), 400);

    let desconto = Math.floor(p.job.s * 0.2);
    p.grana -= desconto;
    
    let chefeMsg = "";
    let face = "😠";

    if (p.faltas === 1) chefeMsg = "O chefe te deu um esporro! 'Último aviso!'";
    else if (p.faltas === 2) { face = "😡"; chefeMsg = `SUSPENSÃO! Você perdeu R$ ${desconto} do salário.`; }
    else { face = "🤬"; chefeMsg = "JUSTA CAUSA! Você foi demitido."; p.job = null; }

    abrirModal("RECLAMAÇÃO DO CHEFE", `<div class="work-anim" style="animation:none">${face}</div><p>${chefeMsg}</p>`);
    addLog(`🚫 Falta: ${chefeMsg}`, "red");
}

// --- FUNÇÕES DE INTERFACE ---
function mostrarTrabalhoAtivo() {
    abrirModal("TRABALHO ATUAL", `
        <div class="work-anim">${p.job.e}</div>
        <h3>${p.job.n}</h3>
        <p>Salário: R$ ${p.job.s.toLocaleString()}</p>
        <hr style="opacity:0.1; margin:15px">
        <button class="btn-opt" style="background:#e67e22" onclick="faltar()">🚪 Faltar ao Serviço</button>
        <button class="btn-opt" style="background:#c0392b" onclick="p.job=null; fecharModal(); addLog('Pediu demissão.')">🚶 Pedir Demissão</button>
    `);
}

function abrirAtividades() {
    let h = `
        <button class="btn-opt" onclick="abrirEducacao()">🎓 Faculdade / Cursos</button>
        <button class="btn-opt" onclick="p.stats.int+=10; fecharModal(); addLog('Estudou na biblioteca.')">📖 Biblioteca (Grátis)</button>
        <button class="btn-opt" onclick="p.stats.sau+=10; p.grana-=50; fecharModal(); addLog('Fez academia.')">🏋️ Academia (R$ 50)</button>
    `;
    abrirModal("ATIVIDADES", h);
}

// --- SISTEMA CORE ---
function envelhecer() {
    p.idade++;
    if (p.job) p.grana += p.job.s;
    p.redes.instagram.posts = 0;
    p.redes.tiktok.posts = 0;
    addLog("Mais um ano passou.");
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

function abrirModal(t, h) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = t;
    document.getElementById('m-content').innerHTML = h;
}

function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }

function addLog(m, c = "#fff") {
    const log = document.getElementById('event-log');
    log.insertAdjacentHTML('afterbegin', `<div class="log-item" style="border-left:4px solid ${c}"><b>Ano ${p.idade}</b>: ${m}</div>`);
}

window.onload = update;
