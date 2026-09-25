# Cozy bakery showroom draft

This redesign keeps the existing UbeSmores logo, five flavors, ₱89 pricing, Formspree order endpoint, and Supabase review integration. The new design uses cream walls, arched displays, wood counters, serif headings, and restrained ube accents throughout the page.

## Preview

Open `design-preview.html` from the same web origin as `index.html`. The preview has desktop, tablet, phone, and small-phone width controls. Its frame intercepts order and review submissions, so trying those forms does not send anything. Ubie continues to work locally. The customer site remains `index.html` and retains normal submission behavior.

## Files

- `bakery.css`: complete responsive theme, light/dark colors, focus indicators, and reduced-motion styles.
- `showroom.js`: on-demand Three.js 0.180.0 import, five procedural cookie models, mouse/touch/keyboard rotation, zoom, flavor selection, and opt-in auto rotation. Rendering pauses offscreen and in background tabs. Product photos remain available if WebGL or the module load fails.
- `images/bakery/`: five optimized WebP images made from the supplied references. Original image files remain unchanged.
- `script.js`: existing ordering/reviews behavior, plus a live receipt and improved navigation/chat accessibility.

The 3D cookies are illustrations of the flavors, not scans or exact product replicas. No additional 3D model files are needed.

## Validation

- JavaScript syntax and whitespace checks pass.
- Browser checks at desktop, tablet, 390px phone, and 320px small-phone frame widths show no horizontal page overflow.
- Flavor selection adds the chosen cookie to a solo order.
- Mixed boxes cap quantities at 6 or 8 and total ₱534 or ₱712. Incomplete boxes show the remaining quantity.
- Delivery makes the address visible and required; Pickup hides it. Preferred date starts tomorrow.
- Mobile navigation opens/closes correctly. Dark mode, chat opening, and Escape-to-close work.
- The live review panel loads its empty state without displaying a misleading zero-star score.
- All five Three.js cookie geometries are checked for finite vertices and instance transforms.

**Remaining limitation:** the available test browser disables WebGL. The photo fallback was verified, but the 3D scene needs a visual check in a browser with WebGL enabled before this draft is published to the customer site. No real orders or reviews were submitted during testing.
