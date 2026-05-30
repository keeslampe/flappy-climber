# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

```
npm install
npm run dev        # Vite dev server on port 3000
npm run build      # Type-check + production bundle to dist/
npm run preview    # Serve the production build
```

The previous canvas-only single-file build is preserved in [`archive/flappy_climber.html`](archive/flappy_climber.html) for reference.

## Coding rules

- **No abbreviations** in code or file names. Write the full word every time — `width` not `w`, `height` not `h`, `obstacle` not `obs`, `radius` not `r`, `velocity` not `vel`, `background` not `bg`, `sequence` not `seq`, `offset` not `off`, `number` not `n` or `N`, `command` not `cmd`, `response` not `res`, `control` not `ctrl`, `characteristic` not `char`. Standard SI units (`kg`) and universally-known SVG attribute names (`cx`, `cy`, `rx`, `ry`) are fine.
- **Visual assets live in `src/visual/`**. Pure SVG drawing components — ones that have no game logic and just render markup — belong in `src/visual/` so they are easy to swap out. Components with hooks, computed state, or interactive behaviour stay in `src/components/`.
- **Always ask to commit** after completing all changes in a session.

## Stack

- **Vite + React 18 + TypeScript** (strict). No CSS framework — plain CSS in [src/index.css](src/index.css).
- **All rendering is SVG/DOM**, not canvas. Game state mutates in a `useRef` to avoid React re-render storms; a tick counter in `useState` schedules a redraw each animation frame.
- **Web Bluetooth** for the Tindeq Progressor sensor lives in [`useTindeq`](src/hooks/useTindeq.ts).

## Architecture

```
src/
  App.tsx                  — root, scaffolds the SVG world + DOM HUD/overlays
  index.css                — global styles (HUD pills, menu, dpad, etc.)
  game/
    constants.ts           — WORLD_WIDTH, GROUND_OFFSET_FROM_BOTTOM, MOVE_SPEED, PALETTE, BLE UUIDs
    types.ts               — World, Climber, Obstacle, Particle, Cloud, SeqEvent
    randomNumberGenerator.ts — Mulberry32 seeded PRNG (used everywhere art is procedural)
    world.ts               — createInitialWorld, resetForNewGame, getGroundY
    tick.ts                — tickWorld() — physics, scrolling, obstacle move, collision, particles
    obstacles.ts           — random + interval obstacle spawning
    sequence.ts            — workout DSL parser (X seconds rest / on Z height / repeat V times)
    collision.ts           — ellipse vs AABB hit testing
  hooks/
    useGameLoop.ts         — requestAnimationFrame loop with cleanup
    useKeyboard.ts         — arrow keys + Escape → world.keysUp/keysDown + menu
    useTindeq.ts           — Web Bluetooth connect + measurement notifications
  visual/                  — pure SVG art; no game logic; easy to replace
    Sky.tsx, Sun.tsx, Clouds.tsx
    Mountains.tsx, MidgroundHills.tsx, Trees.tsx
    Rope.tsx, Particles.tsx, ScorePops.tsx
    climber/               — one tsx per SVG frame; pasted from claude-design JSX assets
  components/
    Climber.tsx            — picks RadKid frame (idle / climbL / climbR / hurt)
    Ground.tsx             — grass cap + dirt body + speckles + scattered flowers/bushes/mushrooms
    Obstacles.tsx          — RockShape (wall + boulder) with strata bands, cracks, moss
    GuideBeam.tsx          — terrain-following beam, toggleable from the menu
    HeightMeter.tsx        — left-side ruler with outlined 10/20/.../70m labels
    HeadsUpDisplay.tsx     — TIME / SCORE / KG pills
    DirectionalPad.tsx     — hold buttons + menu tap button
    Overlay.tsx            — start menu / game-over screen
    DebugPanel.tsx         — Tindeq raw/smoothed readout
```

## Game state machine

`world.status` is `'idle'` or `'playing'`. `tickWorld()` is a no-op when not `'playing'`.

A collision resets `score = 0` and starts a 90-frame invincibility window (climber sprite uses the **hurt** frame for the first 30 of those, then flickers). The game never truly "ends"; pressing Escape, tapping ☰, or letting the sequence finish returns to the menu via `returnToMenu()`.

## Workout DSL

Same syntax as the canvas build:

```
X seconds rest
Y seconds on Z height
repeat this V times
```

If the textarea is empty, falls back to random `spawnObstacle()` every `OBSTACLE_INTERVAL` frames.

## Coordinates

The SVG renders into a logical **WORLD_WIDTH × logicalHeight** coordinate space (`WORLD_WIDTH = 420`, `logicalHeight` derived from viewport aspect ratio). `preserveAspectRatio="none"` stretches that to fill the viewport. `GROUND_Y = logicalHeight - 60`. 1 m of climber height = 4 px. Waist anchor (`climber.y + 8`) is shared by collision, rope sampling, and the height-meter indicator.

## Debugging

In dev (`import.meta.env.DEV`), the live world is exposed as `window.__world` so you can inspect / mutate it from the console.
