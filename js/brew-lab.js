/* Brew Lab: ratio calculator, guided timer, grind guide */
(function () {
  'use strict';
  const CBS = window.CBS;
  const $ = function (s) { return document.querySelector(s); };
  const fmt = CBS.fmt;

  /* ======================= 1. Ratio calculator ======================= */
  const METHODS = [
    { id: 'espresso', name: 'Espresso', ratio: 2, coffee: 18, note: 'For espresso, "water" is the liquid in the cup (the yield), not the water the machine uses. Shots usually land between 1:1.5 and 1:3.' },
    { id: 'pour', name: 'Pour-over', ratio: 16, coffee: 20, note: 'A good starting point for V60 and similar drippers. Want it stronger? Lower the number. Weaker? Raise it.' },
    { id: 'press', name: 'French press', ratio: 15, coffee: 30, note: 'Immersion brewing handles a slightly stronger ratio well. Use a coarse grind and about 4 minutes.' },
    { id: 'cold', name: 'Cold brew', ratio: 8, coffee: 100, note: 'This makes a concentrate. Dilute about 1:1 with water or milk when serving. Steep 12 to 18 hours in the fridge.' },
    { id: 'custom', name: 'Custom', ratio: null, coffee: 18, note: '' }
  ];
  const zoneFor = function (r) {
    if (r <= 3) return 'That is espresso territory.';
    if (r <= 10) return 'That is a concentrate. Dilute it before drinking.';
    if (r <= 14) return 'Strong and full-bodied.';
    if (r <= 17.5) return 'Right in the filter and press sweet spot.';
    return 'Light and tea-like. Expect something delicate.';
  };

  const cEl = $('#calc-coffee'), wEl = $('#calc-water'), rEl = $('#calc-ratio');
  const calc = { method: 'pour', ratio: 16 };
  const methodsBox = $('#calc-methods');

  methodsBox.innerHTML = METHODS.map(function (m) {
    return '<button type="button" class="chip" role="radio" aria-checked="' + (m.id === calc.method) + '" data-id="' + m.id + '">' + m.name + '</button>';
  }).join('');

  function round1(n) { return Math.round(n * 10) / 10; }

  function paint() {
    const g = parseFloat(cEl.value) || 0, w = parseFloat(wEl.value) || 0, r = calc.ratio;
    $('#calc-ratio-val').textContent = Number.isInteger(r) ? r : r.toFixed(1);
    $('#calc-out-water').textContent = fmt(w);
    $('#calc-bar').style.flexBasis = Math.max(1 / (1 + r) * 100, 1.5) + '%';
    $('#calc-leg-coffee').textContent = fmt(g) + ' g coffee';
    $('#calc-leg-water').textContent = fmt(w) + ' g water';
    const m = METHODS.find(function (x) { return x.id === calc.method; });
    $('#calc-note').textContent = (m && m.note ? m.note + ' ' : '') + (m && m.id === 'custom' ? zoneFor(r) : '');
    rEl.value = r;
  }
  function matchMethod() {
    const m = METHODS.find(function (x) { return x.ratio === calc.ratio; });
    calc.method = m ? m.id : 'custom';
    methodsBox.querySelectorAll('.chip').forEach(function (c) {
      const on = c.dataset.id === calc.method;
      c.setAttribute('aria-checked', String(on)); c.tabIndex = on ? 0 : -1;
    });
  }

  CBS.roving(methodsBox, '.chip', 'aria-checked', function (el) {
    const m = METHODS.find(function (x) { return x.id === el.dataset.id; });
    calc.method = m.id;
    if (m.ratio) {
      calc.ratio = m.ratio;
      cEl.value = m.coffee;
      wEl.value = round1(m.coffee * m.ratio);
    }
    paint();
  });
  cEl.addEventListener('input', function () { wEl.value = round1((parseFloat(cEl.value) || 0) * calc.ratio); paint(); });
  wEl.addEventListener('input', function () { cEl.value = round1((parseFloat(wEl.value) || 0) / calc.ratio); paint(); });
  rEl.addEventListener('input', function () {
    calc.ratio = parseFloat(rEl.value);
    wEl.value = round1((parseFloat(cEl.value) || 0) * calc.ratio);
    matchMethod(); paint();
  });
  // Initial state = Pour-over at its preset
  cEl.value = 20; wEl.value = 320; calc.ratio = 16; paint();

  /* ======================= 2. Brew timer ======================= */
  const TM = {
    v60: {
      name: 'V60 pour-over', water: true,
      stages: function (w) {
        return [
          { t: 0,   n: 'Bloom',        w: round1(w * 0.1875) + ' g', hint: 'Pour about three times the coffee weight over the grounds and let it bubble.' },
          { t: 45,  n: 'First pour',   w: 'to ' + round1(w * 0.6) + ' g', hint: 'Pour slowly in circles, keeping the water level even.' },
          { t: 90,  n: 'Final pour',   w: 'to ' + round1(w) + ' g', hint: 'Pour up to the total and stop. Give the dripper a gentle swirl.' },
          { t: 120, n: 'Draw down',    w: '', hint: 'Let the water drain. A flat bed means an even extraction.' },
          { t: 195, n: 'Done',         w: '', hint: 'Aim to be finished by about 3:15. If not, adjust the grind next time.' }
        ];
      }
    },
    press: {
      name: 'French press', water: false,
      stages: function () {
        return [
          { t: 0,   n: 'Pour and stir', w: 'all water', hint: 'Add all the water, stir gently, and put the lid on with the plunger up.' },
          { t: 240, n: 'Break the crust', w: '', hint: 'Stir the top once, skim any foam, then press down slowly.' },
          { t: 270, n: 'Serve', w: '', hint: 'Pour everything out right away so it does not over-extract.' }
        ];
      }
    },
    espresso: {
      name: 'Espresso shot', water: false,
      stages: function () {
        return [
          { t: 0,  n: 'Pull the shot', w: '', hint: 'Start the pump with the cup on the scale.' },
          { t: 25, n: 'Watch the scale', w: '36 g', hint: 'You want about 36 g in the cup between 25 and 30 seconds.' },
          { t: 30, n: 'Stop', w: '', hint: 'Stop the shot. Too fast: grind finer. Too slow: grind coarser.' },
          { t: 35, n: 'Serve', w: '', hint: 'Drink it while the crema is fresh.' }
        ];
      }
    }
  };
  const mm = function (s) { const m = Math.floor(s / 60); return m + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };

  const tmBox = $('#timer-methods'), waterField = $('#timer-water-field'), waterEl = $('#timer-water');
  const listEl = $('#stage-list'), clock = $('#clock'), prog = $('#progress'), now = $('#now');
  const startBtn = $('#tm-start'), resetBtn = $('#tm-reset'), chime = $('#tm-chime');
  let method = 'v60', stages = [], total = 0, elapsed = 0, startedAt = 0, timer = 0, running = false, active = -1, wake = null, audio = null;

  tmBox.innerHTML = Object.keys(TM).map(function (k) {
    return '<button type="button" class="chip" role="radio" aria-checked="' + (k === method) + '" data-id="' + k + '">' + TM[k].name + '</button>';
  }).join('');

  function build() {
    const w = Math.max(50, parseFloat(waterEl.value) || 320);
    stages = TM[method].stages(w);
    total = stages[stages.length - 1].t;
    waterField.hidden = !TM[method].water;
    listEl.innerHTML = stages.map(function (s) {
      return '<li class="stage"><span class="t">' + mm(s.t) + '</span><span class="n">' + s.n + '</span><span class="w">' + s.w + '</span></li>';
    }).join('');
    paintTimer();
  }
  function paintTimer() {
    clock.textContent = mm(elapsed);
    prog.style.width = Math.min(100, (elapsed / total) * 100) + '%';
    let a = -1;
    stages.forEach(function (s, i) { if (elapsed >= s.t) a = i; });
    if (!running && elapsed === 0) a = -1;
    const items = listEl.children;
    for (let i = 0; i < items.length; i++) {
      items[i].classList.toggle('is-active', i === a);
      items[i].classList.toggle('is-done', a > -1 && i < a);
    }
    if (a !== active) {
      active = a;
      if (running && chime.checked) beep();
    }
    if (a === -1) {
      now.innerHTML = '<span class="now-label">Ready</span><span class="now-hint">' + stages[0].hint + '</span>';
    } else {
      const s = stages[a];
      now.innerHTML = '<span class="now-label">' + s.n + (s.w ? ' &middot; ' + s.w : '') + '</span><span class="now-hint">' + s.hint + '</span>';
    }
  }
  function beep() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = 880; o.type = 'sine';
      g.gain.setValueAtTime(0.0001, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, audio.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.4);
      o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + 0.42);
    } catch (e) { /* audio unavailable */ }
  }
  async function lock() { try { if ('wakeLock' in navigator) wake = await navigator.wakeLock.request('screen'); } catch (e) { wake = null; } }
  function unlock() { if (wake) { wake.release().catch(function () {}); wake = null; } }

  function tick() {
    elapsed = (performance.now() - startedAt) / 1000;
    if (elapsed >= total) { elapsed = total; stop(); startBtn.textContent = 'Start again'; }
    paintTimer();
  }
  function stop() { running = false; clearInterval(timer); unlock(); startBtn.textContent = elapsed > 0 && elapsed < total ? 'Resume' : 'Start'; }
  function start() {
    if (elapsed >= total) { elapsed = 0; active = -1; }
    running = true;
    startedAt = performance.now() - elapsed * 1000;
    clearInterval(timer);
    timer = setInterval(tick, 100);
    startBtn.textContent = 'Pause';
    lock();
  }
  startBtn.addEventListener('click', function () { running ? stop() : start(); });
  resetBtn.addEventListener('click', function () { stop(); elapsed = 0; active = -1; startBtn.textContent = 'Start'; paintTimer(); });
  waterEl.addEventListener('input', function () { stop(); elapsed = 0; active = -1; startBtn.textContent = 'Start'; build(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && running) lock(); });

  CBS.roving(tmBox, '.chip', 'aria-checked', function (el) {
    stop(); elapsed = 0; active = -1; method = el.dataset.id; startBtn.textContent = 'Start'; build();
  });
  build();

  /* ======================= 3. Grind guide ======================= */
  const GRINDS = [
    { id: 'xfine', name: 'Extra fine', sub: 'powdered sugar', dot: 2.2, use: 'Turkish coffee', text: 'Powder-fine, almost silky between your fingers. Made for Turkish coffee in a cezve, where the grounds stay in the cup.' },
    { id: 'fine', name: 'Fine', sub: 'table salt', dot: 3.6, use: 'Espresso, moka pot', text: 'Fine enough to resist the water under pressure. Espresso lives here, and a moka pot sits just a touch coarser.' },
    { id: 'mfine', name: 'Medium-fine', sub: 'sand', dot: 6, use: 'V60, AeroPress', text: 'Gritty like fine sand. Cone drippers and short immersion brews such as the AeroPress work well at this size.' },
    { id: 'medium', name: 'Medium', sub: 'coarse sand', dot: 9, use: 'Drip machines, flat-bed drippers', text: 'Between sand and sea salt. A sensible default for automatic drip machines and flat-bottom drippers.' },
    { id: 'coarse', name: 'Coarse', sub: 'sea salt', dot: 13, use: 'French press, cold brew', text: 'Chunky and distinct. Long steeps need big particles so the cup stays clean and the plunger moves freely.' }
  ];
  const gScale = $('#grind-scale'), gDetail = $('#grind-detail');
  gScale.innerHTML = GRINDS.map(function (g, i) {
    return '<button type="button" class="grind" data-i="' + i + '" aria-pressed="' + (i === 2) + '" style="--dot:' + g.dot + 'px">' +
      '<span class="swatch" aria-hidden="true"></span><span class="g-name">' + g.name + '</span><span class="g-sub">' + g.sub + '</span></button>';
  }).join('');
  function showGrind(i) {
    const g = GRINDS[i];
    gScale.querySelectorAll('.grind').forEach(function (b) { b.setAttribute('aria-pressed', String(parseInt(b.dataset.i, 10) === i)); });
    gDetail.innerHTML = '<div><div class="label">Best for</div><h3>' + g.use + '</h3></div><p>' + g.text + '</p>';
  }
  gScale.addEventListener('click', function (e) { const b = e.target.closest('.grind'); if (b) showGrind(parseInt(b.dataset.i, 10)); });
  showGrind(2);
})();
