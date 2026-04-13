// --- ESTADO DO PERSONAGEM ---
const NOVO_PERSONAGEM = (nomePersonalizado = "") => {
    const nomes = ["Enzo", "Valentina", "Thiago", "Bia", "Caio", "Livia", "Davi", "Manu", "Bruno", "Clara"];
    const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Costa", "Pereira", "Alves", "Machado"];
    return {
        id: Date.now(),
        nome: nomePersonalizado || nomes[Math.floor(Math.random() * nomes.length)],
        sobrenome: sobrenomes[Math.floor(Math.random() * sobrenomes.length)],
        idade: 0, grana: 0, vivo: true,
        stats: { fel: 80, int: 50, sau: 100, apa: 50, notas: 50 },
        formacao: [], job: null, faltas: 0,
        cursoAtivo: null, concursoInscrito: null,
        escola: "Nenhuma", colegas: [],
        redes: { 
            instagram: { ativa: false, seguidores: 0, posts: 0 }, 
            tiktok: { ativa: false, seguidores: 0, posts: 0 } 
        }
    };
};

let p = NOVO_PERSONAGEM();

// --- BANCO DE DADOS DE 40 EMPREGOS (CATEGORIZADOS) ---
const jobs_data = [
    // COMUNS (LIVRES)
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
    { n: "Eletricista", s: 3500, e: "⚡", rInt: 40, cat: "comum" },
    { n: "Encanador", s: 3300, e: "🔧", rInt: 35, cat: "comum" },
    { n: "Fazendeiro", s: 2200, e: "🚜", rInt: 15, cat: "comum" },
    
    // NÍVEL SUPERIOR (REQUER FACULDADE)
    { n: "Médico", s: 15000, e: "🏥", rInt: 80, rFac: "Medicina", cat: "superior" },
    { n: "Advogado", s: 8500, e: "⚖️", rInt: 60, rFac: "Direito", cat: "superior" },
    { n: "Engenheiro", s: 9000, e: "🏗️", rInt: 70, rFac: "Engenharia", cat: "superior" },
    { n: "TI Senior", s: 12000, e: "💻", rInt: 75, rFac: "Sistemas de Informação", cat: "superior" },
    { n: "Arquiteto", s: 7500, e: "📐", rInt: 65, rFac: "Arquitetura", cat: "superior" },
    { n: "Dentista", s: 9500, e: "🦷", rInt: 70, rFac: "Odontologia", cat: "superior" },
    { n: "Veterinário", s: 6000, e: "🐾", rInt: 60, rFac: "Veterinária", cat: "superior" },
    { n: "Piloto", s: 18000, e: "✈️", rInt: 80, rFac: "Aviação", cat: "superior" },
    { n: "Cientista", s: 11000, e: "🧪", rInt: 90, rFac: "Física", cat: "superior" },
    { n: "Psicólogo", s: 5500, e: "🧠", rInt: 65, rFac: "Psicologia", cat: "superior" },
    { n: "Jornalista", s: 4500, e: "🎤", rInt: 55, rFac: "Jornalismo", cat: "superior" },
    
    // CONCURSOS (REQUER PROVA)
    { n: "Policial", s: 6000, e: "👮", rInt: 50, rCon: true, cat: "publico" },
    { n: "Juiz", s: 35000, e: "🏛️", rInt: 95, rCon: true, rFac: "Direito", cat: "publico" },
    { n: "Diplomata", s: 22000, e: "🌍", rInt: 90, rCon: true, rFac: "Direito", cat: "publico" },
    { n: "Delegado", s: 18000, e: "🚔", rInt: 80, rCon: true, rFac: "Direito", cat: "publico" },
    { n: "Auditor", s: 20000, e: "📑", rInt: 85, rCon: true, rFac: "Economia", cat: "publico" },
    { n: "Bombeiro", s: 5500, e: "👨‍🚒", rInt: 45, rCon: true, cat: "publico" },
    { n: "Agente Federal", s: 13000, e: "🕶️", rInt: 75, rCon: true, cat: "publico" },
    { n: "Professor Est.", s: 4500, e: "📚", rInt: 50, rCon: true, rFac: "Letras", cat: "publico" },
    
    // ENTRETENIMENTO (DIFICULDADE POR APARÊNCIA/SORTE)
    { n: "YouTuber", s: 2000, e: "🎥", rInt: 30, cat: "comum" },
    { n: "Modelo", s: 7000, e: "📸", rInt: 20, rApa: 80, cat: "comum" },
    { n: "Ator", s: 8000, e: "🎭", rInt: 40, rApa: 70, cat: "comum" },
    { n: "Jogador de Futebol", s: 25000, e: "⚽", rInt: 20, cat: "comum" },
    { n: "Cantor", s: 12000, e: "🎤", rInt: 30, cat: "comum" },
    { n: "Astronauta", s: 40000, e: "🚀", rInt: 98, rFac: "Física", cat: "superior" }
];

