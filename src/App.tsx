import { useCallback, useEffect, useRef, useState } from 'react';
import { WORLD_WIDTH } from './game/constants';
import { parseSequence } from './game/sequence';
import { tickWorld } from './game/tick';
import { createInitialWorld, getGroundY, resetForNewGame } from './game/world';

import { Climber } from './components/Climber';
import { DebugPanel } from './components/DebugPanel';
import { DirectionalPad } from './components/DirectionalPad';
import { Ground } from './components/Ground';
import { HeadsUpDisplay } from './components/HeadsUpDisplay';
import { HeightMeter } from './components/HeightMeter';
import { Overlay } from './components/Overlay';
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
  const [showDebug, setShowDebug] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [bestScore, setBestScore] = useState(0);
  const [lastRun, setLastRun] = useState<{ score: number; seconds: number } | null>(null);

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

  if (import.meta.env.DEV) {
    (window as unknown as { __world?: unknown }).__world = worldRef.current;
  }

  useGameLoop(() => {
    const world = worldRef.current;
    world.tindeqConnected = tindeq.connected;
    world.tindeqKilograms = tindeq.readingRef.current;
    tickWorld(world, { viewportHeight: logicalHeight });
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
      </svg>

      <HeadsUpDisplay seconds={world.seconds} score={world.score} weight={world.weight} />

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
