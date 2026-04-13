// --- ESTADO DO PERSONAGEM ---
const NOVO_PERSONAGEM = () => {
    const nomes = ["Enzo", "Valentina", "Thiago", "Bia", "Caio", "Livia", "Davi", "Manu"];
    const sobrenomes = ["Silva", "Santos", "Oliveira", "Costa", "Pereira"];
    return {
        nome: nomes[Math.floor(Math.random() * nomes.length)],
        sobrenome: sobrenomes[Math.floor(Math.random() * sobrenomes.length)],
        idade: 0, grana: 0, vivo: true,
        stats: { fel: 80, int: 50, sau: 100, apa: 50, notas: 50 },
        formacao: [], job: null, faltas: 0,
        cursoAtivo: null, escola: "Nenhuma", colegas: []
    };
};

let p = NOVO_PERSONAGEM();

// --- BANCO DE 40 EMPREGOS ---
const jobs_database = [
    // COMUNS
    { n: "Gari", s: 1500, e: "🧹", rInt: 0, cat: "comum" },
    { n: "Vendedor", s: 2200, e: "👕", rInt: 20, cat: "comum" },
    { n: "Caixa", s: 1800, e: "🛒", rInt: 10, cat: "comum" },
    { n: "Motoboy", s: 2500, e: "🏍️", rInt: 15, cat: "comum" },
    { n: "Garçom", s: 1600, e: "☕", rInt: 10, cat: "comum" },
    { n: "Cozinheiro", s: 3000, e: "👨‍🍳", rInt: 30, cat: "comum" },
    { n: "Pedreiro", s: 3200, e: "🧱", rInt: 10, cat: "comum" },
    { n: "Segurança", s: 2800, e: "🛡️", rInt: 20, cat: "comum" },
    { n: "Motorista", s: 2400, e: "🚗", rInt: 20, cat: "comum" },
    { n: "Padeiro", s: 2100, e: "🥖", rInt: 20, cat: "comum" },
    { n: "Barbeiro", s: 2800, e: "💈", rInt: 25, cat: "comum" },
    { n: "Fazendeiro", s: 2200, e: "🚜", rInt: 15, cat: "comum" },
    { n: "YouTuber", s: 2000, e: "🎥", rInt: 30, cat: "comum" },
    { n: "Modelo", s: 7000, e: "📸", rInt: 20, rApa: 80, cat: "comum" },
    { n: "Ator", s: 8000, e: "🎭", rInt: 40, rApa: 70, cat: "comum" },
    { n: "Jogador de Futebol", s: 25000, e: "⚽", rInt: 20, cat: "comum" },
    { n: "Cantor", s: 12000, e: "🎤", rInt: 30, cat: "comum" },
    { n: "Pescador", s: 1800, e: "🎣", rInt: 10, cat: "comum" },
    { n: "Eletricista", s: 3500, e: "⚡", rInt: 40, cat: "comum" },
    { n: "Encanador", s: 3300, e: "🔧", rInt: 35, cat: "comum" },

    // SUPERIOR
    { n: "Médico", s: 15000, e: "🏥", rInt: 80, rFac: "Medicina", cat: "superior" },
    { n: "Advogado", s: 8500, e: "⚖️", rInt: 60, rFac: "Direito", cat: "superior" },
    { n: "Engenheiro", s: 9000, e: "🏗️", rInt: 70, rFac: "Engenharia", cat: "superior" },
    { n: "TI Senior", s: 12000, e: "💻", rInt: 75, rFac: "Sistemas", cat: "superior" },
    { n: "Arquiteto", s: 7500, e: "📐", rInt: 65, rFac: "Arquitetura", cat: "superior" },
    { n: "Dentista", s: 9500, e: "🦷", rInt: 70, rFac: "Odontologia", cat: "superior" },
    { n: "Piloto", s: 18000, e: "✈️", rInt: 80, rFac: "Aviação", cat: "superior" },
    { n: "Cientista", s: 11000, e: "🧪", rInt: 90, rFac: "Física", cat: "superior" },
    { n: "Psicólogo", s: 5500, e: "🧠", rInt: 65, rFac: "Psicologia", cat: "superior" },
    { n: "Astronauta", s: 45000, e: "🚀", rInt: 98, rFac: "Física", cat: "superior" },

    // CONCURSOS
    { n: "Policial", s: 6000, e: "👮", rInt: 50, rCon: true, cat: "publico" },
    { n: "Juiz", s: 35000, e: "🏛️", rInt: 95, rCon: true, rFac: "Direito", cat: "publico" },
    { n: "Delegado", s: 18000, e: "🚔", rInt: 80, rCon: true, rFac: "Direito", cat: "publico" },
    { n: "Diplomata", s: 22000, e: "🌍", rInt: 90, rCon: true, rFac: "Direito", cat: "publico" },
    { n: "Auditor Fiscal", s: 20000, e: "📑", rInt: 85, rCon: true, rFac: "Economia", cat: "publico" },
    { n: "Bombeiro", s: 5500, e: "👨‍🚒", rInt: 45, rCon: true, cat: "publico" },
    { n: "Agente Federal", s: 13000, e: "🕶️", rInt: 75, rCon: true, cat: "publico" },
    { n: "Professor Est.", s: 4500, e: "📚", rInt: 50, rCon: true, rFac: "Letras", cat: "publico" },
    { n: "Analista Jud.", s: 10000, e: "📖", rInt: 70, rCon: true, cat: "publico" },
    { n: "Fiscal", s: 8000, e: "🔍", rInt: 60, rCon: true, cat: "publico" }
];

