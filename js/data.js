/* ==========================================================================
   Recipe data + line-art glyphs. Classic script (no modules) so the site also
   works when index.html is opened straight from disk.
   Amounts: q = scalable quantity per `base` servings, u = unit. q:null = not scalable.
   ========================================================================== */
(function () {
  'use strict';
  const CBS = (window.CBS = window.CBS || {});

  const attrs = 'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  CBS.glyph = function (name) {
    const g = {
      cup: '<path d="M14 26h30v12a14 14 0 0 1-14 14h-2a14 14 0 0 1-14-14V26z"/><path d="M44 30h3.5a5.5 5.5 0 0 1 0 11H43"/><path d="M10 58h40"/><path d="M24 11c-2.5 3.2 2.5 5.4 0 9M32 9c-2.5 3.2 2.5 5.4 0 10"/>',
      glass: '<path d="M17 14h30l-4 40a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4L17 14z"/><path d="M18.5 26h27"/><path d="M26 33l6-2.4 4.6 4.6-6 2.4z"/><path d="M33 40.5l5-1.6 2.4 4.6-5.4 1.6z"/><path d="M40 4l-4.5 24"/>',
      dripper: '<path d="M9 12h46L41 34H23L9 12z"/><path d="M26 34v6h12v-6"/><path d="M16 46h32v8a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4v-8z"/><path d="M32 42v.5"/>',
      press: '<path d="M17 24h30v30a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V24z"/><path d="M32 5v24"/><path d="M25 5h14"/><path d="M17 24h30"/><path d="M47 31h4.5a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5H47"/>',
      jar: '<path d="M20 9h24v7H20z"/><path d="M17 16h30v38a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4V16z"/><path d="M17 30h30"/><path d="M23 42c5 3.5 13 3.5 18 0"/>',
      bowl: '<path d="M8 34h48a24 24 0 0 1-48 0z"/><path d="M20 34a12 12 0 0 1 24 0"/><path d="M22 58h20"/><path d="M32 8v8"/><path d="M27 12l5 5 5-5"/>',
      tumbler: '<path d="M8 30h28l-2.4 22a4 4 0 0 1-4 4H14.4a4 4 0 0 1-4-4L8 30z"/><path d="M44 12h12l-2.2 28a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2L44 12z"/><path d="M6 30h32"/><path d="M50 4c-1.6 2.4 1.6 3.6 0 6"/>'
    };
    return '<svg ' + attrs + '>' + (g[name] || g.cup) + '</svg>';
  };

  CBS.icons = {
    arrow: '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>',
    dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>'
  };

  CBS.categories = ['Espresso', 'Milk', 'Filter', 'Cold'];

  CBS.recipes = [
    {
      id: 'espresso', name: 'Espresso', category: 'Espresso', glyph: 'cup',
      blurb: 'A concentrated shot with a hazel crema. Everything else on the menu starts here.',
      time: '5 min', level: 'Technical', ratio: '1:2', base: 1, yieldLabel: 'shot',
      ingredients: [
        { q: 18, u: 'g', n: 'finely ground coffee' },
        { q: 36, u: 'g', n: 'espresso in the cup (1:2 yield)' },
        { q: null, n: 'filtered water, machine at roughly 93 °C' }
      ],
      steps: [
        'Run a blank shot to warm the group head, then warm your cup.',
        'Dose 18 g into the portafilter, level it, and tamp evenly.',
        'Start the shot with the cup on a scale. Stop when the cup holds 36 g, about 25 to 30 seconds.',
        'Under 20 seconds means grind finer; over 35 means grind coarser.',
        'Serve right away while the crema is still intact.'
      ],
      tip: 'Change one variable at a time. Grind size first, dose second.'
    },
    {
      id: 'cappuccino', name: 'Cappuccino', category: 'Milk', glyph: 'cup',
      blurb: 'Equal thirds: espresso, steamed milk, and a dense cap of foam.',
      time: '8 min', level: 'Intermediate', ratio: '1:1:1', base: 1, yieldLabel: 'cup',
      ingredients: [
        { q: 30, u: 'ml', n: 'espresso (one single shot)' },
        { q: 100, u: 'ml', n: 'cold milk, whole or barista oat' }
      ],
      steps: [
        'Pull a single shot into a pre-warmed 150 to 180 ml cup.',
        'Steam the cold milk. Let in air for the first 3 to 4 seconds so it grows by about a third, then sink the wand to swirl.',
        'Stop at 60 to 65 °C, when the jug is hot but still comfortable to hold.',
        'Tap the jug, swirl, and pour. Spoon the remaining foam over the top.',
        'Optional: a light dusting of cocoa.'
      ],
      tip: 'Fresh, cold milk foams best. Rinse the wand right after steaming.'
    },
    {
      id: 'flat-white', name: 'Flat White', category: 'Milk', glyph: 'cup',
      blurb: 'Less foam than a cappuccino, more coffee. Silky microfoam poured thin.',
      time: '8 min', level: 'Intermediate', ratio: '1:3', base: 1, yieldLabel: 'cup',
      ingredients: [
        { q: 36, u: 'g', n: 'double espresso' },
        { q: 120, u: 'ml', n: 'cold whole milk' }
      ],
      steps: [
        'Pull a double shot into a 160 to 190 ml cup.',
        'Steam the milk with a short burst of air, about 2 seconds, then spin it smooth to 60 to 65 °C.',
        'Swirl the jug until the surface looks like wet paint.',
        'Pour from a low height, close to the surface, so the milk and crema blend into a thin layer.'
      ],
      tip: 'If you see big bubbles, you let in too much air. Pour it out and start again.'
    },
    {
      id: 'iced-latte', name: 'Iced Latte', category: 'Cold', glyph: 'glass',
      blurb: 'Cold milk, hot espresso, lots of ice. Ready in five minutes.',
      time: '5 min', level: 'Easy', ratio: '1:3.5', base: 1, yieldLabel: 'glass',
      ingredients: [
        { q: 60, u: 'ml', n: 'espresso (two shots, about 36 g)' },
        { q: 200, u: 'ml', n: 'cold milk, dairy or plant-based' },
        { q: 150, u: 'g', n: 'ice cubes' },
        { q: 15, u: 'ml', n: 'simple syrup (optional)' }
      ],
      steps: [
        'Brew the espresso and let it sit for a minute or two so it stops steaming.',
        'Fill a tall glass with ice, then add the milk and syrup if using.',
        'Pour the espresso slowly over the top so it streaks through the milk.',
        'Stir and drink straight away.'
      ],
      tip: 'Freeze leftover coffee in a tray and use the cubes so the drink never waters down.'
    },
    {
      id: 'affogato', name: 'Affogato', category: 'Espresso', glyph: 'bowl',
      blurb: 'Dessert and coffee in one bowl. The hot shot melts the ice cream as you eat.',
      time: '5 min', level: 'Easy', ratio: '1 shot : 1 scoop', base: 1, yieldLabel: 'bowl',
      ingredients: [
        { q: 80, u: 'g', n: 'vanilla ice cream (one large scoop)' },
        { q: 30, u: 'ml', n: 'hot espresso (one single shot)' },
        { q: null, n: 'dark chocolate, shaved (optional)' }
      ],
      steps: [
        'Chill a small bowl or glass in the freezer for 10 minutes.',
        'Add the scoop of ice cream.',
        'Pull the espresso and pour it over right at the table.',
        'Top with chocolate if you like and eat before it melts completely.'
      ],
      tip: 'Use a bold, low-acidity espresso. Sharp, sour shots clash with the cream.'
    },
    {
      id: 'v60', name: 'V60 Pour-over', category: 'Filter', glyph: 'dripper',
      blurb: 'A clean, bright cup with a pulse pour. Pair it with the timer in the Brew Lab.',
      time: '4 min', level: 'Intermediate', ratio: '1:16', base: 1, yieldLabel: 'large cup',
      ingredients: [
        { q: 20, u: 'g', n: 'medium-fine ground coffee' },
        { q: 320, u: 'g', n: 'water at 94 °C' },
        { q: null, n: 'paper filter, rinsed' }
      ],
      steps: [
        'Rinse the filter with hot water, discard the water, and add the coffee. Level the bed.',
        'Bloom: pour 60 g of water (three times the coffee) and wait 30 to 45 seconds.',
        'At 0:45, pour in slow circles up to 60% of the total, 192 g.',
        'At 1:30, pour up to 320 g and stop.',
        'Let it draw down. Aim to finish between 2:45 and 3:15.'
      ],
      tip: 'Draining too fast? Grind finer. Choking and bitter? Grind coarser.'
    },
    {
      id: 'french-press', name: 'French Press', category: 'Filter', glyph: 'press',
      blurb: 'Full-bodied and forgiving. Immersion brewing with almost no technique.',
      time: '6 min', level: 'Easy', ratio: '1:15', base: 2, yieldLabel: 'cups',
      ingredients: [
        { q: 30, u: 'g', n: 'coarse ground coffee' },
        { q: 450, u: 'g', n: 'water at 94 °C' }
      ],
      steps: [
        'Add the coffee to the press and pour in all the water in one go.',
        'Stir gently, put the lid on with the plunger up, and set a timer for 4 minutes.',
        'Stir the crust once, skim off the foam if you like a cleaner cup, then press slowly.',
        'Pour everything out right away. Coffee left on the grounds keeps extracting and turns bitter.'
      ],
      tip: 'A coarse, even grind keeps the plunger easy to press and the cup free of silt.'
    },
    {
      id: 'cold-brew', name: 'Cold Brew', category: 'Cold', glyph: 'jar',
      blurb: 'A slow, low-acid concentrate you make once and drink all week.',
      time: '12 to 18 h', level: 'Easy', ratio: '1:8', base: 4, yieldLabel: 'glasses',
      ingredients: [
        { q: 100, u: 'g', n: 'coarse ground coffee' },
        { q: 800, u: 'g', n: 'cold filtered water' },
        { q: null, n: 'water or milk and ice, to serve' }
      ],
      steps: [
        'Combine the coffee and water in a jar and stir until every grain is wet.',
        'Cover and steep in the fridge for 12 to 18 hours.',
        'Strain through a paper filter or fine mesh, then filter again if it is cloudy.',
        'Serve over ice, diluted about 1:1 with water or milk.',
        'Keep the concentrate in a sealed jar in the fridge for up to a week.'
      ],
      tip: 'Taste at 12 hours. Past 18 it starts to taste woody.'
    },
    {
      id: 'filter-kaapi', name: 'Filter Kaapi', category: 'Milk', glyph: 'tumbler',
      blurb: 'South Indian filter coffee: a strong, slow-dripped decoction over hot, sweet milk.',
      time: '30 min', level: 'Easy', ratio: '1 : 2.5', base: 2, yieldLabel: 'tumblers',
      ingredients: [
        { q: 20, u: 'g', n: 'filter coffee powder (about 3 tbsp)' },
        { q: 150, u: 'ml', n: 'boiling water' },
        { q: 300, u: 'ml', n: 'hot full-fat milk' },
        { q: null, n: 'sugar, to taste' }
      ],
      steps: [
        'Warm the upper chamber of a South Indian filter. Add the coffee powder and gently press it down with the perforated disc.',
        'Pour in the boiling water and cover. Let it drip for 15 to 20 minutes into the lower chamber.',
        'Heat the milk until it is steaming. Add sugar to taste.',
        'Pour about 60 ml of decoction into each tumbler and top with roughly 150 ml of hot milk.',
        'Pull between tumbler and davara a few times to cool and froth it.'
      ],
      tip: 'Do not stir the grounds while it drips. A slow drip makes a thicker decoction.'
    }
  ];

  CBS.byId = function (id) { return CBS.recipes.find(function (r) { return r.id === id; }); };

  CBS.fmt = function (n) {
    const r = Math.round(n * 10) / 10;
    return (r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  /* Ingredients + steps + tip as HTML, scaled to `servings` */
  CBS.recipeBody = function (r, servings) {
    const f = servings / r.base;
    const ing = r.ingredients.map(function (i, idx) {
      const amt = i.q == null ? '<span class="amt amt--free">as needed</span>'
        : '<span class="amt">' + CBS.fmt(i.q * f) + '<small>' + i.u + '</small></span>';
      return '<li><label class="ing"><input type="checkbox" data-ing="' + idx + '"><span class="ing-box" aria-hidden="true"></span>' +
        amt + '<span class="ing-name">' + i.n + '</span></label></li>';
    }).join('');
    const steps = r.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('');
    return { ingredients: ing, steps: steps };
  };
})();
