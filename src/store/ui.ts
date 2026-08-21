import { create } from 'zustand';
import type { ViewType, ContextPanelState, ModalState, ToastMessage } from '../types/ui';

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
}));
