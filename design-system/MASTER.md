# Coffee by Shameem — Design System (source of truth)

Generated with the **ui-ux-pro-max** skill (`--design-system`, variance 6 / motion 5 / density 4), then adapted by hand.
The skill's top style match ("Vibrant & Block-based") did not suit a coffee brand, so it was **not** used. Kept from the skill: the warm
coffee palette (#92400E primary, #B45309 secondary) and the Serif + Sans pairing direction, plus its pre-delivery checklist.

## Direction
Espresso editorial. Dark espresso "cinematic" sections alternate with cream paper sections. Type carries the identity; there is no stock photography.

## Colour (css/tokens.css)
| Token | Value | Use |
|---|---|---|
| espresso-950/900/800 | #150d09 / #1f130e / #2e1c14 | Dark backgrounds, body text on paper |
| crema-100 / 200 / 50 | #f4ead9 / #e8d7bb / #fbf6ec | Paper, alt paper, surfaces |
| caramel-600 / 500 | #92400e / #b45309 | Accent on paper (6.4:1 on crema-100) |
| ember-400 | #e0a15c | Accent on espresso |
| text-muted | #6b5446 (paper) / #c4ad92 (dark) | 5.8:1 / 8.9:1 |

## Type
Fraunces (display, opsz/SOFT/WONK axes) · Inter (body/UI) · JetBrains Mono (labels, numbers). Self-hosted in `assets/fonts` (latin subset).
Fluid scale `--step--2 … --step-5`.

## Space, shape, motion
4px base scale. Radii: 6 / 14 / 28 / pill (pills only for buttons and chips). Easing `cubic-bezier(.22,1,.36,1)`; 160 / 280 / 720 ms.
One signature effect: cursor-lit hero over a top-down latte-art cup. Everything else is restrained; `prefers-reduced-motion` disables animation.

## Components
Header + mobile overlay nav · button (solid/ghost/sm) · chip & radiogroup · input / unit input / range · accordion · dialog · toast · index row ·
recipe item · ratio bar · timer face · stage list · grind swatch.

## Anti-patterns avoided
No emoji icons, no hover-only actions, no purple gradients, no card-grid on every section, no fabricated stats or testimonials.
