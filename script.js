const DB_JOBS = [
    { n: "Gari", s: 1500, e: "🧹", rInt: 0 }, { n: "Caixa", s: 1900, e: "🛒", rInt: 10 },
    { n: "Vendedor", s: 2200, e: "👕", rInt: 15 }, { n: "YouTuber", s: 3000, e: "🎥", rInt: 30 },
    { n: "Modelo", s: 8000, e: "📸", rApa: 80 }, { n: "Médico", s: 25000, e: "🏥", rInt: 85, rFac: "Medicina" },
    { n: "Advogado", s: 12000, e: "⚖️", rInt: 75, rFac: "Direito" }, { n: "Juiz", s: 45000, e: "🏛️", rInt: 95, rCon: true, rFac: "Direito" },
    { n: "TI Senior", s: 15000, e: "💻", rInt: 80, rFac: "Sistemas" }, { n: "Piloto", s: 28000, e: "✈️", rInt: 90, rFac: "Aviação" },
    { n: "Policial", s: 7000, e: "👮", rCon: true }, { n: "Astronauta", s: 80000, e: "🚀", rInt: 99, rFac: "Física" },
    { n: "Chef", s: 6500, e: "👨‍🍳", rInt: 50 }, { n: "Barbeiro", s: 3200, e: "💈", rInt: 20 },
    { n: "Jogador de Futebol", s: 60000, e: "⚽", rApa: 50, rInt: 20 }, { n: "Dentista", s: 11000, e: "🦷", rFac: "Odonto" }
    // Adicione mais até completar 40 se desejar!
];

let p = {
    nome: "Valentina", sobrenome: "Pereira", idade: 0, grana: 0,
    stats: { fel: 80, sau: 100, int: 50, apa: 50, notas: 50 },
    job: null, faltas: 0, faculdade: [], redes: { ig: 0, tt: 0 }
};

// --- MODAL SYSTEM ---
function abrirModal(titulo, conteudo, mostrarVoltar = false) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = titulo;
    let body = document.getElementById('m-body');
    
    let btnVoltar = mostrarVoltar ? `<button class="back-btn" onclick="voltarFluxo('${titulo}')">⬅ Voltar</button>` : "";
    body.innerHTML = btnVoltar + conteudo;
    body.scrollTop = 0; 
}

function fecharModal() { document.getElementById('modal').style.display = 'none'; update(); salvar(); }

function voltarFluxo(tela) {
    if (tela === "MERCADO") abrirOcupacao();
    else if (tela === "INSTAGRAM" || tela === "TIKTOK") abrirAtividades();
    else fecharModal();
}

// --- LOGICA DO JOGO ---
function envelhecer() {
    p.idade++;
    if (p.job) p.grana += p.job.s;
    if (p.idade > 6 && p.idade < 18) p.stats.notas = Math.max(0, p.stats.notas - 5);
    
    addLog(`Você agora tem ${p.idade} anos.`);
    if (p.idade === 18) addLog("🎓 Você se formou na escola!");
    
    update(); salvar();
}

function abrirOcupacao() {
    if (p.idade < 18) {
        abrirModal("ESCOLA", `<p>Notas: ${p.stats.notas}%</p><button class="btn-choice" onclick="estudar()">📖 Estudar Muito</button>`);
    } else if (p.job) {
        abrirModal("CARREIRA", `<h3>${p.job.e} ${p.job.n}</h3><button class="btn-choice" onclick="trabalharDuro()">🔨 Esforçar-se</button><button class="btn-choice" style="color:red" onclick="faltar()">🚫 Faltar</button>`, false);
    } else {
        let h = "<p>Arraste para ver as vagas 👇</p>";
        DB_JOBS.sort((a,b)=>a.s - b.s).forEach(j => {
            let block = (j.rFac && !p.faculdade.includes(j.rFac)) || p.stats.int < (j.rInt || 0);
            h += `<button class="btn-choice" style="opacity:${block?0.5:1}" onclick="contratar('${j.n}')">
                ${j.e} ${j.n} <span style="float:right; color:#4cd137">R$ ${j.s}</span>
            </button>`;
        });
        abrirModal("MERCADO", h, true);
    }
}