// --- SISTEMA DE EVENTOS ALEATÓRIOS ---
function processarEventos() {
    if (Math.random() > 0.6) {
        if (p.idade >= 4 && p.idade < 18) {
            const colega = ["Davi", "Lucas", "Enzo", "Julia", "Bia"][Math.floor(Math.random()*5)];
            abrirModal("AMIZADE", `<span class="event-emoji">🙋‍♀️</span><p><b>${colega}</b> quer ser seu amigo!</p>
            <button class="btn-opt" onclick="p.colegas.push({nome:'${colega}', amizade:50}); addLog('Nova amizade: ${colega}'); fecharModal()">Aceitar</button>
            <button class="btn-opt" onclick="fecharModal()">Recusar</button>`);
        } else {
            // Evento adulto (ex: achou dinheiro)
            if(Math.random() > 0.5) {
                abrirModal("SORTE", `<span class="event-emoji">💵</span><p>Você achou R$ 100 no chão!</p>
                <button class="btn-opt" onclick="p.grana+=100; addLog('Achou R$ 100'); fecharModal()">Pegar</button>`);
            }
        }
    }
}

// --- ENGINE DE ENVELHECIMENTO ---
function envelhecer() {
    p.idade++;
    
    // Ciclo Escolar
    if (p.idade === 4) { p.escola = "Jardim de Infância"; addLog("Você começou a escola!"); }
    if (p.idade === 18) { p.escola = "Formado"; addLog("🎓 Formado na escola!"); }

    // Trabalho e Salário
    if (p.job) p.grana += p.job.s;

    // Faculdade Ativa
    if (p.cursoAtivo) {
        p.cursoAtivo.tempo--;
        if (p.cursoAtivo.tempo <= 0) {
            p.formacao.push(p.cursoAtivo.n);
            addLog(`🎓 Formado em ${p.cursoAtivo.n}!`, "cyan");
            p.cursoAtivo = null;
        }
    }

    // Mesada e Notas
    if (p.idade > 6 && p.idade < 18) {
        if (p.stats.notas > 80) { p.grana += 50; addLog("Ganhou mesada por boas notas!"); }
        p.stats.notas = Math.max(0, p.stats.notas - 10);
    }

    p.redes.instagram.posts = 0; p.redes.tiktok.posts = 0;
    update();
    salvar();
    setTimeout(processarEventos, 500);
}

// --- INTERFACE DE EMPREGOS (CATEGORIAS) ---
function abrirJobs() {
    if (p.idade < 18) return abrirModal("BLOQUEADO", "Você precisa de 18 anos.");
    
    if (p.job) {
        abrirModal("EMPREGO", `<p>${p.job.e} ${p.job.n}</p><button class="btn-opt" onclick="p.job=null; fecharModal()">Pedir Demissão</button>`);
    } else {
        let h = `<div class="sub-header">💼 Comuns</div>`;
        jobs_data.filter(j => j.cat === "comum").forEach(j => h += gerarBotaoJob(j));
        
        h += `<div class="sub-header">🎓 Nível Superior</div>`;
        jobs_data.filter(j => j.cat === "superior").forEach(j => h += gerarBotaoJob(j));

        h += `<div class="sub-header">🏛️ Concursos Públicos</div>`;
        jobs_data.filter(j => j.cat === "publico").forEach(j => h += gerarBotaoJob(j));

        abrirModal("VAGAS", h);
    }
}

