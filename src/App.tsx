import { useCallback, useEffect, useRef, useState } from 'react';
import { WORLD_WIDTH } from './game/constants';
import { parseSequence } from './game/sequence';
import { tickWorld } from './game/tick';
import type { SeqEvent } from './game/types';
import { createInitialWorld, getGroundY, resetForNewGame } from './game/world';

import { Climber } from './components/Climber';
import { DebugPanel } from './components/DebugPanel';
import { DirectionalPad } from './components/DirectionalPad';
import { Ground } from './components/Ground';
import { HeadsUpDisplay } from './components/HeadsUpDisplay';
import { HeightMeter } from './components/HeightMeter';
import { Overlay } from './components/Overlay';
import { ProgramTargetLine } from './components/ProgramTargetLine';
import { BoltAnchors } from './visual/BoltAnchor';
import { ClimbingWall } from './visual/ClimbingWall';
import { Clouds } from './visual/Clouds';
import { HorizonHaze } from './visual/HorizonHaze';
import { Mountains } from './visual/Mountains';
import { Particles } from './visual/Particles';
import { Rope } from './visual/Rope';
import { ScorePops } from './visual/ScorePops';
import { Sky } from './visual/Sky';
import { Sun } from './visual/Sun';
import { Trees } from './visual/Trees';
import { ValleyFloor } from './visual/ValleyFloor';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import { useTindeq } from './hooks/useTindeq';

const DEFAULT_SEQ = `8 seconds on 20 height
10 seconds rest
repeat this 5 times`;

// The simulation advances in fixed real-time steps (60 per second) so motion and
// the workout timer are independent of the display's refresh rate.
const FIXED_STEP_SECONDS = 1 / 60;

export default function App() {
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

  const worldRef = useRef(createInitialWorld(logicalHeight));
  const [, setTick] = useState(0);
  const tindeq = useTindeq();
  const [seqText, setSeqText] = useState(DEFAULT_SEQ);
  const [showDebug, setShowDebug] = useState(true);
  const [showTargetLine, setShowTargetLine] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [lastRun, setLastRun] = useState<{ score: number; seconds: number } | null>(null);

  const startGame = useCallback(() => {
    const world = worldRef.current;
    resetForNewGame(world, logicalHeight);
    const parsed = parseSequence(seqText);
    if (parsed.events.length > 0) {
      // Always begin with a 5 second rest, then run the repeat-expanded program
      // once (so the intro rest happens only at the very start, not each repeat).
      const expanded: SeqEvent[] = [{ type: 'rest', duration: 5 }];
      for (let repeat = 0; repeat < parsed.repeatTimes; repeat++) expanded.push(...parsed.events);
      world.sequenceProgram = expanded;
      world.sequenceRepeatMax = 1;
    } else {
      world.sequenceProgram = parsed.events;
      world.sequenceRepeatMax = parsed.repeatTimes;
    }
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

  if (import.meta.env.DEV) {
    (window as unknown as { __world?: unknown }).__world = worldRef.current;
  }

  const stepAccumulatorRef = useRef(0);
  useGameLoop((deltaSeconds) => {
    const world = worldRef.current;
    world.tindeqConnected = tindeq.connected;
    world.tindeqKilograms = tindeq.readingRef.current;

    // Fixed-timestep: advance the simulation in real 1/60s steps so the game and
    // the workout timer run at real seconds regardless of the display refresh rate.
    // Clamp the backlog so a stall (e.g. a backgrounded tab) can't spiral.
    stepAccumulatorRef.current = Math.min(stepAccumulatorRef.current + deltaSeconds, 0.25);
    while (stepAccumulatorRef.current >= FIXED_STEP_SECONDS) {
      tickWorld(world, { viewportHeight: logicalHeight });
      stepAccumulatorRef.current -= FIXED_STEP_SECONDS;
    }
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
        <HorizonHaze worldWidth={WORLD_WIDTH} groundY={groundY} />
        <ValleyFloor worldWidth={WORLD_WIDTH} groundY={groundY} />
        <ClimbingWall world={world} worldWidth={WORLD_WIDTH} groundY={groundY} />
        <BoltAnchors world={world} groundY={groundY} />
        <Ground worldWidth={WORLD_WIDTH} groundY={groundY} viewportHeight={logicalHeight} groundOffset={world.groundOffset} />
        <Rope world={world} />
        <Climber world={world} />
        <Particles world={world} />
        <ScorePops world={world} />
        <HeightMeter world={world} groundY={groundY} />
        {showDebug && showTargetLine && <ProgramTargetLine world={world} groundY={groundY} />}
      </svg>

      <HeadsUpDisplay seconds={world.seconds} score={world.score} weight={world.weight} />

      {showDebug && (
        <DebugPanel
          raw={tindeq.readingRef.current}
          smooth={world.tindeqSmoothedKilograms}
          connected={tindeq.connected}
          showTargetLine={showTargetLine}
          setShowTargetLine={setShowTargetLine}
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
