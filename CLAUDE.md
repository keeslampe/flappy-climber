# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

```
npm install
npm run dev        # Vite dev server on port 3000
npm run build      # Type-check (tsc -b) + production bundle to dist/
npm run preview    # Serve the production build
```

There is no test or lint script — `npm run build` is the only gate (it type-checks
in strict mode). Verify behaviour by running the app, not by unit tests. The previous
canvas-only single-file build is preserved in `archive/flappy_climber.html`.

## Coding rules

- **No abbreviations** in code or file names. Write the full word every time — `width`
  not `w`, `height` not `h`, `radius` not `r`, `velocity` not `vel`, `background` not
  `bg`, `sequence` not `seq`, `offset` not `off`, `command` not `cmd`, `response` not
  `res`, `characteristic` not `char`. Standard SI units (`kg`) and universal SVG
  attribute names (`cx`, `cy`, `rx`, `ry`) are fine.
- **`src/visual/` vs `src/components/`**: pure SVG art with no game logic (just renders
  markup) lives in `src/visual/` so it is easy to swap out. Anything with hooks,
  computed state, or interactivity lives in `src/components/`.
- **Always ask to commit** after completing all changes in a session.
- Some `src/visual` / `src/components` files are unused scratch/design pieces (e.g.
  `Environment*`, `*Design`, `GroundBase`). **`App.tsx` is the source of truth for what
  is actually rendered** — check its layer stack before assuming a component is live.

## The game

A climbing **trainer**, not a dodge game. The world scrolls left at a fixed rate; the
climber is pinned at `x = 90`. Grip force (Tindeq) or arrow keys move the climber
vertically. A workout program (the DSL) drives a generative rock wall and a stream of
bolt-anchor "clips" at target heights — match your height as a clip passes to clip it
(`score++`, "CLIP!" pop). **There is no fail state**: a miss is just a miss, no penalty.

## Stack

- **Vite + React 18 + TypeScript** (strict). No CSS framework — plain CSS in
  `src/index.css`.
- **All rendering is SVG/DOM**, never canvas. Game state mutates inside a `useRef`
  (`worldRef`) to avoid re-render storms; a `useState` tick counter forces one redraw
  per animation frame.
- **The whole tree re-renders every frame**, so anything heavy and static must be kept
  off the per-frame path or mobile lags. The cautionary example is `ClimbingWall`: its
  rock texture (hundreds of SVG nodes) is built once in a `useMemo` keyed on wall size
  and drawn through a `memo`'d `WallTexturePanel`, so only the two scroll transforms
  change each frame. Don't recompute seeded static art in the render body.
- **Web Bluetooth** to the Tindeq Progressor force sensor lives in
  `src/hooks/useTindeq.ts`; the kg reading drives the climber's vertical position.
- **Persistence** is localStorage only: custom programs + selected id (`usePrograms`),
  and all-time best score / max kg (`App.tsx`, keys `flappy-climber.bestScore` /
  `.maxKilograms`). Built-in programs always come from code, never storage.

## Fixed-timestep loop

`useGameLoop` reports real `deltaSeconds` each animation frame. `App.tsx` accumulates it
and runs `tickWorld` in fixed **1/60 s** steps (clamped against a backlog spiral), then
renders once per frame. This makes motion and the workout timer run at **real time
regardless of display refresh rate** — do not reintroduce per-frame motion that assumes
60 fps at the loop level. Inside `tick.ts` everything is still expressed per step (e.g.
`SCROLL_SPEED` px/step); the fixed timestep is what keeps that real-time.

## The single height scale (important)

Every vertical position goes through one mapping so they line up on screen. **Do not
add a second scale.** `world.ts` owns it:

- `waistYForHeight(value, groundY)` maps a program height `0..HEIGHT_SCALE_MAX` (kg, set
  to 50) to the climber's waist pixel `y`, between `HEIGHT_METER_TOP_OFFSET` (64 — low
  enough that the 50 kg tick clears the HUD pills) and `groundY -
  HEIGHT_METER_BOTTOM_OFFSET` (12). `heightForWaistY` is the inverse.
- Used by: the climber's force-driven position and the weight HUD (`tick.ts`), the left
  ruler (`HeightMeter.tsx`), the bolt anchors (`anchors.ts`), the wall crest
  (`mountainProfile.ts`), and the green hill crest (`ValleyFloor.tsx`, pinned to 20 kg).
  The waist anchor is `climber.y + 8`.

