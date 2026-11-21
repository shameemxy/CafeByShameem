/* Home: method index, random recipe picker, ratio dial */
(function () {
  'use strict';
  const CBS = window.CBS;
  const $ = function (s, c) { return (c || document).querySelector(s); };

  /* Method index ----------------------------------------------------------- */
  const list = $('#method-index');
  if (list) {
    list.innerHTML = CBS.recipes.map(function (r, i) {
      return '<li><a class="index-row" href="recipes.html#' + r.id + '">' +
        '<span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="name">' + r.name + '</span>' +
        '<span class="meta">' + r.ratio + ' &middot; ' + r.time + '</span>' +
        CBS.icons.arrow + '</a></li>';
    }).join('');
  }

  /* Random recipe ----------------------------------------------------------- */
  const btn = $('#surprise-btn');
  const panel = $('#pick-panel');
  let last = -1;
  if (btn && panel) {
    btn.addEventListener('click', function () {
      let i;
      do { i = Math.floor(Math.random() * CBS.recipes.length); } while (i === last && CBS.recipes.length > 1);
      last = i;
      const r = CBS.recipes[i];
      const ing = r.ingredients.map(function (x) {
        return '<li>' + (x.q == null ? '' : '<b class="mono">' + CBS.fmt(x.q) + ' ' + x.u + '</b> ') + x.n + '</li>';
      }).join('');
      panel.classList.remove('is-swapping');
      void panel.offsetWidth; // restart animation
      panel.innerHTML =
        '<div class="pick-head"><span>' + CBS.glyph(r.glyph) + '</span><div>' +
        '<div class="tag-row"><span>' + r.category + '</span><span>' + r.time + '</span><span>' + r.level + '</span></div>' +
        '<h3>' + r.name + '</h3></div></div>' +
        '<p class="muted">' + r.blurb + '</p>' +
        '<div class="pick-cols"><div><h4>Ingredients</h4><ul>' + ing + '</ul></div>' +
        '<div><h4>Method</h4><ol>' + r.steps.slice(0, 3).map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div></div>' +
        '<div class="pick-foot"><a class="link-arrow" href="recipes.html#' + r.id + '">Open full recipe ' + CBS.icons.arrow + '</a></div>';
      panel.classList.add('is-swapping');
      btn.querySelector('span').textContent = 'Pick another';
    });
  }

  /* Ratio dial --------------------------------------------------------------- */
  const coffee = $('#dial-coffee'), ratio = $('#dial-ratio');
  if (coffee && ratio) {
    const water = $('#dial-water'), rv = $('#dial-ratio-val'), bar = $('#dial-bar'), zone = $('#dial-zone');
    const zoneFor = function (r) {
      if (r <= 3) return 'Espresso territory';
      if (r <= 10) return 'Concentrate, like cold brew';
      if (r <= 14) return 'Strong and full-bodied';
      if (r <= 17.5) return 'The filter and press sweet spot';
      return 'Light, tea-like';
    };
    const update = function () {
      const g = Math.max(0, parseFloat(coffee.value) || 0);
      const r = parseFloat(ratio.value);
      water.textContent = CBS.fmt(g * r);
      rv.textContent = Number.isInteger(r) ? r : r.toFixed(1);
      bar.style.flexBasis = Math.max(1 / (1 + r) * 100, 1.5) + '%';
      zone.textContent = zoneFor(r);
    };
    coffee.addEventListener('input', update);
    ratio.addEventListener('input', update);
    update();
  }
})();
