// --- 1. ESTADO GLOBAL DO JOGADOR ---
let p = {
    nome: "", sobrenome: "", idade: 0, grana: 50,
    stats: { fel: 50, sau: 80, int: 60, apa: 50 },
    familia: [], imoveis: [], veiculos: [],
    formacao: null, emprego: null, vivo: true, preso: false,
    historico: []
};
let p = {
    nome: "Carlos Silva", idade: 21, grana: 1250,
    stats: { fel: 50, sau: 80, int: 60, apa: 50 }
};

function envelhecer() {
    p.idade++;
    // Chance de aparecer Tinder
    if(p.idade > 18 && Math.random() > 0.5) {
        spawnTinder();
    } else {
        addLog(`Fui ao médico e descobri que estou com uma gripe forte. 🤒`);
        p.stats.sau -= 10;
    }
    update();
}

function spawnTinder() {
    const nomes = ["Marina", "Julia", "Fernanda", "Sophia"];
    const nome = nomes[Math.floor(Math.random()*nomes.length)];
    const idade = p.idade + Math.floor(Math.random()*3);
    
    const html = `
        <div class="log-item tinder-card">
            <b>🔥 TINDER 🧡</b><br>
            <small>Combinei com ${nome}, ${idade}.<br>Dar um like?</small>
            <div class="tinder-btns">
                <button class="btn-like" onclick="responderTinder(true, '${nome}')">Like</button>
                <button class="btn-dislike" onclick="responderTinder(false)">Dislike</button>
            </div>
        </div>
    `;
    const log = document.getElementById('event-log');
    log.insertAdjacentHTML('afterbegin', html);
}

function responderTinder(aceitou, nome) {
    if(aceitou) {
        addLog(`💕 Comecei a namorar ${nome}!`);
        p.stats.fel += 20;
    } else {
        addLog(`Passei o perfil no Tinder.`);
    }
    update();
}

function update() {
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " anos";
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
}

function addLog(msg) {
    const log = document.getElementById('event-log');
    log.innerHTML = `<div class="log-item"><b>Ano ${p.idade}</b> | ${msg}</div>` + log.innerHTML;
}

function abrirModal(t) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = t;
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

update();


// --- 2. BANCOS DE DADOS (CONTEÚDO) ---
const DB = {
    nomes: ["Enzo", "Valentina", "Gabriel", "Sophia", "Thiago", "Isabela"],
    sobrenomes: ["Oliveira", "Santos", "Costa", "Machado", "Almeida"],
    
    cursos: [
        { n: "Direito", anos: 5, intReq: 70 },
        { n: "Medicina", anos: 6, intReq: 85 },
        { n: "Sistemas de Informação", anos: 4, intReq: 60 }
    ],
    
    loja_carros: [
        { n: "Celta Usado", v: 15000, manut: 200 },
        { n: "Civic Novo", v: 120000, manut: 800 },
        { n: "Ferrari", v: 2500000, manut: 5000 }
    ],
    
    crimes: [
        { n: "Pichação", ganho: 0, risco: 20, pena: 0.5 },
        { n: "Roubo de Carro", ganho: 8000, risco: 60, pena: 3 },
        { n: "Assalto a Joalheria", ganho: 50000, risco: 85, pena: 8 }
    ]
};

// --- 3. MOTOR DE NASCIMENTO E FAMÍLIA ---
function iniciarVida() {
    p.nome = DB.nomes[Math.floor(Math.random() * DB.nomes.length)];
    p.sobrenome = DB.sobrenomes[Math.floor(Math.random() * DB.sobrenomes.length)];
    
    // Gerar Pais
    p.familia.push({ tipo: "Pai", nome: `Roberto ${p.sobrenome}`, rel: 80 });
    p.familia.push({ tipo: "Mãe", nome: `Maria ${p.sobrenome}`, rel: 90 });
    
    addLog(`Nasci em uma família de classe média.`, "var(--primary)");
    update();
}

// --- 4. SISTEMA DE ENVELHECIMENTO (O CORAÇÃO) ---
function envelhecer() {
    if (!p.vivo) return;
    p.idade++;

    // Lógica Financeira
    if (p.emprego) p.grana += p.emprego.sal;
    p.veiculos.forEach(v => p.grana -= v.manut);
    
    // Eventos de Saúde
    if (p.idade > 60) p.stats.sau -= Math.floor(Math.random() * 5);
    if (p.stats.sau <= 0) morrer("Causas Naturais");

    // Lógica de Prisão
    if (p.preso) {
        p.stats.fel -= 20;
        addLog("Mais um ano atrás das grades...", "orange");
    }

    processarEventosAleatorios();
    update();
}