`HeightMeter` lives in its own overlay SVG and is a thin left ruler; it starts just
above the top (50 kg) tick — which `HEIGHT_METER_TOP_OFFSET` keeps below the HUD pills —
and runs to the ground. Labels sit just under their tick marks.

Coordinates: the SVG renders into a logical `WORLD_WIDTH (270, = 3 clip spacings) ×
logicalHeight` space (`logicalHeight` from viewport aspect), stretched with
`preserveAspectRatio="none"`. `groundY = logicalHeight - GROUND_OFFSET_FROM_BOTTOM (26)`.
The ground band is split (`GroundBase`) into a fixed-height grass cap at the top — so
the climber's feet land on green no matter how thin the band — and a squashed dirt strip
below; do not collapse it back into one stretched tile.

## Workout DSL & the program clock

`sequence.ts` parses (case-insensitive):

```
X seconds rest
Y seconds on Z height
repeat this V times
```

`App.tsx` `startGame` expands the repeats into one flat program and **prepends a single
5 s rest** (so the intro rest runs once, `sequenceRepeatMax = 1`). Empty textarea → no
program; anchors then spawn on a fixed interval with a seeded rolling crest.

The program advances on the **continuous scroll position**, not wall-clock seconds:
`sequenceEventStartScroll` marks the scroll offset where the current event began, and an
event spans `duration * 60 * SCROLL_SPEED` pixels. This is what keeps the wall crest
gliding smoothly instead of snapping once per second. `world.seconds` is wall-clock and
only feeds the TIME HUD.

## Mountain / wall profile (`mountainProfile.ts`)

The generative wall and the anchors are both derived from the program here:

- `targetHeightAtDistance` — sharp program target at a look-ahead distance; used by
  `spawnAnchor`.
- `sharpTargetAtDistance` — sharp target across past/future with repeat-wrap and
  start/end bounds; used by the debug route line.
- `crestBaseMeters` — a **smooth envelope**: full pull height across each "on" plateau
  (extended one clip-spacing past the pull so the end-of-pull clip keeps rock behind
  it), smoothstepping down into the rest valley.
- `sampleWallCrest` — builds the crest polygon. The crest sits a fixed pixel headroom +
  rolling value-noise peaks above the clip line, and **fades fully to the ground line as
  the target drops to 0** (rest = bare ground, no mountain), blended via `presence`.

Anchors (`anchors.ts`): spawn every `ANCHOR_SPAWN_INTERVAL` steps (1 s →
`ANCHOR_SPACING_PIXELS` apart) at the sharp target height; the first rest clip right
after a pull is lifted to the pull height. States are `locked | next | hit`; only
`next` shows a pulsing ring (no badges) and the lower carabiner gate is tinted by state.

## State machine

`world.status` is `'idle'` or `'playing'`; `tickWorld` is a no-op unless `'playing'`.
The game never truly "ends" — Escape, the ☰ button, or the program finishing calls
`returnToMenu()`. A clip increments `score` and pushes a "CLIP!" score pop; there is no
collision, score reset, hurt frame, or invincibility (all removed).

Touch UX guards (don't remove without understanding them): a tap that quits to the menu
can bleed through onto the button now under the finger, so the menu is briefly
**`menuLocked`** (pointer-events disabled on its buttons for ~600 ms) and `startGame`
ignores a SEND IT within 500 ms of the menu appearing. Fullscreen on SEND IT is gated to
**real mobile via a user-agent test** (`/Android|iPhone|iPad|iPod|Mobile/`), not
touch/pointer checks — those also fire in Chrome DevTools responsive mode.

## Procedural art

`randomNumberGenerator.ts` is a Mulberry32 seeded PRNG used everywhere art is
procedural (wall texture, mountains, value-noise crest peaks) so output is deterministic
and scrolls with the terrain rather than swimming.

## Debugging

In dev (`import.meta.env.DEV`) the live world is exposed as `window.__world` to inspect
or mutate from the console. The on-screen `DebugPanel` (on by default) shows the Tindeq
readout and a **TARGET LINE** toggle for the `ProgramTargetLine` — a debug route showing
the exact program target height over past → present → future with a `target X, Ys`
countdown.
