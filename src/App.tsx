import { useCallback, useEffect, useRef, useState } from 'react';
import { WORLD_WIDTH } from './game/constants';
import { parseSequence } from './game/sequence';
import { tickWorld } from './game/tick';
import { createInitialWorld, getGroundY, resetForNewGame } from './game/world';

import { Climber } from './components/Climber';
import { DebugPanel } from './components/DebugPanel';
import { DirectionalPad } from './components/DirectionalPad';
import { Ground } from './components/Ground';
import { GuideBeam } from './components/GuideBeam';
import { HeadsUpDisplay } from './components/HeadsUpDisplay';
import { HeightMeter } from './components/HeightMeter';
import { Obstacles } from './components/Obstacles';
import { Overlay } from './components/Overlay';
import { Clouds } from './visual/Clouds';
import { MidgroundHills } from './visual/MidgroundHills';
import { Mountains } from './visual/Mountains';
import { Particles } from './visual/Particles';
import { Rope } from './visual/Rope';
import { ScorePops } from './visual/ScorePops';
import { Sky } from './visual/Sky';
import { Sun } from './visual/Sun';
import { Trees } from './visual/Trees';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import { useTindeq } from './hooks/useTindeq';

const DEFAULT_SEQ = `8 seconds on 20 height
10 seconds rest
repeat this 5 times`;

export default function App() {
  // Viewport-driven dimensions. The SVG renders into a logical WORLD_WIDTH × logicalHeight
  // coordinate space and stretches to fill the viewport.
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const scale = viewport.width / WORLD_WIDTH;
  const logicalHeight = Math.ceil(viewport.height / scale);
  const groundY = getGroundY(logicalHeight);

  // World state lives in a ref — RAF mutates it in place. A tick counter in
  // React state forces a re-render every animation frame.
  const worldRef = useRef(createInitialWorld(logicalHeight));
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
    resetForNewGame(world, logicalHeight);
    const parsed = parseSequence(seqText);
    world.sequenceProgram = parsed.events;
    world.sequenceRepeatMax = parsed.repeatTimes;
    world.status = 'playing';
    setShowOverlay(false);
  }, [logicalHeight, seqText]);

  const returnToMenu = useCallback(() => {
    const world = worldRef.current;
    if (world.status !== 'playing') return;
    world.status = 'idle';
    setLastRun({ score: world.score, seconds: world.seconds });
    if (world.score > bestScore) setBestScore(world.score);
    setShowOverlay(true);
  }, [bestScore]);

  const setUp = useCallback((value: boolean) => { worldRef.current.keysUp = value; }, []);
  const setDown = useCallback((value: boolean) => { worldRef.current.keysDown = value; }, []);
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
    world.tindeqKilograms = tindeq.readingRef.current;
    tickWorld(world, {
      viewportHeight: logicalHeight,
      onFlash: () => {
        setFlashAlpha(0.55);
        if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = window.setTimeout(() => setFlashAlpha(0), 120);
      },
    });
    setTick((tick) => (tick + 1) | 0);
  });

  const world = worldRef.current;

  return (
    <div className="playfield">
      <svg
        className="world"
        viewBox={`0 0 ${WORLD_WIDTH} ${logicalHeight}`}
        preserveAspectRatio="none"
      >
        <Sky worldWidth={WORLD_WIDTH} groundY={groundY} />
        <Sun worldWidth={WORLD_WIDTH} />
        <Clouds clouds={world.clouds} />
        <Mountains worldWidth={WORLD_WIDTH} groundY={groundY} backgroundScrollY={world.backgroundScrollY} />
        <MidgroundHills worldWidth={WORLD_WIDTH} groundY={groundY} backgroundScrollY={world.backgroundScrollY} />
        <Trees layer={0} worldWidth={WORLD_WIDTH} groundY={groundY} backgroundScrollY={world.backgroundScrollY} />
        <Trees layer={1} worldWidth={WORLD_WIDTH} groundY={groundY} backgroundScrollY={world.backgroundScrollY} />
        <Ground worldWidth={WORLD_WIDTH} groundY={groundY} viewportHeight={logicalHeight} groundOffset={world.groundOffset} />
        <Obstacles world={world} groundY={groundY} />
        {showBeam && <GuideBeam world={world} groundY={groundY} />}
        <Rope world={world} />
        <Climber world={world} />
        <Particles world={world} />
        <ScorePops world={world} />
        <HeightMeter world={world} groundY={groundY} />
      </svg>

      <HeadsUpDisplay seconds={world.seconds} score={world.score} weight={world.weight} />

      <div className="flash" style={{ background: `rgba(255,61,138,${flashAlpha})` }} />

      {showDebug && (
        <DebugPanel
          raw={tindeq.readingRef.current}
          smooth={world.tindeqSmoothedKilograms}
          connected={tindeq.connected}
        />
      )}

      <DirectionalPad
        onUpChange={(value) => { worldRef.current.keysUp = value; }}
        onDownChange={(value) => { worldRef.current.keysDown = value; }}
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
