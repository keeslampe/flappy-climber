import { useEffect, useRef } from 'react';

// Runs `callback` once per animation frame. The callback is stored in a ref
// so it can read current state without re-subscribing on every render.
export function useGameLoop(callback: () => void): void {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      cbRef.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
}