function gerarBotaoJob(j) {
    let bloqueado = (j.rFac && !p.formacao.includes(j.rFac)) || (p.stats.int < j.rInt);
    let tag = j.rCon ? '<span class="req-tag">CONCURSO</span>' : '';
    return `<button class="btn-opt ${bloqueado ? 'btn-locked' : ''}" onclick="tentarEmprego('${j.n}')">
        ${j.e} ${j.n} (R$ ${j.s}) ${tag}
    </button>`;
}

function tentarEmprego(nome) {
    const j = jobs_data.find(x => x.n === nome);
    if (j.rFac && !p.formacao.includes(j.rFac)) return alert("Requer diploma de " + j.rFac);
    if (p.stats.int < j.rInt) return alert("Inteligência insuficiente!");
    
    if (j.rCon) {
        abrirModal("CONCURSO", `<p>Deseja prestar concurso para ${j.n}?</p>
        <button class="btn-opt" onclick="fazerProva('${j.n}')">Fazer Prova</button>`);
    } else {
        p.job = j; addLog("Começou como " + j.n); fecharModal();
    }
}

function fazerProva(nome) {
    const j = jobs_data.find(x => x.n === nome);
    if (Math.random() * 100 < (p.stats.int - 20)) {
        p.job = j; addLog("🎯 Passou no concurso: " + j.n, "gold");
    } else {
        addLog("❌ Reprovado no concurso.", "red");
    }
    fecharModal();
}

// --- INTERFACE SOCIAL E ESCOLA ---
function abrirSocial() {
    let h = "";
    if (p.idade >= 4 && p.idade < 18) h += `<button class="btn-opt" onclick="abrirEscola()">🏫 Escola</button>`;
    if (p.idade >= 13) {
        h += `<button class="btn-opt btn-insta" onclick="menuRede('instagram')">📸 Instagram</button>`;
        h += `<button class="btn-opt btn-tiktok" onclick="menuRede('tiktok')">📱 TikTok</button>`;
    }
    h += `<button class="btn-opt" onclick="p.stats.fel+=10; addLog('Tempo com a família'); fecharModal()">👨‍👩‍👧 Família</button>`;
    abrirModal("SOCIAL", h);
}

function abrirEscola() {
    let h = `<h3>Notas: ${p.stats.notas}%</h3>
    <div class="bar" style="height:15px"><div id="bar-grades" style="width:${p.stats.notas}%"></div></div>
    <button class="btn-opt" onclick="p.stats.notas=Math.min(100, p.stats.notas+15); fecharModal(); addLog('Estudou para a escola')">📖 Estudar Muito</button>
    <div class="sub-header">Colegas</div>`;
    p.colegas.forEach(c => h += `<p>👦 ${c.nome} (Amizade: ${c.amizade}%)</p>`);
    abrirModal("ESCOLA", h);
}

// --- ENGINE BASE ---
function update() {
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('v-name').innerText = p.nome + " " + p.sobrenome;
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
function salvar() { localStorage.setItem('bit_curr', JSON.stringify(p)); }

function novaVida() {
    p = NOVO_PERSONAGEM();
    document.getElementById('event-log').innerHTML = "";
    update();
    abrirModal("NASCIMENTO", `<span class="event-emoji">👶</span><p>Você nasceu! Nome: ${p.nome}</p><button class="btn-opt" onclick="fecharModal()">Começar Vida</button>`);
}

window.onload = () => {
    const curr = localStorage.getItem('bit_curr');
    if (curr) p = JSON.parse(curr); else novaVida();
    update();
};
