import { useEffect, useRef } from 'react';

// Runs `callback(deltaSeconds)` once per animation frame, passing the real time
// elapsed since the previous frame. The callback is stored in a ref so it can
// read current state without re-subscribing on every render.
export function useGameLoop(callback: (deltaSeconds: number) => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    let animationFrameId = 0;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const deltaSeconds = (now - lastTime) / 1000;
      lastTime = now;
      callbackRef.current(deltaSeconds);
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
}
