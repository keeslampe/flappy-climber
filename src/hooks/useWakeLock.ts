import { useCallback, useEffect, useRef } from 'react';

// Keeps the screen awake while playing (Android Chrome). The OS releases a wake lock
// whenever the page is hidden (tab switch, screen off), so we re-acquire it when the
// document becomes visible again. No-op where the API is unavailable (e.g. iOS).
export function useWakeLock(): () => void {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const wantedRef = useRef(false);

  const acquire = useCallback(async () => {
    wantedRef.current = true;
    if (!('wakeLock' in navigator)) return;
    if (sentinelRef.current || document.visibilityState !== 'visible') return;
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      sentinel.addEventListener('release', () => {
        sentinelRef.current = null;
      });
    } catch {
      // Ignored — not visible, unsupported, or denied.
    }
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wantedRef.current) acquire();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sentinelRef.current?.release().catch(() => {});
      sentinelRef.current = null;
    };
  }, [acquire]);

  // Returns a function to (re)request the lock — call it from a user gesture.
  return useCallback(() => {
    void acquire();
  }, [acquire]);
}