function abrirAtividades() {
    abrirModal("ATIVIDADES", `
        <button class="btn-choice" onclick="abrirRede('ig')">📸 Instagram (${p.redes.ig} seg.)</button>
        <button class="btn-choice" onclick="abrirRede('tt')">📱 TikTok (${p.redes.tt} seg.)</button>
        <button class="btn-choice" onclick="irFaculdade()">🎓 Faculdade</button>
        <button class="btn-choice" style="background:#800" onclick="reset()">✨ Resetar Vida</button>
    `);
}

function abrirRede(r) {
    let nome = r === 'ig' ? "INSTAGRAM" : "TIKTOK";
    abrirModal(nome, `<p>Seguidores: ${p.redes[r]}</p><button class="btn-choice" onclick="postar('${r}')">📝 Postar</button>`, true);
}

// --- ACOES ---
function contratar(n) {
    let j = DB_JOBS.find(x=>x.n === n);
    if (j.rFac && !p.faculdade.includes(j.rFac)) return alert("Requer faculdade de " + j.rFac);
    p.job = j; addLog("Você começou como " + j.n); fecharModal();
}

function postar(r) {
    let ganho = Math.floor(Math.random() * 50) + (p.stats.apa / 2);
    p.redes[r] += Math.floor(ganho);
    addLog(`Viralizou no ${r}! +${Math.floor(ganho)} seguidores.`);
    fecharModal();
}

function estudar() { p.stats.notas = Math.min(100, p.stats.notas + 15); fecharModal(); }
function trabalharDuro() { p.grana += (p.job.s * 0.1); addLog("Você trabalhou extra e ganhou bônus!"); fecharModal(); }
function faltar() { 
    p.faltas++; document.getElementById('game-container').classList.add('shake-anim');
    setTimeout(()=>document.getElementById('game-container').classList.remove('shake-anim'), 400);
    if(p.faltas >= 3) { p.job = null; p.faltas = 0; alert("DEMITIDO!"); }
    fecharModal();
}

function irFaculdade() {
    let cursos = ["Medicina", "Direito", "Sistemas", "Odonto", "Física"];
    let h = "";
    cursos.forEach(c => h += `<button class="btn-choice" onclick="p.faculdade.push('${c}'); fecharModal(); addLog('Se formou em ${c}')">${c}</button>`);
    abrirModal("FACULDADE", h, true);
}

// --- SISTEMA ---
function update() {
    document.getElementById('v-name').innerText = p.nome + " " + p.sobrenome;
    document.getElementById('v-money').innerText = "R$ " + p.grana.toLocaleString();
    document.getElementById('v-age').innerText = p.age = p.idade + " anos";
    document.getElementById('v-job-title').innerText = p.job ? p.job.n : "Desempregado";
    document.getElementById('bar-happy').style.width = p.stats.fel + "%";
    document.getElementById('bar-health').style.width = p.stats.sau + "%";
    document.getElementById('bar-smart').style.width = p.stats.int + "%";
    document.getElementById('bar-looks').style.width = p.stats.apa + "%";
    document.getElementById('bar-grades').style.width = p.stats.notas + "%";
}

function addLog(m) { const l = document.getElementById('event-log'); l.innerHTML = `<p>• ${m}</p>` + l.innerHTML; }
function salvar() { localStorage.setItem('bit_save_p', JSON.stringify(p)); localStorage.setItem('bit_save_l', document.getElementById('event-log').innerHTML); }
function carregar() { 
    let s = localStorage.getItem('bit_save_p'); 
    if(s) { p = JSON.parse(s); document.getElementById('event-log').innerHTML = localStorage.getItem('bit_save_l'); }
}
function reset() { if(confirm("Apagar tudo?")) { localStorage.clear(); location.reload(); } }

window.onload = () => { carregar(); update(); };
