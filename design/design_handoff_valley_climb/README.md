# Handoff: Climber — Mountain Climb Scene ("Valley Climb")

## Overview
A portrait (mobile) climbing-game scene: a stylized climber clings to the **left**
of a mountain face while a belay rope runs in from the **left edge** of the screen
to the climber's waist. Three bolt anchors lead up-and-right along the planned
route. Behind the face, layered distant mountain ranges, a large low sun, and
drifting clouds sit in a bright "bluebird" sky; an optional green valley floor
shows far below. The look is **"Rad Kid"**: chunky black ink outlines on flat,
saturated color (a hand-drawn cartoon/sticker aesthetic).

This bundle is the **"Valley Climb"** design — the Valley Floor mountain with a big
low summit sun — and it exposes live controls for the **height of the mountains,
sun, clouds, and ground**.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** —
runnable prototypes that show the intended look and behavior. They are **not**
production game code. Your task is to **recreate this scene in the game's target
environment** using its established patterns. If no codebase exists yet, pick the
most appropriate stack for a 2D game (e.g. a React + Canvas/SVG app, or a game
engine like Phaser/PixiJS) and implement the design there.

The prototype draws everything with **DOM + inline SVG** because that was the
fastest way to mock it. In a real game you will likely re-author these as sprites,
Canvas/WebGL draws, or engine scene nodes — but the **layout math, layer order,
palette, and silhouette data here are exact and should be carried over**.

## Fidelity
**High-fidelity.** Colors, layout proportions, layer ordering, stroke weights, and
the climber/rope/anchor staging are all final. Recreate them precisely. The only
intentionally-procedural part is the distant range silhouette (generated from a
seeded PRNG — see below); you may keep the procedural approach or bake a chosen
silhouette to art.

---

## Scene anatomy

The scene is a single portrait frame. In the prototype it is rendered at
**380 × 760 px** inside a rounded "phone" frame, but everything inside is
positioned in **percentages of the frame**, so it scales to any portrait size.

### Layer order (back → front)
All layers are absolutely positioned and stacked in this exact order:

1. **Sky** — vertical linear gradient, top→bottom.
2. **Sun** — a soft radial-gradient halo, plus an opaque disc at ~30% of the halo
   width. Positionable and resizable.
3. **Far peaks** — palest distant range (SVG filled polygon) + snow polyline on top.
4. **Mid peaks** — deeper distant range + snow polyline.
5. **Horizon haze** — a horizontal translucent band (~30%–64% of height) that
   fades the distant ranges into the air so they read as atmospheric/far.
6. **Clouds** — chunky ink-outlined puffs drifting in the sky (behind the face).
7. **Foreground face** — the rock texture the climber is on, **clipped to a
   mountain-silhouette polygon** (`ridge` points). Includes:
   - an aerial-perspective color tint (`soft-light` blend) so the face reads lit
     by the sky,
   - an optional snow dusting gradient on the upper face.
8. **Ground level** *(optional)* — a wobbly-topped valley floor far below, with a
   haze band fading the foot of the wall into it and an ink rim line on its edge.
9. **Ridge ink line** — a thick black stroke tracing the foreground silhouette
   (with an optional white snow cap behind it and a faint sunlit rim just under it).
10. **Ropes & route (SVG)**:
    - **Planned route** — dotted line through the three anchors.
    - **Lead rope** — waist → first (clipped) anchor: black casing + red core.
    - **Belay rope (hero)** — from the **left screen edge → waist**, drawn thickest
      (black casing + red core + dashed cream highlight), with a slight catenary sag.
11. **Anchors** — three bolt/quickdraw anchors along the route (see states below).
12. **Climber** — the "Rad Kid" character, pinned LEFT.
13. **HUD** — two pill "chips": top-left shows route progress (`CLIPPED 1/3`),
    top-right shows altitude (e.g. `2,050 m`) with a teal status dot.

### Fixed staging coordinates (percent of frame)
These are the exact positions used; keep them so the composition reads correctly:

