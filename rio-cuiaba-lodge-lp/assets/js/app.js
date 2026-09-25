/* Rio Cuiabá Lodge — LP de captura */
(function () {
  'use strict';

  /* ---- ano do rodapé ---- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---- topbar sólida ao rolar + botão flutuante ---- */
  var topbar = document.getElementById('topbar');
  var float = document.getElementById('float');
  var tick = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (topbar) topbar.classList.toggle('stuck', y > 60);
    if (float) float.classList.toggle('on', y > window.innerHeight * 0.85);   // privacidade/termos não têm botão flutuante
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- reveal escalonado ---- */
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('rv');
        });
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 7) * 70 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- vídeo do hero: só em tela grande, boa conexão e se o arquivo existir ---- */
  (function () {
    var v = document.getElementById('heroVideo');
    if (!v) return;
    var hero = document.querySelector('.hero');
    var conn = navigator.connection || {};
    var poupaDados = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || '');
    var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (window.innerWidth < 860 || poupaDados || reduzMovimento) { v.remove(); return; }

    function desiste() { hero.classList.remove('has-video'); v.remove(); }
    v.addEventListener('error', desiste);
    v.addEventListener('canplay', function () {
      hero.classList.add('has-video');
      v.classList.add('on');
      var p = v.play();
      if (p && p.catch) p.catch(desiste);
    }, { once: true });

    v.src = v.dataset.src;
    v.load();
  })();

  /* ---- preços: fonte única em assets/js/config.js ---- */
  (function () {
    var CFG = window.RCL_CONFIG;
    if (!CFG) return;                                  // privacidade/termos não carregam o config
    var P = CFG.precos;
    var porBarco = CFG.pessoasPorBarco || 3;

    // Data de hoje em AAAA-MM-DD. Para conferir como o site fica em outra data,
    // abra a página com ?data=2026-10-01 no fim do endereço.
    function hojeISO() {
      var q = /[?&]data=(\d{4}-\d{2}-\d{2})/.exec(location.search);
      if (q) return q[1];
      var d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    function vigente(p) {
      if (p.validoAte && p.valorDepois != null && hojeISO() > p.validoAte) return p.valorDepois;
      return p.valor;
    }
    function brl(n) { return 'R$ ' + Math.round(n).toLocaleString('pt-BR'); }
    function whats(msg) { return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg); }
    function escreve(sel, txt) { document.querySelectorAll(sel).forEach(function (el) { el.textContent = txt; }); }

    window.RCL = { vigente: vigente, brl: brl, whats: whats };   // usado também pelo montador.js

    // Day use: POR BARCO, com ou sem comida e bebida
    var dayUse = document.getElementById('ticket-dayuse');
    function pintaDayUse() {
      if (!dayUse) return;
      var marcado = dayUse.querySelector('input[name="dayuse-alimentacao"]:checked');
      var com = !marcado || marcado.value === 'com';
      var valor = vigente(com ? P.dayUseComAlimentacao : P.dayUseSemAlimentacao);

      escreve('[data-preco="dayUse"]', brl(valor));
      escreve('[data-preco-pessoa="dayUse"]', 'equivale a ' + brl(valor / porBarco) + ' por pessoa');

      var item = dayUse.querySelector('[data-refeicao]');
      if (item) item.textContent = com ? item.dataset.com : item.dataset.sem;

      var link = dayUse.querySelector('[data-whats="dayuse"]');
      if (link) {
        link.href = whats('Olá! Vim pelo site e quero reservar o Day Use de pesca ' + (com ? 'com' : 'sem') +
          ' comida e bebida, ' + brl(valor) + ' por barco para até ' + porBarco + ' pessoas. Quais datas estão disponíveis?');
        link.dataset.cta = com ? 'dayuse' : 'dayuse-sem';   // o GTM separa as duas versões pelo campo "origem"
      }
    }
    if (dayUse) dayUse.addEventListener('change', pintaDayUse);
    pintaDayUse();

    // Diária all inclusive: POR PESSOA
    var diaria = vigente(P.diariaAllInclusive);
    escreve('[data-preco="diaria"]', brl(diaria));
    var linkDiaria = document.querySelector('[data-whats="diaria"]');
    if (linkDiaria) linkDiaria.href = whats('Olá! Vim pelo site e quero reservar a diária all inclusive da temporada 2027, ' +
      brl(diaria) + ' por pessoa. Quais datas estão disponíveis?');
  })();

  /* ---- o ano em fases: passar o mouse (ou tocar) num mês acende a fase, e vice-versa ---- */
  (function () {
    var ano = document.getElementById('ano-rio');
    if (!ano) return;
    var itens = ano.querySelectorAll('[data-fase]');

    function acende(alvo) {
      var fases = alvo.dataset.fase.split(' ');          // abril pertence a duas fases
      ano.classList.add('tem-foco');
      itens.forEach(function (el) {
        var liga = el.dataset.fase.split(' ').some(function (f) { return fases.indexOf(f) > -1; });
        el.classList.toggle('is-foco', liga);
      });
    }
    function apaga() {
      ano.classList.remove('tem-foco');
      itens.forEach(function (el) { el.classList.remove('is-foco'); });
    }

    ano.addEventListener('mouseover', function (ev) {
      var alvo = ev.target.closest('[data-fase]');
      if (alvo) acende(alvo); else apaga();
    });
    ano.addEventListener('mouseleave', apaga);
    ano.addEventListener('click', function (ev) {        // toque no celular
      var alvo = ev.target.closest('[data-fase]');
      if (alvo) acende(alvo); else apaga();
    });
    document.addEventListener('click', function (ev) {  // tocar fora do calendário limpa o destaque
      if (!ano.contains(ev.target)) apaga();
    });
  })();

  /* ---- fachada do YouTube (carrega o iframe só no clique) ---- */
  document.querySelectorAll('.vid').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.dataset.yt;
      if (!id || btn.dataset.loaded) return;
      btn.dataset.loaded = '1';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = 'Depoimento de hóspede do Rio Cuiabá Lodge';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      btn.appendChild(f);
    });
  });

  /* ---- ganchos de rastreio (dispara se houver pixel/gtag na página) ---- */
  document.querySelectorAll('[data-cta]').forEach(function (a) {
    a.addEventListener('click', function () {
      var origem = a.dataset.cta;
      try {
        if (window.fbq) window.fbq('track', 'Contact', { content_name: origem });
        if (window.gtag) window.gtag('event', 'conversao_whatsapp', { origem: origem });
        if (window.dataLayer) window.dataLayer.push({ event: 'clique_whatsapp', origem: origem });
      } catch (e) {}
    });
  });
})();
