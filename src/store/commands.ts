import { create } from 'zustand';
import type { Command } from '../types/ui';

interface CommandStore {
  commands: Command[];
  registerCommand: (command: Command) => void;
  registerCommands: (commands: Command[]) => void;
  unregisterCommand: (id: string) => void;
  getCommands: () => Command[];
  search: (query: string) => Command[];
}

function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let ti = 0;
  for (let qi = 0; qi < lowerQuery.length; qi++) {
    const char = lowerQuery[qi];
    const found = lowerText.indexOf(char, ti);
    if (found === -1) return false;
    ti = found + 1;
  }
  return true;
}

export const useCommandStore = create<CommandStore>((set, get) => ({
  commands: [],

  registerCommand: (command) => set((s) => ({
    commands: [...s.commands.filter(c => c.id !== command.id), command],
  })),

  registerCommands: (commands) => set((s) => {
    const ids = new Set(commands.map(c => c.id));
    return { commands: [...s.commands.filter(c => !ids.has(c.id)), ...commands] };
  }),

  unregisterCommand: (id) => set((s) => ({
    commands: s.commands.filter(c => c.id !== id),
  })),

  getCommands: () => get().commands.filter(c => !c.disabled),

  search: (query) => {
    if (!query.trim()) return get().commands.filter(c => !c.disabled);
    return get().commands.filter(c => !c.disabled && (
      fuzzyMatch(c.label, query) || fuzzyMatch(c.category, query)
    ));
  },
}));