// --- MECÂNICA DO CHEFE ---
function faltarAoTrabalho() {
    if (!p.job) return;
    p.faltas++;
    
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);

    let msg, face = "😠";
    if (p.faltas === 1) {
        msg = "O chefe te deu uma bronca terrível!";
    } else if (p.faltas === 2) {
        face = "😡";
        let multa = Math.floor(p.job.s * 0.4);
        p.grana -= multa;
        msg = `MULTADO! O chefe descontou R$ ${multa} do seu saldo.`;
    } else {
        face = "🤬";
        msg = "JUSTA CAUSA! Você foi demitido.";
        p.job = null; p.faltas = 0;
    }
    abrirModal("CHEFE BRAVO", `<div class="work-anim">${face}</div><p>${msg}</p>`);
    addLog(`Falta: ${msg}`, "red");
}

// --- ENGINE DE ENVELHECIMENTO ---
function envelhecer() {
    p.idade++;
    
    if (p.idade === 4) { p.escola = "Jardim de Infância"; addLog("Você começou a escola!"); }
    if (p.idade === 18) { p.escola = "Formado"; addLog("🎓 Formado na escola!"); }

    if (p.job) p.grana += p.job.s;

    if (p.idade > 6 && p.idade < 18) {
        if (p.stats.notas > 80) p.grana += 50;
        p.stats.notas = Math.max(0, p.stats.notas - 8);
    }

    // Evento de Amizade
    if (p.idade >= 4 && p.idade < 18 && Math.random() > 0.7) {
        const nomeAmigo = ["Caio", "Livia", "Bruno", "Clara"][Math.floor(Math.random()*4)];
        abrirModal("AMIGO", `<p>${nomeAmigo} quer ser seu amigo!</p>
        <button class="btn-opt" onclick="p.colegas.push({nome:'${nomeAmigo}', amizade:50}); fecharModal(); addLog('Novo amigo: ${nomeAmigo}')">Aceitar</button>`);
    }

    update();
    salvar();
}

// --- MENUS DE TRABALHO ---
function abrirJobs() {
    if (p.idade < 18) return abrirModal("AVISO", "Você precisa de 18 anos.");
    
    if (p.job) {
        abrirModal("SEU TRABALHO", `
            <div class="work-anim">${p.job.e}</div>
            <p><b>${p.job.n}</b></p>
            <button class="btn-opt" style="background:#f39c12" onclick="faltarAoTrabalho()">🚪 Faltar ao Trabalho</button>
            <button class="btn-opt" style="background:#c0392b" onclick="p.job=null; fecharModal(); addLog('Pediu demissão.')">Pedir Demissão</button>
        `);
    } else {
        let h = `<div class="sub-header">Vagas de Emprego</div>`;
        jobs_database.forEach(j => {
            let ok = (j.rFac ? p.formacao.includes(j.rFac) : true) && (p.stats.int >= j.rInt);
            h += `<button class="btn-opt ${!ok?'btn-locked':''}" onclick="tentarContratar('${j.n}')">
                ${j.e} ${j.n} (R$ ${j.s}) ${j.rCon ? '<span class="req-tag">CONCURSO</span>' : ''}
            </button>`;
        });
        abrirModal("MERCADO", h);
    }
}

function tentarContratar(nome) {
    const j = jobs_database.find(x => x.n === nome);
    if (j.rCon) {
        if (Math.random()*100 < p.stats.int) { 
            p.job = j; addLog("APROVADO no concurso: " + j.n, "gold"); 
        } else { addLog("Reprovado no concurso.", "red"); }
    } else { p.job = j; addLog("Contratado: " + j.n); }
    fecharModal();
}

// --- FUNÇÕES DE INTERFACE ---
function abrirModal(t, h) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = t;
    document.getElementById('m-content').innerHTML = h;
}

function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }

function update() {
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('v-name').innerText = p.nome + " " + p.sobrenome;
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
    if(document.getElementById('bar-grades')) document.getElementById('bar-grades').style.width = p.stats.notas + "%";
}

function addLog(m, c="#fff") {
    document.getElementById('event-log').insertAdjacentHTML('afterbegin', `<div style="color:${c}; border-left: 3px solid ${c}; padding-left: 5px; margin: 5px 0;"><b>Ano ${p.idade}</b>: ${m}</div>`);
}

function salvar() { localStorage.setItem('bit_save', JSON.stringify(p)); }

function novaVida() {
    p = NOVO_PERSONAGEM();
    document.getElementById('event-log').innerHTML = "";
    update();
    abrirModal("NASCIMENTO", "👶 Você nasceu! Cresça e conquiste o mundo.");
}

window.onload = () => {
    const s = localStorage.getItem('bit_save');
    if (s) p = JSON.parse(s); else novaVida();
    update();
};
