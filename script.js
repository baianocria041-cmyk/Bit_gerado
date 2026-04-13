// --- ESTADO INICIAL ---
let p = {
    nome: "Valentina", sobrenome: "Pereira", idade: 0, grana: 0,
    stats: { fel: 80, sau: 100, int: 50, apa: 50, notas: 50 },
    job: null, faltas: 0, colegas: [], formacao: []
};

// --- BANCO DE DADOS (40 EMPREGOS) ---
const jobs = [
    { n: "Gari", s: 1500, e: "🧹", rInt: 0 }, { n: "Caixa", s: 1800, e: "🛒", rInt: 10 },
    { n: "Motoboy", s: 2500, e: "🏍️", rInt: 15 }, { n: "Vendedor", s: 2200, e: "👕", rInt: 20 },
    { n: "YouTuber", s: 2000, e: "🎥", rInt: 30 }, { n: "Modelo", s: 7000, e: "📸", rApa: 80 },
    { n: "Médico", s: 15000, e: "🏥", rInt: 80, rFac: "Medicina" },
    { n: "Juiz", s: 35000, e: "🏛️", rInt: 95, rCon: true, rFac: "Direito" }
    // ... adicione os demais aqui seguindo o padrão
];

// --- FUNÇÃO PARA SALVAR (LOCAL STORAGE) ---
function salvarJogo() {
    localStorage.setItem('bitlife_save', JSON.stringify(p));
    // Também salva o log de eventos
    const logHMTL = document.getElementById('event-log').innerHTML;
    localStorage.setItem('bitlife_log', logHMTL);
}

// --- FUNÇÃO PARA CARREGAR ---
function carregarJogo() {
    const salvo = localStorage.getItem('bitlife_save');
    const logSalvo = localStorage.getItem('bitlife_log');
    
    if (salvo) {
        p = JSON.parse(salvo);
        if (logSalvo) document.getElementById('event-log').innerHTML = logSalvo;
        update();
    } else {
        novaVida(); // Se não tem salve, começa do zero
    }
}

// --- RESETAR (SÓ QUANDO VOCÊ QUISER) ---
function novaVida() {
    if (confirm("Deseja realmente abandonar esta vida e começar uma nova?")) {
        p = {
            nome: ["Enzo", "Valentina", "Thiago", "Bia"][Math.floor(Math.random()*4)],
            sobrenome: "Pereira", idade: 0, grana: 0,
            stats: { fel: 80, sau: 100, int: 50, apa: 50, notas: 50 },
            job: null, faltas: 0, colegas: [], formacao: []
        };
        document.getElementById('event-log').innerHTML = "<p>• Você nasceu!</p>";
        salvarJogo();
        update();
        fecharModal();
    }
}

function envelhecer() {
    p.idade++;
    if (p.job) p.grana += p.job.s;
    if (p.idade > 6 && p.idade < 18) p.stats.notas = Math.max(0, p.stats.notas - 5);
    
    addLog(`Fez ${p.idade} anos.`);
    
    // Chance de evento de amizade
    if (p.idade > 4 && p.idade < 18 && Math.random() > 0.7) {
        let nome = ["Caio", "Livia", "Bruno", "Clara"][Math.floor(Math.random()*4)];
        abrirModal("AMIZADE", `<p>${nome} quer ser seu amigo!</p>
        <button class="btn-opt" onclick="aceitarAmigo('${nome}')">Aceitar</button>`);
    }

    update();
    salvarJogo(); // Salva toda vez que envelhece
}

// --- LÓGICA DO CHEFE ---
function faltar() {
    p.faltas++;
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
    
    if (p.faltas >= 3) {
        addLog(`DEMITIDO! O chefe cansou das suas faltas.`, "red");
        p.job = null; p.faltas = 0;
        fecharModal();
    } else {
        alert("😠 CHEFE: NÃO FALTE DE NOVO!");
    }
    salvarJogo();
}

function contratar(nome) {
    const j = jobs.find(x => x.n === nome);
    p.job = j;
    addLog(`Emprego novo: ${j.n}`);
    fecharModal();
    salvarJogo();
}

// --- INTERFACE ---
function update() {
    document.getElementById('v-name').innerText = p.nome + " " + p.sobrenome;
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
    document.getElementById('bar-grades').style.width = p.stats.notas + "%";
}

function abrirSocial() {
    abrirModal("SOCIAL", `
        <button class="btn-opt" onclick="novaVida()">✨ Recomeçar Vida (Reset)</button>
        <button class="btn-opt" onclick="p.stats.fel = Math.min(100, p.stats.fel + 10); fecharModal();">👨‍👩‍👧‍👦 Conversar com Família</button>
    `);
}

function abrirModal(t, c) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = t;
    document.getElementById('m-content').innerHTML = c;
}

function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); }
function addLog(m) { 
    const log = document.getElementById('event-log');
    log.innerHTML = `<p>• ${m}</p>` + log.innerHTML; 
}
function aceitarAmigo(n) { p.colegas.push(n); addLog(`Amigo novo: ${n}`); fecharModal(); salvarJogo(); }

// CARREGA ASSIM QUE ABRIR O SITE
window.onload = carregarJogo;
