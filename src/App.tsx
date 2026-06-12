import { useCallback, useEffect, useRef, useState } from 'react';
import { SCROLL_SPEED, WORLD_WIDTH } from './game/constants';
import { expandProgramWithHands, type Program } from './game/program';
import { tickWorld } from './game/tick';
import type { SeqEvent } from './game/types';
import { createInitialWorld, getGroundY, resetForNewGame } from './game/world';
import { usePrograms } from './hooks/usePrograms';

import { Climber } from './components/Climber';
import { DebugPanel } from './components/DebugPanel';
import { DirectionalPad } from './components/DirectionalPad';
import { Ground } from './components/Ground';
import { HeadsUpDisplay } from './components/HeadsUpDisplay';
import { HeightMeter } from './components/HeightMeter';
import { Overlay } from './components/Overlay';
import { PauseScreen } from './components/PauseScreen';
import { ProgramEditor } from './components/ProgramEditor';
import { ResultsScreen } from './components/ResultsScreen';
import { ProgramTargetLine } from './components/ProgramTargetLine';
import { BoltAnchors } from './visual/BoltAnchor';
import { ClimbingWall } from './visual/ClimbingWall';
import { HandSwitchBubble } from './visual/HandSwitchBubble';
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
  const programsStore = usePrograms();
  const [showDebug, setShowDebug] = useState(false);
  const [showTargetLine, setShowTargetLine] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [view, setView] = useState<'menu' | 'editor'>('menu');
  const [paused, setPaused] = useState(false);
  const pauseStartRef = useRef(0);
  // Timestamp of the last resume — a short window where taps can't re-pause, so the
  // very tap that resumes (or a stray follow-up touch) doesn't immediately pause again.
  const resumeAtRef = useRef(0);
  const [bestScore, setBestScore] = useState(0);
  const [lastRun, setLastRun] = useState<
    { score: number; seconds: number; kg: number; programName: string } | null
  >(null);
  // The program name in play, captured at start so the results overview is stable.
  const lastProgramNameRef = useRef('');

  const startGame = useCallback(() => {
    // Best-effort fullscreen so the browser address bar disappears (no-op in an
    // already-fullscreen installed PWA, or where the API is unavailable). Runs inside
    // the SEND IT tap, which is the user gesture the Fullscreen API requires.
    document.documentElement.requestFullscreen?.()?.catch(() => {});

    const world = worldRef.current;
    resetForNewGame(world, logicalHeight);
    const program = programsStore.selectedProgram;
    const { events, initialHand } = program
      ? expandProgramWithHands(program)
      : { events: [] as SeqEvent[], initialHand: null };
    if (events.length > 0) {
      // Always begin with a 5 second rest, then run the program once (block repeats
      // are already baked in, so the intro rest happens only at the very start).
      const expanded: SeqEvent[] = [{ type: 'rest', duration: 5 }, ...events];
      world.sequenceProgram = expanded;
      world.sequenceRepeatMax = 1;
    } else {
      world.sequenceProgram = [];
      world.sequenceRepeatMax = 1;
    }
    world.currentHand = initialHand;
    // Scream the starting hand at the gun, like a switch cue.
    world.handSwitchCue = initialHand ? { hand: initialHand, life: 1, isStart: true } : null;
    lastProgramNameRef.current = program?.name ?? '';
    setPaused(false);
    // Clips stop at the last pull; the finish flag follows 4 seconds later, leaving
    // an empty rest at the end (no pull → no finish line).
    let cursor = 0;
    let lastPullEnd = 0;
    for (const event of world.sequenceProgram) {
      cursor += event.duration * 60 * SCROLL_SPEED;
      if (event.type === 'on') lastPullEnd = cursor;
    }
    world.lastPullScroll = lastPullEnd;
    world.finishScroll = lastPullEnd > 0 ? lastPullEnd + 4 * 60 * SCROLL_SPEED : 0;
    world.status = 'playing';
    // Block the pause-catcher briefly so the same SEND IT tap can't immediately pause.
    resumeAtRef.current = performance.now();
    setShowResults(false);
    setShowOverlay(false);
  }, [logicalHeight, programsStore.selectedProgram]);

  const returnToMenu = useCallback(() => {
    const world = worldRef.current;
    if (world.status !== 'playing') return;
    world.status = 'idle';
    setPaused(false);
    setLastRun({
      score: world.score,
      seconds: world.seconds,
      kg: world.peakWeight,
      programName: lastProgramNameRef.current,
    });
    if (world.score > bestScore) setBestScore(world.score);
    setShowResults(false);
    setShowOverlay(true);
  }, [bestScore]);

  // Tapping the play area freezes the run; resuming shifts gameStartTime forward by
  // the paused duration so the wall-clock TIME doesn't jump.
  const pauseGame = useCallback(() => {
    if (worldRef.current.status !== 'playing') return;
    if (performance.now() - resumeAtRef.current < 500) return; // just resumed — ignore
    pauseStartRef.current = performance.now();
    setPaused(true);
  }, []);

  const resumeGame = useCallback(() => {
    worldRef.current.gameStartTime += performance.now() - pauseStartRef.current;
    resumeAtRef.current = performance.now();
    setPaused(false);
  }, []);

  // Reaching the finish flag ends the run and shows the results overview.
  const finishRun = useCallback(() => {
    const world = worldRef.current;
    if (world.status !== 'playing') return;
    world.status = 'idle';
    world.finishReached = false;
    setLastRun({
      score: world.score,
      seconds: world.seconds,
      kg: world.peakWeight,
      programName: lastProgramNameRef.current,
    });
    if (world.score > bestScore) setBestScore(world.score);
    setShowResults(true);
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

    // While paused, freeze the simulation entirely — drop any accumulated backlog so
    // resuming doesn't fast-forward, and skip the redraw (nothing has moved).
    if (paused) {
      stepAccumulatorRef.current = 0;
      return;
    }

    // Fixed-timestep: advance the simulation in real 1/60s steps so the game and
    // the workout timer run at real seconds regardless of the display refresh rate.
    // Clamp the backlog so a stall (e.g. a backgrounded tab) can't spiral.
    stepAccumulatorRef.current = Math.min(stepAccumulatorRef.current + deltaSeconds, 0.25);
    while (stepAccumulatorRef.current >= FIXED_STEP_SECONDS) {
      tickWorld(world, { viewportHeight: logicalHeight });
      stepAccumulatorRef.current -= FIXED_STEP_SECONDS;
    }
    if (world.status === 'playing' && world.finishReached) finishRun();
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
        <ValleyFloor worldWidth={WORLD_WIDTH} groundY={groundY} backgroundScrollY={world.backgroundScrollY} />
        <ClimbingWall world={world} worldWidth={WORLD_WIDTH} groundY={groundY} />
        <Ground worldWidth={WORLD_WIDTH} groundY={groundY} viewportHeight={logicalHeight} groundOffset={world.groundOffset} />
        <BoltAnchors world={world} groundY={groundY} />
        <Climber world={world} groundY={groundY} />
        <Rope world={world} />
        <Particles world={world} />
        <ScorePops world={world} />
        <HandSwitchBubble world={world} />
        <HeightMeter world={world} groundY={groundY} />
        {showDebug && showTargetLine && <ProgramTargetLine world={world} groundY={groundY} />}
      </svg>

      <HeadsUpDisplay seconds={world.seconds} score={world.score} weight={world.weight} hand={world.currentHand} />

      {showDebug && (
        <DebugPanel
          raw={tindeq.readingRef.current}
          smooth={world.tindeqSmoothedKilograms}
          connected={tindeq.connected}
          handMode={programsStore.selectedProgram?.handMode ?? 'none'}
          currentHand={world.currentHand}
          showTargetLine={showTargetLine}
          setShowTargetLine={setShowTargetLine}
        />
      )}

      {/* Transparent layer over the play area: a tap here pauses the run. Sits below
          the HUD and menu button (so those still work) and above the world SVG. */}
      {world.status === 'playing' && !paused && (
        <div className="pause-catcher" onClick={pauseGame} />
      )}

      <DirectionalPad onMenu={returnToMenu} />

      {paused && <PauseScreen onResume={resumeGame} onMenu={returnToMenu} />}

      {showResults && lastRun && (
        <ResultsScreen
          score={lastRun.score}
          seconds={lastRun.seconds}
          kg={lastRun.kg}
          best={bestScore}
          programName={lastRun.programName}
          onClose={() => {
            setShowResults(false);
            setShowOverlay(true);
          }}
        />
      )}

      {showOverlay && view === 'menu' && (
        <Overlay
          best={bestScore}
          lastScore={lastRun?.score ?? null}
          lastSeconds={lastRun?.seconds ?? null}
          programs={programsStore.programs}
          selectedId={programsStore.selectedId}
          selectedProgram={programsStore.selectedProgram}
          setSelectedId={programsStore.setSelectedId}
          onNewProgram={() => {
            setEditingProgram(null);
            setView('editor');
          }}
          onEditProgram={() => {
            setEditingProgram(programsStore.selectedProgram ?? null);
            setView('editor');
          }}
          onDeleteProgram={() => programsStore.deleteProgram(programsStore.selectedId)}
          showDebug={showDebug}
          setShowDebug={setShowDebug}
          onStart={startGame}
          onConnectTindeq={tindeq.connect}
          tindeqConnected={tindeq.connected}
          bluetoothAvailable={tindeq.bluetoothAvailable}
        />
      )}

      {showOverlay && view === 'editor' && (
        <ProgramEditor
          initial={editingProgram}
          onSave={(program) => {
            programsStore.saveProgram(program);
            programsStore.setSelectedId(program.id);
            setView('menu');
          }}
          onCancel={() => setView('menu')}
        />
      )}
    </div>
  );
}