- **Climber**: `x: 22%, y: 63%` (width ≈ 22% of frame)
- **Climber waist** (rope attach point): `x: 25.5%, y: 65.5%`
- **Belay rope entry** (left edge): `x: 0%, y: 73%`
- **Anchors** (each ~17% wide, centered on point):
  - Anchor 1 — `x: 31%, y: 53%` — state `hit` (clipped), design `quickdraw`
  - Anchor 2 — `x: 44%, y: 44%` — state `next` (pulses), design `quickdraw`
  - Anchor 3 — `x: 58%, y: 34%` — state `locked`, design `chain`

### Rope geometry
The ropes are quadratic Béziers in a coordinate space where x is 0–100 and y is
scaled to a 0–178 viewBox (i.e. `y_vb = yPercent / 100 * 178`):
- **Belay**: `M ropeIn → Q midpoint(sag +10) → waist`. Sag pushes the control
  point's y down by 10 vb-units below the lower endpoint.
- **Lead**: `M waist → Q (midpoint.x − 4, midpoint.y + 6) → anchor1`.
- **Route**: a polyline straight through anchor1 → anchor2 → anchor3.

Rope stroke weights (in the 100-wide viewBox, non-scaling-stroke):
- Belay: casing **7.5**, red core **4.6**, cream dashed highlight **1.2** (`5 7` dash).
- Lead: casing **4.4**, red core **2.6**.
- Route: **3**, dotted (`0.5 6` dash), 75% opacity.

---

## Components (prototype API → what to rebuild)

Each of these is a self-contained piece you'll find in the bundled `.jsx` files.
Recreate the **visual**, not necessarily the React signature.

### `RadKidIdle()` — the climber  (`climbers/radkid/01-idle.jsx`)
Cartoon climber hanging from holds, both arms up, weight settled, calm smirk.
Drawn in a `128 × 128` viewBox SVG, chunky black outlines on flat fills. This is
**frame 01 (IDLE)** of a character that is meant to be animated across frames —
expect to need climb/reach/fall frames in the real game.

### `Sky({ variant })` & `Cloud({ variant })`  (`assets/env-sky.jsx`)
- `Sky` variants: `'day' | 'dusk' | 'night'` (Valley Climb uses a custom bluebird
  gradient rather than the preset — see config below).
- `Cloud` variants: `'a' | 'b' | 'c'` — three chunky ink-outlined cloud shapes.

### `RockWall({ w, h, variant, seed, ledges })`  (`assets/env-wall.jsx`)
Natural rock cliff face that fills any `w × h` and tiles horizontally. Seeded
procedural strata/cracks.
- `variant`: `'granite' | 'redrock' | 'basalt'` (Valley Climb uses **`granite`**).
- `seed`: integer → deterministic texture (Valley Climb uses **5**).
- `ledges`: boolean — Valley Climb passes **`false`** (no protruding shelves; it's
  used purely as a clipped texture here).
- In the scene it's drawn at `w: 420, h: 760` then clipped to the ridge polygon.

### `BoltAnchor({ state, design, size, slingColor, pulse })`  (`assets/env-wall.jsx`)
A sport-climbing bolt anchor.
- `state`: `'hit' | 'next' | 'locked'`
  - `hit` = already clipped, `next` = the upcoming target (**pulses** via the
    `.anchor-pulse` CSS keyframes), `locked` = not yet reached.
- `design`: `'quickdraw' | 'chain'` (anchors 1–2 quickdraw, anchor 3 chain).
- `size`: px (scene uses **92**), `slingColor`: hex (Valley Climb pink `#FF3D8A`),
  `pulse`: boolean.

---

## The "Valley Climb" configuration (exact)

The scene takes one `cfg` object. This is the Valley Climb config, with the four
height-related values driven by the live tweaks (defaults shown):

