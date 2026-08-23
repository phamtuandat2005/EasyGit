/* ============================================
   UI State Types
   ============================================ */

export type ViewType = 'changes' | 'history' | 'branches' | 'graph' | 'stash' | 'tags' | 'remotes' | 'welcome';

export type ContextPanelType = 'file' | 'commit' | 'branch' | 'stash' | 'none';

export interface ContextPanelState {
  type: ContextPanelType;
  data: unknown;
}

export type ModalType = 'new-branch' | 'clone' | 'merge' | 'rebase' | 'delete-branch' | 'discard' | 'settings' | 'command-palette' | 'none';

export interface ModalState {
  type: ModalType;
  data?: unknown;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  category: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
}

export interface RecentRepository {
  name: string;
  path: string;
  lastOpened: string;
  status: 'clean' | 'modified' | 'conflict';
}
