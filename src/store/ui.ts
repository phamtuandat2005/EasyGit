import { create } from 'zustand';
import type { ViewType, ContextPanelState, ModalState, ToastMessage } from '../types/ui';
import type { GitOperationLogEntry, GitOperationStatus, GitOperationType } from '../types/git';
import { describeGitOperation } from '../services/git-operations';

interface UIStore {
  // Navigation
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  collapsedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;

  // Context Panel
  contextPanel: ContextPanelState;
  setContextPanel: (panel: ContextPanelState) => void;
  contextPanelVisible: boolean;
  toggleContextPanel: () => void;

  // Modal
  modal: ModalState;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Selected items
  selectedFilePath: string | null;
  setSelectedFile: (path: string | null) => void;

  // Diff view mode
  diffViewMode: 'unified' | 'split';
  setDiffViewMode: (mode: 'unified' | 'split') => void;

  // Git Operation Terminal
  gitTerminalOpen: boolean;
  gitTerminalExpanded: boolean;
  gitOperations: GitOperationLogEntry[];
  openGitTerminal: () => void;
  toggleGitTerminal: () => void;
  clearGitTerminal: () => void;
  beginGitOperation: (type: GitOperationType, args?: Record<string, any>) => string;
  appendGitOperationOutput: (id: string, line: string) => void;
  finishGitOperation: (id: string, result: {
    success: boolean;
    stdout?: string;
    stderr?: string;
    code?: number | string;
    error?: string;
  }) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIStore>((set) => ({
  // Navigation
  activeView: 'changes',
  setActiveView: (view) => set({ activeView: view }),

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  collapsedSections: {},
  toggleSection: (section) => set((s) => ({
    collapsedSections: {
      ...s.collapsedSections,
      [section]: !s.collapsedSections[section],
    }
  })),

  // Context Panel
  contextPanel: { type: 'none', data: null },
  setContextPanel: (panel) => set({ contextPanel: panel, contextPanelVisible: true }),
  contextPanelVisible: true,
  toggleContextPanel: () => set((s) => ({ contextPanelVisible: !s.contextPanelVisible })),

  // Modal
  modal: { type: 'none' },
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: { type: 'none' } }),

  // Command Palette
  commandPaletteOpen: false,
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) }));
      }, toast.duration ?? 4000);
    }
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  // Selected items
  selectedFilePath: null,
  setSelectedFile: (path) => set({ selectedFilePath: path }),

  // Diff view mode
  diffViewMode: 'unified',
  setDiffViewMode: (mode) => set({ diffViewMode: mode }),

  // Git Operation Terminal
  gitTerminalOpen: true,
  gitTerminalExpanded: true,
  gitOperations: [],
  openGitTerminal: () => set({ gitTerminalOpen: true, gitTerminalExpanded: true }),
  toggleGitTerminal: () => set((s) => ({ gitTerminalOpen: !s.gitTerminalOpen })),
  clearGitTerminal: () => set({ gitOperations: [] }),
  beginGitOperation: (type, args = {}) => {
    const descriptor = describeGitOperation(type, args);
    const id = `op-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const entry: GitOperationLogEntry = {
      id,
      type,
      command: descriptor.command,
      explanation: descriptor.explanation,
      output: [],
      status: 'running',
      startedAt: new Date().toISOString(),
    };
    set((s) => ({ gitTerminalOpen: true, gitOperations: [...s.gitOperations, entry].slice(-20) }));
    return id;
  },
  appendGitOperationOutput: (id, line) => set((s) => ({
    gitOperations: s.gitOperations.map((op) => op.id === id ? { ...op, output: [...op.output, line] } : op),
  })),
  finishGitOperation: (id, result) => set((s) => ({
    gitOperations: s.gitOperations.map((op) => {
      if (op.id !== id) return op;
      const started = new Date(op.startedAt).getTime();
      const finishedAt = new Date().toISOString();
      const durationMs = Math.max(0, Date.now() - started);
      const status: GitOperationStatus = result.success ? (result.stderr ? 'warning' : 'success') : 'error';
      return {
        ...op,
        status,
        finishedAt,
        durationMs,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.code,
        error: result.error,
      } as any;
    }),
  })),
}));
