import { useCallback, useEffect, useRef, useState } from 'react';
import { W } from './game/constants';
import { parseSequence } from './game/sequence';
import { tickWorld } from './game/tick';
import { createInitialWorld, getGroundY, resetForNewGame } from './game/world';

import { Clouds } from './components/Clouds';
import { DPad } from './components/DPad';
import { DebugPanel } from './components/DebugPanel';
import { Ground } from './components/Ground';
import { GuideBeam } from './components/GuideBeam';
import { HUD } from './components/HUD';
import { HeightMeter } from './components/HeightMeter';
import { MidgroundHills } from './components/MidgroundHills';
import { Mountains } from './components/Mountains';
import { Obstacles } from './components/Obstacles';
import { Overlay } from './components/Overlay';
import { Particles } from './components/Particles';
import { Climber } from './components/Climber';
import { Rope } from './components/Rope';
import { ScorePops } from './components/ScorePops';
import { Sky } from './components/Sky';
import { Sun } from './components/Sun';
import { Trees } from './components/Trees';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import { useTindeq } from './hooks/useTindeq';

const DEFAULT_SEQ = `8 seconds on 20 height
10 seconds rest
repeat this 5 times`;

export default function App() {
  // Viewport-driven dimensions. The SVG renders into a logical W × logicalH
  // coordinate space and stretches to fill the viewport.
  const [viewport, setViewport] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const scale = viewport.w / W;
  const logicalH = Math.ceil(viewport.h / scale);
  const groundY = getGroundY(logicalH);

  // World state lives in a ref — RAF mutates it in place. A tick counter in
  // React state forces a re-render every animation frame.
  const worldRef = useRef(createInitialWorld(logicalH));
  const [, setTick] = useState(0);
  const tindeq = useTindeq();
  const [seqText, setSeqText] = useState(DEFAULT_SEQ);
  const [showBeam, setShowBeam] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [lastRun, setLastRun] = useState<{ score: number; seconds: number } | null>(null);
  const [flashAlpha, setFlashAlpha] = useState(0);
  const flashTimeoutRef = useRef<number | null>(null);

  const startGame = useCallback(() => {
    const world = worldRef.current;
    resetForNewGame(world, logicalH);
    const parsed = parseSequence(seqText);
    world.seqProgram = parsed.events;
    world.seqRepeatMax = parsed.repeatTimes;
    world.status = 'playing';
    setShowOverlay(false);
  }, [logicalH, seqText]);

  const returnToMenu = useCallback(() => {
    const world = worldRef.current;
    if (world.status !== 'playing') return;
    world.status = 'idle';
    setLastRun({ score: world.score, seconds: world.seconds });
    if (world.score > bestScore) setBestScore(world.score);
    setShowOverlay(true);
  }, [bestScore]);

  const setUp = useCallback((v: boolean) => { worldRef.current.keysUp = v; }, []);
  const setDown = useCallback((v: boolean) => { worldRef.current.keysDown = v; }, []);
  useKeyboard({ setUp, setDown, onEscape: returnToMenu });

  // Expose for debugging in dev only
  if (import.meta.env.DEV) {
    (window as unknown as { __world?: unknown }).__world = worldRef.current;
  }

  // Game loop — drives physics, then bumps the tick counter to re-render.
  useGameLoop(() => {
    const world = worldRef.current;
    // Mirror Tindeq connection state + raw reading into world for tick logic.
    world.tindeqConnected = tindeq.connected;
    world.tindeqKg = tindeq.readingRef.current;
    tickWorld(world, {
      viewportH: logicalH,
      onFlash: () => {
        setFlashAlpha(0.55);
        if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = window.setTimeout(() => setFlashAlpha(0), 120);
      },
    });
    setTick((t) => (t + 1) | 0);
  });

  const world = worldRef.current;

  return (
    <div className="playfield">
      <svg
        className="world"
        viewBox={`0 0 ${W} ${logicalH}`}
        preserveAspectRatio="none"
      >
        <Sky W={W} groundY={groundY} />
        <Sun W={W} />
        <Clouds clouds={world.clouds} />
        <Mountains W={W} groundY={groundY} bgScrollY={world.bgScrollY} />
        <MidgroundHills W={W} groundY={groundY} bgScrollY={world.bgScrollY} />
        <Trees layer={0} W={W} groundY={groundY} bgScrollY={world.bgScrollY} />
        <Trees layer={1} W={W} groundY={groundY} bgScrollY={world.bgScrollY} />
        <Ground W={W} groundY={groundY} viewportH={logicalH} groundOff={world.groundOff} />
        <Obstacles world={world} groundY={groundY} />
        {showBeam && <GuideBeam world={world} groundY={groundY} />}
        <Rope world={world} />
        <Climber world={world} />
        <Particles world={world} />
        <ScorePops world={world} />
        <HeightMeter world={world} groundY={groundY} />
      </svg>

      <HUD seconds={world.seconds} score={world.score} weight={world.weight} />

      <div className="flash" style={{ background: `rgba(255,61,138,${flashAlpha})` }} />

      {showDebug && (
        <DebugPanel
          raw={tindeq.readingRef.current}
          smooth={world.tindeqSmoothed}
          connected={tindeq.connected}
        />
      )}

      <DPad
        onUpChange={(v) => { worldRef.current.keysUp = v; }}
        onDownChange={(v) => { worldRef.current.keysDown = v; }}
        onMenu={returnToMenu}
      />

      {showOverlay && (
        <Overlay
          best={bestScore}
          lastScore={lastRun?.score ?? null}
          lastSeconds={lastRun?.seconds ?? null}
          seqText={seqText}
          setSeqText={setSeqText}
          showBeam={showBeam}
          setShowBeam={setShowBeam}
          showDebug={showDebug}
          setShowDebug={setShowDebug}
          onStart={startGame}
          onConnectTindeq={tindeq.connect}
          tindeqConnected={tindeq.connected}
          bluetoothAvailable={tindeq.bluetoothAvailable}
        />
      )}
    </div>
  );
}

