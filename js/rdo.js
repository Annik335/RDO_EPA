

// ==================================================
// CONFIGURAÇÃO EMAILJS
// ==================================================

const EMAILJS_PUBLIC_KEY  = 'mx9ZnGVthf9fC5C_y';
const EMAILJS_SERVICE_ID  = 'service_as8fn6f';
const EMAILJS_TEMPLATE_ID = 'template_nl4v72u';
const EMAIL_DESTINO       = 'annik_almeida@grupoepa.com.br';

// Inicializa o SDK assim que o script carrega
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
} else {
    console.error('EmailJS SDK não encontrado. Verifique se o script CDN está antes do rdo.js no HTML.');
}

//=================== SAUDAÇÃO=========================

(function inicializarHeader() {
    const horaAtual = new Date().getHours();
 
    let saudacao = '';
    if (horaAtual >= 6 && horaAtual < 12)       saudacao = 'Bom dia!';
    else if (horaAtual >= 12 && horaAtual < 18)  saudacao = 'Boa tarde!';
    else                                          saudacao = 'Boa noite!';
 
    const elSaudacao = document.getElementById('saudacao');
    if (elSaudacao) elSaudacao.textContent = saudacao;
 
    const dias  = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const agora = new Date();
 
    const elData = document.getElementById('currentDate');
    if (elData) {
        elData.textContent = `${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} de ${agora.getFullYear()}`;
    }
 
    const inputData = document.getElementById('data');
    if (inputData && !inputData.value) {
        inputData.value = agora.toISOString().slice(0, 10);
    }
})();

//==================== OFFILINE================================

 function atualizarStatus() {
    const pill  = document.getElementById('statusPill');
    const texto = document.getElementById('statusText');
    if (!pill || !texto) return;
 
    const dot = pill.querySelector('.status-dot');
 
    if (navigator.onLine) {
        texto.textContent           = 'Online';
        if (dot) dot.style.background = '#22C55E';
        pill.style.background       = '#EDFAF2';
        pill.style.borderColor      = '#C3E6D0';
        pill.style.color            = '#064E3B';
    } else {
        texto.textContent           = 'Offline';
        if (dot) dot.style.background = '#F59E0B';
        pill.style.background       = '#FFFBEB';
        pill.style.borderColor      = '#FDE68A';
        pill.style.color            = '#92400E';
    }
}
 
window.addEventListener('online',  atualizarStatus);
window.addEventListener('offline', atualizarStatus);
atualizarStatus();


// ==================================================
// TABELA DE POÇOS
// ==================================================

function atualizarTabelaEmpty() {
    const tbody = document.getElementById('tabelaPocos');
    const empty = document.getElementById('tableEmpty');
    if (!empty) return;
    const temLinhas = tbody && tbody.querySelectorAll('tr').length > 0;
    empty.classList.toggle('show', !temLinhas);
}

function calcularStatus(prof, dataFin) {
    if (prof && dataFin) return '<span class="badge-status badge-concluido">Concluído</span>';
    return '<span class="badge-status badge-pendente">Pendente</span>';
}

