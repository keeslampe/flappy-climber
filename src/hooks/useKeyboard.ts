import { useEffect } from 'react';

interface Handlers {
  setUp: (v: boolean) => void;
  setDown: (v: boolean) => void;
  onEscape: () => void;
}

export function useKeyboard({ setUp, setDown, onEscape }: Handlers): void {
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onEscape();
        return;
      }
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        setUp(true);
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        setDown(true);
      }
    };
    const keyup = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') setUp(false);
      if (e.code === 'ArrowDown') setDown(false);
    };
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
    };
  }, [setUp, setDown, onEscape]);
}
