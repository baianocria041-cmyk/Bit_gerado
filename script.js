// --- CONFIGURAÇÃO INICIAL ---
let player = {
    nome: "Carlos",
    sobrenome: "Silva",
    idade: 0,
    meses: 0,
    dinheiro: 0,
    stats: { happy: 50, health: 80, smart: 60, looks: 50 },
    vivo: true,
    emprego: null,
    log: []
};

const NOMES = ["Carlos", "André", "Beatriz", "Julia", "Ricardo", "Fernanda"];
const SOBRENOMES = ["Silva", "Santos", "Oliveira", "Souza", "Pereira"];

// --- INICIAR VIDA ---
function novoPersonagem() {
    player.nome = NOMES[Math.floor(Math.random() * NOMES.length)];
    player.sobrenome = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
    player.stats = {
        happy: rand(50, 100),
        health: rand(70, 100),
        smart: rand(10, 100),
        looks: rand(10, 100)
    };
    addLog(`Eu nasci em São Paulo, Brasil. Sou um menino.`);
    updateUI();
}

// --- MECÂNICA DE ENVELHECER ---
function envelhecer() {
    if (!player.vivo) return;

    player.idade++;
    
    // Evento Aleatório de Idade
    processarEventoAleatorio();
    
    // Salário
    if (player.emprego) player.dinheiro += player.emprego.salario;

    // Decaimento de saúde
    if (player.idade > 70) player.stats.health -= rand(1, 5);
    if (player.stats.health <= 0) morrer("Causas Naturais");

    updateUI();
    salvar();
}

// --- MOTOR DE EVENTOS ---
function processarEventoAleatorio() {
    const eventos = [
        { t: "Sua mãe te deu um brinquedo.", s: { happy: 5 } },
        { t: "Você pegou um resfriado.", s: { health: -10 } },
        { t: "Você leu um livro novo.", s: { smart: 5 } },
        { t: "Você brigou na escola.", s: { happy: -5, looks: -2 } }
    ];

    if (Math.random() > 0.6) {
        let ev = eventos[Math.floor(Math.random() * eventos.length)];
        addLog(ev.t);
        for (let stat in ev.s) {
            player.stats[stat] = Math.min(100, Math.max(0, player.stats[stat] + ev.s[stat]));
        }
    }
}

// --- UTILITÁRIOS ---
function updateUI() {
    document.getElementById('display-name').innerText = `${player.nome} ${player.sobrenome}`;
    document.getElementById('display-age').innerText = `${player.idade} anos`;
    document.getElementById('display-money').innerText = `R$ ${player.dinheiro.toLocaleString()}`;
    
    document.getElementById('bar-happy').style.width = player.stats.happy + "%";
    document.getElementById('bar-health').style.width = player.stats.health + "%";
    document.getElementById('bar-smart').style.width = player.stats.smart + "%";
    document.getElementById('bar-looks').style.width = player.stats.looks + "%";
}

function addLog(txt) {
    const log = document.getElementById('event-log');
    let entry = document.createElement('div');
    entry.className = "log-entry";
    entry.innerHTML = `<small>Ano ${player.idade}</small><p>${txt}</p>`;
    log.prepend(entry);
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

function salvar() { localStorage.setItem("save_bit", JSON.stringify(player)); }

// Iniciar
novoPersonagem();