function adicionarLinhaPoco(poco = {}) {
    const tbody = document.getElementById('tabelaPocos');
    if (!tbody) return;

    const id = Date.now() + Math.random();
    const tr = document.createElement('tr');
    tr.dataset.id = id;

    tr.innerHTML = `
        <td><input type="text"   value="${poco.poco     || ''}"></td>
        <td><input type="number" value="${poco.prof     || ''}"></td>
        <td><input type="date"   value="${poco.data     || ''}"></td>
        <td>
            <select data-campo="diametro">
                <option value="">—</option>
                <option value='1/2"' ${poco.diametro === '1/2"' ? 'selected' : ''}>1/2"</option>
                <option value='2"'   ${poco.diametro === '2"'   ? 'selected' : ''}>2"</option>
                <option value='4"'   ${poco.diametro === '4"'   ? 'selected' : ''}>4"</option>
                <option value='6"'   ${poco.diametro === '6"'   ? 'selected' : ''}>6"</option>
            </select>
        </td>
        <td class="td-status">${calcularStatus(poco.prof, poco.data)}</td>
        <td>
            <button class="btn-remover-linha" title="Remover">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;

    tr.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', () => {
            const p = tr.querySelector('[data-campo="prof"]').value;
            const d = tr.querySelector('[data-campo="data"]').value;
            tr.querySelector('.td-status').innerHTML = calcularStatus(p, d);
        });
    });

    tr.querySelector('.btn-remover-linha').addEventListener('click', () => {
        tr.remove();
        atualizarTabelaEmpty();
    });

    tbody.appendChild(tr);
    atualizarTabelaEmpty();
}

document.getElementById('addPoco')?.addEventListener('click', () => adicionarLinhaPoco());


// ==================================================
// FOTOS
// ==================================================

const inputFotos = document.getElementById('fotos');
const galeria    = document.getElementById('previewFotos');

inputFotos?.addEventListener('change', function () {
    [...this.files].forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const item = document.createElement('div');
            item.className = 'foto-item';
            const num = (galeria?.querySelectorAll('.foto-item').length || 0) + 1;
            item.innerHTML = `
                <img src="${e.target.result}" alt="Foto ${num}">
                <div class="foto-label">Foto ${num}</div>
                <button class="foto-remover" title="Remover foto">
                    <i class="fas fa-times"></i>
                </button>
            `;
            item.querySelector('.foto-remover').addEventListener('click', () => {
                item.remove();
                renumerarFotos();
            });
            galeria?.appendChild(item);
        };
        reader.readAsDataURL(file);
    });
    this.value = '';
});

function renumerarFotos() {
    galeria?.querySelectorAll('.foto-item').forEach((item, i) => {
        const label = item.querySelector('.foto-label');
        if (label) label.textContent = `Foto ${i + 1}`;
    });
}


// ==================================================
// RECONHECIMENTO DE VOZ
// ==================================================

const CAMPOS_VOZ = {
    'cliente'           : ['cliente'],
    'contrato'          : ['contrato', 'número contrato', 'numero contrato'],
    'projeto'           : ['projeto', 'projeto epa'],
    'empresa'           : ['empresa'],
    'local'             : ['local', 'localização'],
    'data'              : ['data'],
    'clima'             : ['clima', 'tempo'],
    'numeroRdo'         : ['número rdo', 'numero rdo', 'rdo'],
    'realizado'         : ['realizado por', 'realizado'],
    'supervisor'        : ['supervisionado por', 'supervisor'],
    'tituloAtividade'   : ['título', 'titulo', 'atividade'],
    'descricao'         : ['descrição', 'descricao'],
    'tempoDeslocamento' : ['deslocamento', 'tempo de deslocamento'],
    'tempoLiberacao'    : ['liberação', 'aguardando liberação'],
    'interferencias'    : ['interferências', 'dificuldades'],
    'mudancasPlano'     : ['mudanças', 'plano de trabalho'],
    'acidentes'         : ['acidentes', 'incidentes'],
};

const MESES_VOZ = {
    'janeiro':1,'fevereiro':2,'março':3,'abril':4,'maio':5,'junho':6,
    'julho':7,'agosto':8,'setembro':9,'outubro':10,'novembro':11,'dezembro':12
};

const CLIMA_VOZ = {
    'ensolarado':'Ensolarado','sol':'Ensolarado',
    'nublado':'Nublado','parcialmente nublado':'Parcialmente nublado',
    'chuva':'Chuva','chuvoso':'Chuva','tempestade':'Tempestade'
};

let reconhecimento = null;
let estaGravando   = false;

function suportaVoz() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

function iniciarReconhecimento() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    reconhecimento = new SR();
    reconhecimento.lang           = 'pt-BR';
    reconhecimento.continuous     = true;
    reconhecimento.interimResults = true;

    reconhecimento.onstart = () => {
        estaGravando = true;
        atualizarUIGravando(true);
        mostrarToast('🎤 Ouvindo... Diga o campo e o valor.', 'success');
    };

    reconhecimento.onresult = (event) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const t = event.results[i][0].transcript;
            if (event.results[i].isFinal) final += t + ' ';
            else interim += t;
        }
        if (final.trim()) processarComando(final.trim().toLowerCase());
        const el = document.getElementById('gravandoTexto');
        if (el) el.textContent = interim || 'Ouvindo...';
    };

    reconhecimento.onerror = (event) => {
        if (event.error === 'no-speech') return;
        if (event.error === 'not-allowed') {
            mostrarToast('❌ Microfone bloqueado.', 'error');
            pararReconhecimento();
        }
    };

    reconhecimento.onend = () => {
        if (estaGravando) {
            try { reconhecimento.start(); } catch(e) {}
        } else {
            atualizarUIGravando(false);
        }
    };

    reconhecimento.start();
}

function pararReconhecimento() {
    estaGravando = false;
    if (reconhecimento) { reconhecimento.stop(); reconhecimento = null; }
    atualizarUIGravando(false);
    mostrarToast('⏹️ Gravação encerrada.', '');
}

function atualizarUIGravando(gravando) {
    const btn   = document.getElementById('btnIA');
    const badge = document.getElementById('gravandoBadge');
    const icon  = document.getElementById('micIcon');
    const label = document.getElementById('micLabel');
    if (btn)   btn.classList.toggle('gravando', gravando);
    if (badge) badge.classList.toggle('show', gravando);
    if (icon)  icon.className = gravando ? 'fas fa-stop' : 'fas fa-microphone';
    if (label) label.textContent = gravando ? 'Parar' : 'Falar Relatório';
}

function processarComando(texto) {
    if (['parar','pare','stop','finalizar','encerrar'].includes(texto.trim())) {
        pararReconhecimento();
        return;
    }
    let campoId = null;
    let valor   = texto;
    for (const [id, palavras] of Object.entries(CAMPOS_VOZ)) {
        for (const p of palavras) {
            const match = texto.match(new RegExp(`${p}[:\\s]+(.+)`, 'i'));
            if (match) { campoId = id; valor = match[1].trim(); break; }
        }
        if (campoId) break;
    }
    if (!campoId) {
        const focado = document.activeElement;
        if (focado && focado.id && document.getElementById(focado.id)) {
            campoId = focado.id; valor = texto;
        } else {
            mostrarToast('💬 Diga: "[campo] [valor]". Ex: "cliente VALE"', 'warning');
            return;
        }
    }
    preencherCampoPorVoz(campoId, valor);
}

function preencherCampoPorVoz(campoId, valor) {
    const el = document.getElementById(campoId);
    if (!el) return;
    let valorFinal = valor.trim();

    if (campoId === 'data') {
        valorFinal = interpretarData(valorFinal);
        if (!valorFinal) { mostrarToast('⚠️ Data não reconhecida.', 'warning'); return; }
    }

    if (campoId === 'clima') {
        for (const [chave, val] of Object.entries(CLIMA_VOZ)) {
            if (valorFinal.toLowerCase().includes(chave)) { el.value = val; break; }
        }
        el.classList.add('preenchido-por-voz');
        setTimeout(() => el.classList.remove('preenchido-por-voz'), 2500);
        mostrarToast(`✅ Clima: ${el.value}`, 'success');
        return;
    }

    if (el.tagName === 'TEXTAREA' && el.value.trim()) {
        el.value += ' ' + valorFinal;
    } else {
        el.value = valorFinal;
    }

    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('change'));
    el.classList.add('preenchido-por-voz');
    setTimeout(() => el.classList.remove('preenchido-por-voz'), 2500);
    mostrarToast(`✅ ${campoId}: ${valorFinal.slice(0,40)}`, 'success');
}

function interpretarData(texto) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return texto;
    const dmy = texto.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dmy) return `${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;
    const ext = texto.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
    if (ext) {
        const mes = MESES_VOZ[ext[2].toLowerCase()];
        if (mes) return `${ext[3]}-${String(mes).padStart(2,'0')}-${ext[1].padStart(2,'0')}`;
    }
    return null;
}

document.getElementById('btnIA')?.addEventListener('click', () => {
    if (!suportaVoz()) { mostrarToast('❌ Navegador não suporta voz.', 'error'); return; }
    estaGravando ? pararReconhecimento() : iniciarReconhecimento();
});


// ==================================================
// COLETAR DADOS
// ==================================================

function coletarDados() {
    const get = id => document.getElementById(id)?.value || '';
    const pocos = [];
    document.querySelectorAll('#tabelaPocos tr').forEach(tr => {
        const poco = tr.querySelector('[data-campo="poco"]')?.value || '';
        if (poco) pocos.push({
            poco,
            prof     : tr.querySelector('[data-campo="prof"]')?.value     || '',
            data     : tr.querySelector('[data-campo="data"]')?.value     || '',
            diametro : tr.querySelector('[data-campo="diametro"]')?.value || '',
        });
    });
    return {
        id               : `${get('data')}-${get('numeroRdo') || Date.now()}`,
        data             : get('data'),
        numeroRdo        : get('numeroRdo'),
        cliente          : get('cliente'),
        contrato         : get('contrato'),
        projeto          : get('projeto'),
        empresa          : get('empresa'),
        local            : get('local'),
        clima            : get('clima'),
        realizado        : get('realizado'),
        supervisor       : get('supervisor'),
        tituloAtividade  : get('tituloAtividade'),
        descricao        : get('descricao'),
        pocos,
        tempoDeslocamento: get('tempoDeslocamento'),
        tempoLiberacao   : get('tempoLiberacao'),
        interferencias   : get('interferencias'),
        mudancasPlano    : get('mudancasPlano'),
        acidentes        : get('acidentes'),
        status           : 'rascunho',
        salvo_em         : new Date().toISOString(),
    };
}


// ==================================================
// SALVAR
// ==================================================

document.getElementById('btnSalvar')?.addEventListener('click', () => {
    const dados = coletarDados();
    if (!dados.data) { mostrarToast('⚠️ Preencha a data antes de salvar.', 'warning'); return; }
    const lista = JSON.parse(localStorage.getItem('rdos') || '[]');
    const idx   = lista.findIndex(r => r.id === dados.id);
    if (idx >= 0) lista[idx] = dados; else lista.unshift(dados);
    localStorage.setItem('rdos', JSON.stringify(lista));
    mostrarToast('💾 RDO salvo com sucesso!', 'success');
});


// ==================================================
// ENVIAR VIA EMAILJS
// ==================================================

document.getElementById('btnEnviar')?.addEventListener('click', async () => {
    const dados = coletarDados();

    if (!dados.data || !dados.cliente) {
        mostrarToast('⚠️ Preencha ao menos Data e Cliente antes de enviar.', 'warning');
        return;
    }
    if (!navigator.onLine) {
        mostrarToast('📶 Sem internet. Salve e tente quando reconectar.', 'warning');
        return;
    }
    if (typeof emailjs === 'undefined') {
        mostrarToast('❌ SDK do EmailJS não carregado. Verifique o HTML.', 'error');
        return;
    }

    const btn = document.getElementById('btnEnviar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Enviando...</span>';

    try {
        const pocosTxt = dados.pocos.length
            ? dados.pocos.map(p => `${p.poco} | Prof: ${p.prof || '—'} | Data: ${p.data || '—'} | Ø${p.diametro || '—'}`).join('\n')
            : 'Nenhum poço registrado.';

        const conteudo =
            `RELATÓRIO DIÁRIO DE OBRA – GRUPO EPA\n` +
            `${'='.repeat(48)}\n\n` +
            `Cliente       : ${dados.cliente}\n` +
            `Contrato      : ${dados.contrato}\n` +
            `Projeto EPA   : ${dados.projeto}\n` +
            `Empresa       : ${dados.empresa}\n` +
            `Local         : ${dados.local}\n` +
            `Data          : ${dados.data}\n` +
            `Clima         : ${dados.clima}\n` +
            `Nº RDO        : ${dados.numeroRdo}\n` +
            `Realizado por : ${dados.realizado}\n` +
            `Supervisor    : ${dados.supervisor}\n\n` +
            `ATIVIDADE\n${'-'.repeat(40)}\n` +
            `${dados.tituloAtividade}\n\n${dados.descricao}\n\n` +
            `POÇOS EXECUTADOS\n${'-'.repeat(40)}\n${pocosTxt}\n\n` +
            `INFORMAÇÕES FINAIS\n${'-'.repeat(40)}\n` +
            `Deslocamento      : ${dados.tempoDeslocamento}\n` +
            `Aguard. Liberação : ${dados.tempoLiberacao}\n` +
            `Interferências    : ${dados.interferencias}\n` +
            `Mudanças no Plano : ${dados.mudancasPlano}\n` +
            `Acidentes/Incid.  : ${dados.acidentes}\n`;

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            destinatario : EMAIL_DESTINO,
            numero_rdo   : dados.numeroRdo || '—',
            cliente      : dados.cliente,
            local        : dados.local,
            data         : dados.data,
            conteudo_rdo : conteudo,
        });

        mostrarToast('📧 RDO enviado com sucesso!', 'success');

        // Marca como enviado
        const lista = JSON.parse(localStorage.getItem('rdos') || '[]');
        const idx   = lista.findIndex(r => r.id === dados.id);
        if (idx >= 0) {
            lista[idx].status     = 'enviado';
            lista[idx].enviado_em = new Date().toISOString();
            localStorage.setItem('rdos', JSON.stringify(lista));
        }

    } catch (erro) {
        console.error('EmailJS erro:', erro);
        mostrarToast('❌ Erro ao enviar. Tente novamente.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i><span>Enviar</span>';
    }
});


// ==================================================
// GERAR PDF
// ==================================================

document.getElementById('btnPdf')?.addEventListener('click', () => {
    const dados = coletarDados();
    if (!dados.data || !dados.cliente) {
        mostrarToast('⚠️ Preencha ao menos Data e Cliente para gerar o PDF.', 'warning');
        return;
    }
    mostrarToast('📄 Preparando PDF...', '');
    setTimeout(() => window.print(), 400);
});


// ==================================================
// TOAST
// ==================================================

function mostrarToast(msg, tipo = '') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className   = `toast show ${tipo}`;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}


// ==================================================
// CARREGAR RDO EXISTENTE
// ==================================================

function carregarRdo(rdo) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('cliente', rdo.cliente); set('contrato', rdo.contrato); set('projeto', rdo.projeto);
    set('empresa', rdo.empresa); set('local', rdo.local);       set('data', rdo.data);
    set('clima', rdo.clima);     set('numeroRdo', rdo.numeroRdo);
    set('realizado', rdo.realizado);     set('supervisor', rdo.supervisor);
    set('tituloAtividade', rdo.tituloAtividade); set('descricao', rdo.descricao);
    set('tempoDeslocamento', rdo.tempoDeslocamento); set('tempoLiberacao', rdo.tempoLiberacao);
    set('interferencias', rdo.interferencias); set('mudancasPlano', rdo.mudancasPlano);
    set('acidentes', rdo.acidentes);
    (rdo.pocos || []).forEach(p => adicionarLinhaPoco(p));
}