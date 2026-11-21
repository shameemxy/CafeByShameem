# Coffee by Shameem

A multi-page static site (plain HTML, CSS and vanilla JS — no build step, no dependencies).

## Pages
| File | What it is |
|---|---|
| `index.html` | Cinematic home: method index, random recipe picker, live ratio dial, margin notes |
| `recipes.html` | 9 recipes with category filter, search, scalable servings, checkable ingredients, copy-to-clipboard, deep links (`#v60`, `#random`) |
| `brew-lab.html` | Ratio calculator, guided brew timer (V60 / French press / espresso, optional chime and screen wake lock), grind guide |
| `notes.html` | Roast spectrum, "Fix my cup" troubleshooter, quick-answer accordion |
| `404.html` | Not-found page (uses root-relative paths: serve the site from the domain root) |

## Run it
Open `index.html` directly, or serve the folder: `python3 -m http.server 8000`.

## Structure
```
css/   fonts.css · tokens.css · base.css · components.css · pages.css
js/    data.js (recipes + icons) · main.js (shared) · home.js · recipes.js · brew-lab.js · notes.js
assets/ favicon.svg · og-image.svg/.png · fonts/ (self-hosted, OFL)
design-system/MASTER.md   design decisions
```

