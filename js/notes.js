/* Notes page: roast spectrum tabs + troubleshooter */
(function () {
  'use strict';
  const CBS = window.CBS;
  const $ = function (s) { return document.querySelector(s); };

  /* Roast spectrum -------------------------------------------------------- */
  const ROASTS = [
    { id: 'light', name: 'Light', color: '#8a5a35', title: 'Bright and expressive',
      text: 'Roasted just far enough to develop sweetness, so more of the bean\'s origin shows through. Expect fruit, flowers and a lively, tangy acidity.',
      traits: { Acidity: 5, Body: 2, Sweetness: 3, Bitterness: 1 } },
    { id: 'medium', name: 'Medium', color: '#5a3b2a', title: 'Balanced and sweet',
      text: 'The all-rounder. Caramel, nut and chocolate notes come forward while the acidity softens. A safe place to start for almost any method.',
      traits: { Acidity: 3, Body: 3, Sweetness: 4, Bitterness: 2 } },
    { id: 'dark', name: 'Dark', color: '#2e1c14', title: 'Bold and bittersweet',
      text: 'Roast flavours take over: smoke, dark chocolate and a heavy body, with little acidity. It stands up well to milk and sugar.',
      traits: { Acidity: 1, Body: 4, Sweetness: 2, Bitterness: 4 } }
  ];
  const tabs = $('#roast-tabs'), panel = $('#roast-panel');
  tabs.innerHTML = ROASTS.map(function (r, i) {
    return '<button type="button" class="roast-tab" role="tab" aria-selected="' + (i === 1) + '" data-i="' + i + '" style="--c:' + r.color + '">' + r.name + '</button>';
  }).join('');

  function pips(n) {
    let h = '';
    for (let k = 0; k < 5; k++) h += '<i class="' + (k < n ? 'on' : '') + '" style="--k:' + k + '"></i>';
    return '<div class="pips" aria-hidden="true">' + h + '</div>';
  }
  function showRoast(i) {
    const r = ROASTS[i];
    panel.innerHTML =
      '<div><h3>' + r.title + '</h3><p>' + r.text + '</p>' +
      '<p class="fine-print">These are general tendencies. Individual beans and roasters vary.</p></div>' +
      '<div class="traits">' + Object.keys(r.traits).map(function (k) {
        return '<div class="trait"><span class="label">' + k + '</span>' + pips(r.traits[k]) +
          '<span class="visually-hidden">' + r.traits[k] + ' out of 5</span></div>';
      }).join('') + '</div>';
    panel.setAttribute('aria-label', r.name + ' roast');
  }
  CBS.roving(tabs, '.roast-tab', 'aria-selected', function (el) { showRoast(parseInt(el.dataset.i, 10)); });
  showRoast(1);

  /* Troubleshooter ---------------------------------------------------------- */
  const FIXES = [
    { id: 'sour', name: 'Sour', cause: 'Under-extracted', why: 'The water did not pull out enough sweetness before the brew ended, so the sharp acids dominate.',
      tries: ['Grind finer so the water slows down.', 'Use hotter water, around 94 to 96 °C.', 'Brew a little longer, or pour more slowly.', 'Check your ratio is not too weak.'] },
    { id: 'bitter', name: 'Bitter', cause: 'Over-extracted', why: 'The water pulled out too much, including the harsh compounds that come late in the brew.',
      tries: ['Grind coarser.', 'Shorten the brew time or stop the shot earlier.', 'Lower the water temperature slightly.', 'Clean your equipment. Old coffee oils taste bitter.'] },
    { id: 'weak', name: 'Weak', cause: 'Too much water', why: 'There is not enough coffee for the amount of water, so the cup tastes thin and watery.',
      tries: ['Weigh your coffee instead of using scoops.', 'Lower the ratio number, for example from 1:16 to 1:14.', 'Grind a notch finer.'] },
    { id: 'harsh', name: 'Dry and harsh', cause: 'Uneven extraction', why: 'A mix of very fine and very coarse particles, or water that ran through the bed unevenly, extracts some of the coffee too much and some too little.',
      tries: ['Use a burr grinder if you can. Blade grinders produce uneven particles.', 'Pour evenly and avoid over-stirring.', 'Use filtered water.', 'Stop the brew a little earlier.'] },
    { id: 'flat', name: 'Flat', cause: 'Stale coffee', why: 'Aroma and flavour fade as beans age and after they are ground.',
      tries: ['Buy fresher beans, ideally within a few weeks of roasting.', 'Grind right before you brew.', 'Store beans airtight, away from light and heat.', 'Rinse paper filters so they do not add a papery taste.'] }
  ];
  const chipsBox = $('#fix-chips'), fix = $('#fix-panel');
  chipsBox.innerHTML = FIXES.map(function (f) {
    return '<button type="button" class="chip" role="radio" aria-checked="false" data-i="' + f.id + '">' + f.name + '</button>';
  }).join('');
  fix.innerHTML = '<p class="muted" style="padding-top:var(--space-4)">Pick how your coffee tastes and the likely cause and fixes will show up here.</p>';

  CBS.roving(chipsBox, '.chip', 'aria-checked', function (el) {
    const f = FIXES.find(function (x) { return x.id === el.dataset.i; });
    fix.classList.remove('is-swapping'); void fix.offsetWidth;
    fix.innerHTML = '<h3>' + f.cause + '</h3><p>' + f.why + '</p><h4>Try this, one change at a time</h4><ul>' +
      f.tries.map(function (t) { return '<li><span>' + t + '</span></li>'; }).join('') + '</ul>';
    fix.classList.add('is-swapping');
  });
  // No selection yet: every chip is reachable by Tab until one is chosen
  chipsBox.querySelectorAll('.chip').forEach(function (c, i) { c.tabIndex = i === 0 ? 0 : -1; });
})();
