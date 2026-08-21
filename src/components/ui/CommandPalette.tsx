import React, { useEffect, useRef, useState } from 'react';
import { useUIStore, useCommandStore } from '../../store';
import styles from './CommandPalette.module.css';

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { search } = useCommandStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = search(query);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedCmd = results[selectedIndex];
      if (selectedCmd) {
        selectedCmd.action();
        setCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setCommandPaletteOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search commands..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.results}>
          {results.length === 0 ? (
            <div className={styles.empty}>No commands found</div>
          ) : (
            results.map((cmd, idx) => (
              <div
                key={cmd.id}
                className={`${styles.resultItem} ${idx === selectedIndex ? styles.selected : ''}`}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => {
                  cmd.action();
                  setCommandPaletteOpen(false);
                }}
              >
                <div className={styles.itemIcon}>{cmd.icon || '⚡'}</div>
                <div className={styles.itemContent}>
                  <div className={styles.itemLabel}>{cmd.label}</div>
                  <div className={styles.itemCategory}>{cmd.category}</div>
                </div>
                {cmd.shortcut && (
                  <div className={styles.itemShortcut}>{cmd.shortcut}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
