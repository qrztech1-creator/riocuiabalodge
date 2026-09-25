/* Rio Cuiabá Lodge — montador "Monte seu pacote exclusivo"
   Preços e regras de cálculo: assets/js/config.js (bloco "montador"). */
(function () {
  'use strict';

  var CFG = window.RCL_CONFIG;
  var H = window.RCL;                                  // brl(), whats() — definidos no app.js
  var dlg = document.getElementById('montador');
  if (!CFG || !H || !dlg) return;

  var M = CFG.montador;
  var porBarco = CFG.pessoasPorBarco || 3;

  // Preço só aparece para o público depois de confirmado na config.
  // Antes disso, localhost ou ?previa mostram a conta para teste.
  var previa = !M.precosConfirmados &&
    (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]previa\b/.test(location.search));
  var mostraValor = M.precosConfirmados || previa;

  function $(sel) { return dlg.querySelector(sel); }

  var campos = {
    diasPesca: $('#m-diasPesca'),
    pernoites: $('#m-pernoites'),
    pessoas:   $('#m-pessoas')
  };

  // Limites e valores iniciais vêm da config, não do HTML
  Object.keys(campos).forEach(function (k) {
    var lim = M.limites[k];
    campos[k].min = lim.min;
    campos[k].max = lim.max;
    campos[k].value = lim.inicial;
  });

  // Lê o número sem reescrever o campo (não atrapalha quem está digitando)
  function le(el) {
    var v = parseInt(el.value, 10);
    if (isNaN(v)) v = +el.min;
    return Math.max(+el.min, Math.min(+el.max, v));
  }
  // Corrige o campo quando o valor digitado sai dos limites
  function ajusta(el) { el.value = le(el); }

  function marcado(nome) {
    var r = dlg.querySelector('input[name="' + nome + '"]:checked');
    return r ? r.value : null;
  }

  function estado() {
    return {
      pernoiteAntes: marcado('pernoiteAntes') === 'sim',
      diasPesca:     le(campos.diasPesca),
      pernoites:     le(campos.pernoites),
      pessoas:       le(campos.pessoas),
      alimentacao:   marcado('alimentacao') === 'sem' ? 'sem' : 'com'
    };
  }

  // A conta. Mesma fórmula descrita no config.js.
  function calcula(e) {
    var t = M.tabela[e.alimentacao];
    var barcos  = Math.ceil(e.pessoas / porBarco);
    var pesca   = e.diasPesca * barcos * t.pescaPorBarcoPorDia;
    var noites  = e.pernoites * e.pessoas * t.pernoitePorPessoa;
    var vespera = e.pernoiteAntes ? e.pessoas * t.pernoiteAntesPorPessoa : 0;
    return { barcos: barcos, pesca: pesca, noites: noites, vespera: vespera, total: pesca + noites + vespera };
  }

  function qtd(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

  function atualiza() {
    var e = estado();
    var c = calcula(e);

    // − e + desabilitam nos limites
    dlg.querySelectorAll('[data-passo]').forEach(function (b) {
      var el = document.getElementById(b.dataset.alvo);
      var v = le(el);
      b.disabled = +b.dataset.passo < 0 ? v <= +el.min : v >= +el.max;
    });

    // Valor e detalhamento
    var total = $('[data-total]');
    var conta = $('[data-conta]');
    $('[data-previa]').hidden = !previa;
    conta.textContent = '';

    function linha(texto, valor) {
      var li = document.createElement('li');
      var s = document.createElement('span');
      var b = document.createElement('b');
      s.textContent = texto;
      b.textContent = H.brl(valor);
      li.appendChild(s);
      li.appendChild(b);
      conta.appendChild(li);
    }

    if (mostraValor) {
      total.textContent = H.brl(c.total);
      linha(qtd(e.diasPesca, 'dia', 'dias') + ' de pesca × ' + qtd(c.barcos, 'barco', 'barcos'), c.pesca);
      if (e.pernoites)     linha(qtd(e.pernoites, 'pernoite', 'pernoites') + ' × ' + qtd(e.pessoas, 'pessoa', 'pessoas'), c.noites);
      if (e.pernoiteAntes) linha('Pernoite antes da pesca × ' + qtd(e.pessoas, 'pessoa', 'pessoas'), c.vespera);
    } else {
      total.textContent = 'Valor sob consulta';
    }

    // Mensagem pré-preenchida do WhatsApp
    var msg = [
      'Olá! Vim pelo site e quero montar um pacote exclusivo no Rio Cuiabá Lodge:',
      '',
      '• Pernoite antes da pesca: ' + (e.pernoiteAntes ? 'sim' : 'não'),
      '• Dias de pesca: ' + e.diasPesca,
      '• Pernoites: ' + e.pernoites,
      '• Pessoas: ' + e.pessoas + ' (' + qtd(c.barcos, 'barco', 'barcos') + ')',
      '• Alimentação e bebida: ' + (e.alimentacao === 'com' ? 'incluídas' : 'por minha conta'),
      ''
    ];
    if (mostraValor) {
      msg.push('Valor estimado no site: ' + H.brl(c.total) + '.');
      msg.push('Pode confirmar a disponibilidade e o valor final?');
    } else {
      msg.push('Pode me passar o valor e a disponibilidade?');
    }
    $('[data-whats-montador]').href = H.whats(msg.join('\n'));
  }

  // Abrir e fechar
  function abre() {
    atualiza();
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    document.documentElement.classList.add('modal-aberto');
    try { if (window.dataLayer) window.dataLayer.push({ event: 'abrir_montador' }); } catch (err) {}
  }
  function fecha() {
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
    document.documentElement.classList.remove('modal-aberto');
  }
  dlg.addEventListener('close', function () { document.documentElement.classList.remove('modal-aberto'); });

  document.querySelectorAll('[data-abrir-montador]').forEach(function (b) {
    b.addEventListener('click', abre);
  });

  dlg.addEventListener('click', function (ev) {
    var passo = ev.target.closest('[data-passo]');
    if (passo) {
      var el = document.getElementById(passo.dataset.alvo);
      el.value = le(el) + (+passo.dataset.passo);
      ajusta(el);
      atualiza();
      return;
    }
    if (ev.target.closest('[data-fechar-montador]')) { fecha(); return; }
    if (ev.target === dlg) fecha();                    // clique no fundo escuro
  });

  dlg.addEventListener('input', atualiza);
  dlg.addEventListener('change', function (ev) {
    if (ev.target.type === 'number') ajusta(ev.target);
    atualiza();
  });

  atualiza();
})();