```js
{
  name: 'Valley Climb',
  seed: 13,            // drives distant-range silhouette PRNG
  rock: 'granite',
  rockSeed: 5,

  // sky gradient stops, top → bottom (bluebird day)
  sky: ['#5BB8EE', '#8FD2F2', '#CDEBF8'],

  // distant ranges
  farFill: '#AFC8DC',  // far peaks fill (palest)
  midFill: '#88A8C6',  // mid peaks fill (deeper)
  haze:    '#DCEBF6',  // horizon haze color
  farN: 9, midN: 7,    // number of peaks across the width
  // heights are derived from the "Peak height" tweak h (0–100):
  farBase: 60 - h*0.06,  farAmp: 8 + h*0.30,
  midBase: 54 - h*0.05,  midAmp: 6 + h*0.22,

  snow: true,          // white snow polylines on the distant ridgelines
  faceSnow: false,     // no snow dusting on the foreground face

  // foreground face tint + finish
  faceTint: 'rgba(180,220,255,0.42)',  // soft-light blend over the rock
  rim: '#FFFFFF',                       // sunlit rim under the ridge line

  // big low summit sun (positionable/resizable via tweaks)
  sun: { x: 76, y: 22, color: '#FFF3C8', opacity: 1,
         size: 64,        // halo width as % of frame
         disc: 64 * 0.3 },// opaque disc = 30% of halo

  // two clouds spread around an adjustable centre height (cloudHeight)
  clouds: [
    { x: 70, y: cloudHeight - 4, w: 26, v: 'b', o: 0.9 },
    { x: 30, y: cloudHeight + 4, w: 20, v: 'c', o: 0.8 },
  ],

  // valley floor (optional; height = 100 - groundRise)
  ground: { y: 100 - groundRise, color: '#3E6B43', top: '#5E8C4E',
            haze: '#CFE3D6', rim: '#1A1A1A' },

  // route accent + sling + HUD
  sling: '#FF3D8A',    // anchor sling color (pink)
  route: '#FFD23F',    // planned-route + "CLIPPED" accent (gold)
  alt: '2,050 m',      // HUD altitude label
  ridge: [[0,52],[10,44],[20,48],[30,38],[40,40],[50,30],
          [58,26],[66,21],[74,30],[84,50],[92,68],[100,84]],
}
```

### Distant-range generation
`buildRange(seed, baseY, amp, n)` walks left→right producing, per step `i` of `n`:
a **peak** at `y = baseY − amp·(0.55–1.0)` and a **saddle** at
`y = baseY − amp·(0.05–0.27)`, jittered by a seeded LCG PRNG
(`s = s*1664525 + 1013904223 mod 2^32`). It returns a closed fill polygon and the
top point list (used to stroke the snow line). Raising **`amp`** makes peaks taller;
raising **`baseY`** lowers the whole range. The "Peak height" tweak maps a single
0–100 value onto both ranges' base+amp (see formulas above).

---

## Tweakable parameters (live controls)
The prototype exposes a Tweaks panel. These are the adjustable values, their
ranges, and defaults — replicate as game settings / level-design knobs:

| Control            | Key           | Range     | Default | Effect |
|--------------------|---------------|-----------|---------|--------|
| Peak height        | `mtnHeight`   | 0–100 %   | 35      | Height of both background ranges (base + amplitude). |
| Sun · Horizontal   | `sunX`        | 0–100 %   | 76      | Sun x position. |
| Sun · Height       | `sunY`        | 2–70 %    | 22      | Sun y position (lower % = higher in sky). |
| Sun · Size         | `sunSize`     | 16–100 %  | 64      | Halo width; disc = 30% of it. |
| Clouds · Show       | `cloudsOn`   | bool      | true    | Toggle clouds. |
| Cloud height       | `cloudHeight` | 4–48 %    | 16      | Centre y of the cloud cluster. |
| Ground · Show       | `groundOn`   | bool      | true    | Toggle valley floor. |
| Ground height      | `groundRise`  | 2–42 %    | 14      | How far the floor rises from the bottom (`y = 100 − groundRise`). |

Tweak values persist to `localStorage` in the prototype.

---

## Design tokens

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| Ink (outline) | `#1A1A1A` | All character/anchor/ridge/rope outlines |
| Cream | `#FFF6E5` | Rope highlight dashes, HUD chip text |
| Sky top | `#5BB8EE` | Bluebird sky gradient stop 1 |
| Sky mid | `#8FD2F2` | Sky gradient stop 2 (at 52%) |
| Sky bottom | `#CDEBF8` | Sky gradient stop 3 |
| Far peaks | `#AFC8DC` | Palest distant range |
| Mid peaks | `#88A8C6` | Deeper distant range |
| Horizon haze | `#DCEBF6` | Atmospheric band |
| Far snow line | `#F2F6FB` | Snow polyline on far range |
| Mid snow line | `#E7EEF6` | Snow polyline on mid range |
| Face tint | `rgba(180,220,255,0.42)` | Soft-light over rock |
| Sun | `#FFF3C8` | Halo + disc |
| Ground base | `#3E6B43` | Valley floor body |
| Ground top | `#5E8C4E` | Valley floor lit top |
| Ground haze | `#CFE3D6` | Foot-of-wall haze into valley |
| Sling | `#FF3D8A` | Anchor slings (pink) |
| Route / accent | `#FFD23F` | Route dots, "CLIPPED" label (gold) |
| Rope core | `#E63946` | Red rope core |
| HUD status dot | `#1FD5C8` | Teal "live" dot |
| Rock variant | `granite` | RockWall texture (seed 5) |