// --- 5. MÓDULO DE ATIVIDADES (MODAL) ---
function abrirAtividades() {
    const c = document.getElementById('m-content');
    c.innerHTML = `
        <div class="menu-grid">
            <button onclick="menuCrime()">🎃 Crime</button>
            <button onclick="menuEdu()">🎓 Educação</button>
            <button onclick="menuShopping()">💰 Shopping</button>
            <button onclick="menuSaude()">🏥 Saúde</button>
        </div>
    `;
    abrirModal("Atividades");
}

// --- 6. MÓDULO DE CRIME ---
function menuCrime() {
    let html = "<h3>Escolha um delito:</h3>";
    DB.crimes.forEach(c => {
        html += `<button class="btn-crime" onclick="cometerCrime('${c.n}')">${c.n}</button>`;
    });
    document.getElementById('m-content').innerHTML = html;
}

function cometerCrime(nome) {
    const crime = DB.crimes.find(c => c.n === nome);
    if (Math.random() * 100 < crime.risco) {
        p.preso = true;
        addLog(`🚓 Fui pego cometendo ${crime.n}! Sentença: ${crime.pena} anos.`, "var(--danger)");
    } else {
        p.grana += crime.ganho;
        p.stats.fel += 10;
        addLog(`💰 Sucesso no crime: ${crime.n}! Ganhei R$ ${crime.ganho}.`, "var(--success)");
    }
    fecharModal();
}

// --- 7. MÓDULO DE RELACIONAMENTOS ---
function abrirSocial() {
    const c = document.getElementById('m-content');
    c.innerHTML = "<h3>Família e Amigos</h3>";
    p.familia.forEach((f, index) => {
        c.innerHTML += `
            <div class="card-social">
                <span>${f.tipo}: ${f.nome} (Rel: ${f.rel}%)</span>
                <button onclick="interagir(${index})">Conversar</button>
            </div>
        `;
    });
    abrirModal("Social");
}

function interagir(idx) {
    p.familia[idx].rel = Math.min(100, p.familia[idx].rel + 10);
    p.stats.fel += 5;
    addLog(`Tive uma ótima conversa com meu ${p.familia[idx].tipo}.`);
    fecharModal();
}
function morrer(motivo) {
    p.vivo = false;
    let herdeiro = p.familia.find(f => f.tipo === "Filho" || f.tipo === "Esposa");
    
    if (herdeiro && p.grana > 0) {
        alert(`Você morreu de ${motivo}. Seu herdeiro ${herdeiro.nome} recebeu R$ ${p.grana.toLocaleString()}.`);
        // Aqui você resetaria o 'p' mas manteria a grana para o novo personagem
    }
}
function tirarCarteira() {
    if (p.idade >= 18 && !p.temCarteira) {
        if (Math.random() > 0.3) {
            p.temCarteira = true;
            addLog("🚗 Você passou no teste de direção!", "var(--primary)");
        } else {
            addLog("❌ Você reprovou no teste de direção.", "var(--danger)");
        }
    }
}
function processarEventosAleatorios() {
    let sorte = Math.random() * 100;
    
    if (sorte < 5) { // 5% de chance de doença
        p.stats.sau -= 20;
        addLog("🤒 Você contraiu uma gripe forte. Vá ao médico!", "var(--danger)");
    }
    
    if (sorte > 95 && p.idade > 18) { // 5% de chance de promoção
        if (p.emprego) {
            p.emprego.sal *= 1.2;
            addLog("📈 Você recebeu um aumento por bom desempenho!", "var(--primary)");
        }
    }
}


function comprarCasa(casa) {
    if (p.grana >= casa.preco) {
        p.grana -= casa.preco;
        p.imoveis.push(casa);
        p.stats.fel += 30;
        addLog(`🏠 Você comprou uma ${casa.nome}!`);
    } else {
        flash("Dinheiro insuficiente!");
    }
}


// --- 8. MOTOR DE INTERFACE E LOG ---
function update() {
    // Atualiza barras
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
    
    // Textos
    document.getElementById('v-money').innerText = "R$ " + Math.floor(p.grana).toLocaleString();
    document.getElementById('v-age').innerText = p.idade + " Anos";
    document.getElementById('v-name').innerText = `${p.nome} ${p.sobrenome}`;
}

function addLog(msg, cor = "#fff") {
    const log = document.getElementById('event-log');
    const item = document.createElement('div');
    item.style.borderLeft = `4px solid ${cor}`;
    item.className = "log-item";
    item.innerHTML = `<small>Ano ${p.idade}</small><p>${msg}</p>`;
    log.prepend(item);
}

// --- INICIALIZAÇÃO ---
window.onload = () => {
    iniciarVida();
};

function morrer(motivo) {
    p.vivo = false;
    alert(`MORREU: ${motivo}\nIdade: ${p.idade}\nPatrimônio: R$ ${p.grana}`);
    location.reload();
}
