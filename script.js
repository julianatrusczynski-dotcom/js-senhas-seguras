const tamanhoSenhaEl = document.getElementById('tamanho-senha');
const campoSenha = document.getElementById('campo-senha');
const aumentarBtn = document.getElementById('aumentar');
const diminuirBtn = document.getElementById('diminuir');
const gerarSenhaBtn = document.getElementById('gerar-senha');
const copiarSenhaBtn = document.getElementById('copiar-senha');
const preenchimentoForca = document.getElementById('forca-preenchimento');
const textoForca = document.getElementById('forca-texto');

const minusculasInput = document.getElementById('minusculas');
const maiusculasInput = document.getElementById('maiusculas');
const numerosInput = document.getElementById('numeros');
const simbolosInput = document.getElementById('simbolos');

const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numeros = '0123456789';
const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';

let tamanhoSenha = 12;

function atualizarTextoTamanho() {
    tamanhoSenhaEl.textContent = tamanhoSenha;
}

function obterConjuntoSelecionado() {
    let conjunto = '';

    if (minusculasInput.checked) conjunto += letrasMinusculas;
    if (maiusculasInput.checked) conjunto += letrasMaiusculas;
    if (numerosInput.checked) conjunto += numeros;
    if (simbolosInput.checked) conjunto += simbolos;

    if (!conjunto) {
        minusculasInput.checked = true;
        conjunto = letrasMinusculas;
    }

    return conjunto;
}

function gerarSenha() {
    const conjunto = obterConjuntoSelecionado();
    let senha = '';

    for (let i = 0; i < tamanhoSenha; i++) {
        const indiceAleatorio = Math.floor(Math.random() * conjunto.length);
        senha += conjunto[indiceAleatorio];
    }

    if (minusculasInput.checked && !/[a-z]/.test(senha)) {
        senha = senha.replace(/.$/, letrasMinusculas[Math.floor(Math.random() * letrasMinusculas.length)]);
    }

    if (maiusculasInput.checked && !/[A-Z]/.test(senha)) {
        senha = senha.replace(/.$/, letrasMaiusculas[Math.floor(Math.random() * letrasMaiusculas.length)]);
    }

    if (numerosInput.checked && !/[0-9]/.test(senha)) {
        senha = senha.replace(/.$/, numeros[Math.floor(Math.random() * numeros.length)]);
    }

    if (simbolosInput.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(senha)) {
        senha = senha.replace(/.$/, simbolos[Math.floor(Math.random() * simbolos.length)]);
    }

    campoSenha.value = senha;
    atualizarForcaSenha();
}

function atualizarForcaSenha() {
    const senha = campoSenha.value;
    let score = 0;

    if (senha.length >= 8) score += 1;
    if (senha.length >= 12) score += 1;
    if (senha.length >= 16) score += 1;

    if (/[a-z]/.test(senha)) score += 1;
    if (/[A-Z]/.test(senha)) score += 1;
    if (/[0-9]/.test(senha)) score += 1;
    if (/[^A-Za-z0-9]/.test(senha)) score += 1;

    let nivel = 'Fraca';
    let classe = 'fraca';
    let largura = '33%';

    if (score >= 6) {
        nivel = 'Forte';
        classe = 'forte';
        largura = '100%';
    } else if (score >= 4) {
        nivel = 'Média';
        classe = 'media';
        largura = '66%';
    }

    preenchimentoForca.style.width = largura;
    preenchimentoForca.style.backgroundColor = classe === 'fraca' ? '#ef4444' : classe === 'media' ? '#f59e0b' : '#22c55e';
    textoForca.textContent = nivel;
    textoForca.className = 'forca-texto ' + classe;
}

function ajustarTamanhoSenha(novoValor) {
    tamanhoSenha = Math.min(32, Math.max(4, novoValor));
    atualizarTextoTamanho();
    gerarSenha();
}

function copiarSenha() {
    if (!campoSenha.value) return;

    navigator.clipboard.writeText(campoSenha.value)
        .then(() => {
            copiarSenhaBtn.textContent = 'Copiado!';
            copiarSenhaBtn.classList.add('copiado');
            setTimeout(() => {
                copiarSenhaBtn.textContent = 'Copiar senha';
                copiarSenhaBtn.classList.remove('copiado');
            }, 1500);
        })
        .catch(() => {
            copiarSenhaBtn.textContent = 'Não foi possível copiar';
        });
}

[aumentarBtn, diminuirBtn].forEach((botao) => {
    botao.addEventListener('click', () => {
        const delta = botao.id === 'aumentar' ? 1 : -1;
        ajustarTamanhoSenha(tamanhoSenha + delta);
    });
});

[minusculasInput, maiusculasInput, numerosInput, simbolosInput].forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        const algumSelecionado = minusculasInput.checked || maiusculasInput.checked || numerosInput.checked || simbolosInput.checked;

        if (!algumSelecionado) {
            checkbox.checked = true;
        }

        gerarSenha();
    });
});

gerarSenhaBtn.addEventListener('click', gerarSenha);
copiarSenhaBtn.addEventListener('click', copiarSenha);

atualizarTextoTamanho();
gerarSenha();
