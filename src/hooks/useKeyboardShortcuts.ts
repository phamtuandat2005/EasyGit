import { useEffect } from 'react';
import { useUIStore, useCommandStore } from '../store';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const toggleCommandPalette = useUIStore(s => s.toggleCommandPalette);
  const closeModal = useUIStore(s => s.closeModal);
  const setCommandPaletteOpen = useUIStore(s => s.setCommandPaletteOpen);

  useEffect(() => {
    const shortcuts: Shortcut[] = [
      { key: 'k', ctrl: true, action: () => toggleCommandPalette(), description: 'Command Palette' },
      { key: 'Escape', action: () => { setCommandPaletteOpen(false); closeModal(); }, description: 'Close' },
    ];

    const handler = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : true;
        const altMatch = shortcut.alt ? e.altKey : true;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleCommandPalette, closeModal, setCommandPaletteOpen]);
}
