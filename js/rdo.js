// ======================================
// SAUDAÇÃO
// ======================================
const horaAtual = new Date().getHours();

let saudacao = '';
let mensagem = '';

if (horaAtual >= 6 && horaAtual < 12) {
    saudacao = 'Bom dia!';
    mensagem = 'Sejam bem-vindos ao nosso Alinhamento Diário. Que tenhamos uma jornada produtiva e focada na excelência.';
} else if (horaAtual >= 12 && horaAtual < 18) {
    saudacao = 'Boa tarde!';
    mensagem = 'Sejam bem-vindos ao nosso Alinhamento Diário. Que tenhamos uma jornada produtiva e focada na excelência.';
} else {
    saudacao = 'Boa noite!';
    mensagem = 'Obrigado pelo empenho de hoje. Que possamos encerrar mais um dia com segurança e excelência.';
}

document.getElementById("saudacao").textContent = saudacao;
document.getElementById("mensagemBoasVindas").textContent = mensagem;

// ======================================
// DATA ATUAL
// ======================================

const currentDate = document.getElementById("currentDate");

if (currentDate) {

    const dias = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
    ];

    const meses = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"
    ];

    const agora = new Date();

    currentDate.textContent =
        `${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} de ${agora.getFullYear()}`;
}


// ======================================
// STATUS ONLINE / OFFLINE
// ======================================

function atualizarStatus() {

    const pill = document.getElementById("statusPill");
    const texto = document.getElementById("statusText");

    if (!pill || !texto) return;

    const dot = pill.querySelector(".status-dot");

    if (navigator.onLine) {

        texto.textContent = "Online";

        if (dot) {
            dot.style.background = "#22C55E";
        }

        pill.style.background = "#EDFAF2";
        pill.style.borderColor = "#C3E6D0";
        pill.style.color = "#064E3B";

    } else {

        texto.textContent = "Offline";

        if (dot) {
            dot.style.background = "#F59E0B";
        }

        pill.style.background = "#FFFBEB";
        pill.style.borderColor = "#FDE68A";
        pill.style.color = "#92400E";
    }
}

window.addEventListener("online", atualizarStatus);
window.addEventListener("offline", atualizarStatus);

atualizarStatus();

// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    carregarDashboard
);