### Typography
- **Space Grotesk** (700 / 500) — HUD chips: `11px`, weight 700, `letter-spacing
  0.04em`, uppercase.
- **JetBrains Mono** (600) — loaded for numeric/mono labels.
- Both pulled from Google Fonts in the prototype.

### Stroke weights (100-wide SVG viewBox, non-scaling)
Ridge ink `3.2` (snow cap `6`, sunlit rim `1.6`); far snow `2.4`; mid snow `2`;
ground rim `2.6`. Rope weights listed under "Rope geometry" above.

### Motion
- `anchorPulse` keyframes: `opacity 0.85→0.3→0.85` and `scale 1→1.18→1` over
  **1.6s ease-in-out infinite** on the `next` anchor. Respects
  `prefers-reduced-motion`.

---

## Assets
All art is **code-drawn** (inline SVG / CSS gradients) — there are **no raster image
files** to ship. The reusable pieces live in:
- `climbers/radkid/01-idle.jsx` — the climber (IDLE frame).
- `assets/env-sky.jsx` — `Sky` + `Cloud`.
- `assets/env-wall.jsx` — `RockWall` + `BoltAnchor`.

For a real game you'll want the rest of the climber animation frames (reach,
pull-up, clip, fall) and likely baked sprite versions of the rock/anchors. The
"Rad Kid" style guide = thick `#1A1A1A` outlines, flat saturated fills, minimal
gradients, rounded chunky forms.

---

## Screenshots
Visual reference renders are in `screenshots/`:
- `01-default.png` — the default Valley Climb state (peak height 35, big low sun,
  clouds at 16%, green valley floor at the bottom).
- `02-tall-peaks.png` — "Peak height" maxed (100): tall snow-capped background
  ranges, clouds raised, ground hidden.
- `03-low-peaks-valley.png` — low background peaks, an enlarged low sun, clouds off,
  and the valley floor raised high. Shows the extreme end of the ground/sun controls.

These illustrate the range of the four height controls; the live prototype is the
source of truth for exact rendering.

## Files in this bundle
| File | What it is |
|------|------------|
| `Valley Climb.html` | The runnable prototype. Open in a browser. Composes the scene from the files below and wires the Tweaks panel + `buildCfg(t)`. |
| `mountain-climb-scene.jsx` | **The scene** — `MountainClimbScene({ cfg })`. All layout math, layer order, rope/anchor staging, range generation. The most important file. |
| `assets/env-sky.jsx` | `Sky` + `Cloud` components. |
| `assets/env-wall.jsx` | `RockWall` + `BoltAnchor` components. |
| `climbers/radkid/01-idle.jsx` | `RadKidIdle` climber (IDLE frame). |
| `tweaks-panel.jsx` | The prototype's settings-panel harness (host UI only — **not** game code; reimplement settings natively). |

### Running the prototype locally
The `.jsx` files are loaded via Babel-in-the-browser, so you must serve over HTTP
(not `file://`). From the bundle root:
```
npx serve .        # or: python3 -m http.server
```
then open `Valley Climb.html`. Toggle the Tweaks panel to explore the height
controls.

## Suggested build approach
1. Recreate the **layer stack** (back→front list above) as your render order.
2. Port the **percent-based staging coordinates** and **rope Bézier math** verbatim —
   they're the soul of the composition.
3. Treat the four tweak values as runtime parameters / level config.
4. Replace DOM/SVG draws with your engine's sprites or Canvas calls; keep the palette
   and stroke-weight ratios.
5. Build out the remaining climber animation frames to make it an actual game.
```
```
