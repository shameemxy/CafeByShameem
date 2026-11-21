/* Recipes page: filter, search, recipe dialog with scaling, copy, deep links */
(function () {
  'use strict';
  const CBS = window.CBS;
  const $ = function (s, c) { return (c || document).querySelector(s); };

  const listEl = $('#list'), filtersEl = $('#filters'), countEl = $('#count');
  const emptyEl = $('#empty'), qEl = $('#q'), dlg = $('#recipe-dialog'), content = $('#rd-content');
  $('#rd-close').innerHTML = CBS.icons.close;

  const state = { cat: 'All', q: '' };
  let current = null, servings = 1, opener = null;

  /* Filters ---------------------------------------------------------------- */
  const cats = ['All'].concat(CBS.categories);
  filtersEl.innerHTML = cats.map(function (c) {
    const n = c === 'All' ? CBS.recipes.length : CBS.recipes.filter(function (r) { return r.category === c; }).length;
    return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (c === 'All') + '">' + c + '<span class="count">' + n + '</span></button>';
  }).join('');

  /* List ------------------------------------------------------------------- */
  listEl.innerHTML = CBS.recipes.map(function (r) {
    return '<button type="button" class="recipe-item" data-id="' + r.id + '" aria-haspopup="dialog">' +
      '<span class="glyph">' + CBS.glyph(r.glyph) + '</span>' +
      '<span><span class="tag-row"><span>' + r.category + '</span><span>' + r.time + '</span><span>' + r.level + '</span></span>' +
      '<h2>' + r.name + '</h2><p>' + r.blurb + '</p>' +
      '<span class="open">Open recipe ' + CBS.icons.arrow + '</span></span></button>';
  }).join('');

  function apply() {
    const q = state.q.trim().toLowerCase();
    let shown = 0;
    listEl.querySelectorAll('.recipe-item').forEach(function (el) {
      const r = CBS.byId(el.dataset.id);
      const hay = (r.name + ' ' + r.blurb + ' ' + r.category + ' ' + r.ingredients.map(function (i) { return i.n; }).join(' ')).toLowerCase();
      const ok = (state.cat === 'All' || r.category === state.cat) && (!q || hay.indexOf(q) !== -1);
      el.hidden = !ok;
      if (ok) shown++;
    });
    countEl.textContent = shown + (shown === 1 ? ' recipe' : ' recipes');
    emptyEl.classList.toggle('is-on', shown === 0);
  }
  filtersEl.addEventListener('click', function (e) {
    const b = e.target.closest('.chip'); if (!b) return;
    state.cat = b.dataset.cat;
    filtersEl.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
    apply();
  });
  qEl.addEventListener('input', function () { state.q = qEl.value; apply(); });
  $('#reset').addEventListener('click', function () {
    state.cat = 'All'; state.q = ''; qEl.value = '';
    filtersEl.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.cat === 'All')); });
    apply();
  });
  apply();

  /* Dialog ------------------------------------------------------------------ */
  function render() {
    const r = current, b = CBS.recipeBody(r, servings);
    const idx = CBS.recipes.indexOf(r);
    const prev = CBS.recipes[(idx - 1 + CBS.recipes.length) % CBS.recipes.length];
    const next = CBS.recipes[(idx + 1) % CBS.recipes.length];
    content.innerHTML =
      '<div class="rd">' +
      '<aside class="rd-side theme-dark"><span class="glyph">' + CBS.glyph(r.glyph) + '</span>' +
      '<div><p class="eyebrow">' + r.category + '</p><h2 id="rd-title" style="margin-top:.75rem">' + r.name + '</h2></div>' +
      '<p>' + r.blurb + '</p>' +
      '<dl class="rd-facts"><div><dt>Time</dt><dd>' + r.time + '</dd></div><div><dt>Level</dt><dd>' + r.level + '</dd></div>' +
      '<div><dt>Ratio</dt><dd>' + r.ratio + '</dd></div><div><dt>Base batch</dt><dd>' + r.base + ' ' + r.yieldLabel + '</dd></div></dl></aside>' +
      '<div class="rd-main">' +
      '<div class="rd-row"><h3 style="margin:0">Servings</h3><div class="stepper" role="group" aria-label="Servings">' +
      '<button type="button" class="icon-btn" data-step="-1" aria-label="Fewer servings"' + (servings <= 1 ? ' disabled' : '') + '>' + CBS.icons.minus + '</button>' +
      '<output aria-live="polite">' + servings + (servings === 1 ? ' serving' : ' servings') + '</output>' +
      '<button type="button" class="icon-btn" data-step="1" aria-label="More servings"' + (servings >= 12 ? ' disabled' : '') + '>' + CBS.icons.plus + '</button></div></div>' +
      '<section><h3>Ingredients</h3><ul>' + b.ingredients + '</ul></section>' +
      '<section><h3>Method</h3><ol class="steps">' + b.steps + '</ol></section>' +
      '<div class="tip"><b>Tip</b>' + r.tip + '</div>' +
      '<div class="rd-actions"><button type="button" class="btn btn--ghost btn--sm" data-copy>' + CBS.icons.copy + 'Copy ingredients</button>' +
      '<div style="display:flex;gap:.5rem;flex-wrap:wrap">' +
      '<button type="button" class="btn btn--ghost btn--sm" data-go="' + prev.id + '">&larr; ' + prev.name + '</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-go="' + next.id + '">' + next.name + ' &rarr;</button></div></div>' +
      '</div></div>';
    document.title = r.name + ' — Coffee by Shameem';
  }

  function open(id, from) {
    const r = CBS.byId(id); if (!r) return;
    current = r; servings = r.base; opener = from || opener;
    render();
    if (!dlg.open) dlg.showModal();
    dlg.querySelector('.dialog-scroll').scrollTop = 0;
    history.replaceState(null, '', '#' + id);
  }
  function close() { if (dlg.open) dlg.close(); }

  dlg.addEventListener('close', function () {
    history.replaceState(null, '', location.pathname + location.search);
    document.title = 'Recipes — Coffee by Shameem';
    if (opener && document.contains(opener)) opener.focus();
  });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) { close(); return; }           // backdrop
    if (e.target.closest('#rd-close')) { close(); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      servings = Math.min(12, Math.max(1, servings + parseInt(step.dataset.step, 10)));
      const checked = Array.from(dlg.querySelectorAll('[data-ing]:checked')).map(function (i) { return i.dataset.ing; });
      render();
      checked.forEach(function (n) { const el = dlg.querySelector('[data-ing="' + n + '"]'); if (el) el.checked = true; });
      const again = dlg.querySelector('[data-step="' + step.dataset.step + '"]'); if (again && !again.disabled) again.focus();
      return;
    }
    const go = e.target.closest('[data-go]');
    if (go) { open(go.dataset.go); dlg.querySelector('.rd-side').scrollIntoView({ block: 'start' }); return; }
    if (e.target.closest('[data-copy]')) {
      const f = servings / current.base;
      const text = current.name + ' (' + servings + (servings === 1 ? ' serving' : ' servings') + ')\n' +
        current.ingredients.map(function (i) { return '- ' + (i.q == null ? '' : CBS.fmt(i.q * f) + ' ' + i.u + ' ') + i.n; }).join('\n');
      const done = function () { CBS.toast('Ingredients copied'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { CBS.toast('Copy is blocked in this browser'); });
      else CBS.toast('Copy is not supported in this browser');
    }
  });

  listEl.addEventListener('click', function (e) {
    const it = e.target.closest('.recipe-item'); if (it) open(it.dataset.id, it);
  });

  /* Deep links: #id opens a recipe, #random picks one -------------------------- */
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    if (h === 'random') {
      const r = CBS.recipes[Math.floor(Math.random() * CBS.recipes.length)];
      open(r.id);
    } else if (CBS.byId(h)) open(h);
  }
  window.addEventListener('hashchange', function () { if (location.hash) route(); });
  route();
})();
