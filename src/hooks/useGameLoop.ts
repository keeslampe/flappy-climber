import { useEffect, useRef } from 'react';

// Runs `callback` once per animation frame. The callback is stored in a ref
// so it can read current state without re-subscribing on every render.
export function useGameLoop(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    let animationFrameId = 0;
    const tick = () => {
      callbackRef.current();
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
}
