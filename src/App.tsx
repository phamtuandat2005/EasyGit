import React, { Suspense, useEffect } from 'react';
import { useUIStore, useCommandStore, useSettingsStore, useRepositoryStore, applyAppearanceToDOM } from './store';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { AppShell } from './components/layout/AppShell/AppShell';
import { Sidebar } from './components/layout/Sidebar/Sidebar';
import { Toolbar } from './components/layout/Toolbar/Toolbar';
import { StatusBar } from './components/layout/StatusBar/StatusBar';
import { ContextPanel } from './components/layout/ContextPanel/ContextPanel';
import { CommandPalette } from './components/ui/CommandPalette';
import { SettingsModal } from './components/ui/SettingsModal';
import { NewBranchModal } from './components/ui/NewBranchModal';
import ChangesView from './views/ChangesView';
import HistoryView from './views/HistoryView';
import BranchesView from './views/BranchesView';
import GraphView from './views/GraphView';
import StashView from './views/StashView';
import { WelcomeView } from './views/WelcomeView';
import styles from './App.module.css';

export function App() {
  useKeyboardShortcuts();
  
  const activeView = useUIStore(s => s.activeView);
  const setActiveView = useUIStore(s => s.setActiveView);
  const registerCommand = useCommandStore(s => s.registerCommand);
  const openModal = useUIStore(s => s.openModal);
  const closeModal = useUIStore(s => s.closeModal);
  const modal = useUIStore(s => s.modal);
  
  const { path, loadRepository } = useRepositoryStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    applyAppearanceToDOM(settings.appearance);
  }, [settings.appearance]);

  useEffect(() => {
    registerCommand({ id: 'view:changes', label: 'Show Changes', category: 'Navigation', shortcut: 'Ctrl+1', action: () => setActiveView('changes') });
    registerCommand({ id: 'view:history', label: 'Show History', category: 'Navigation', shortcut: 'Ctrl+2', action: () => setActiveView('history') });
    registerCommand({ id: 'view:graph', label: 'Show Graph', category: 'Navigation', shortcut: 'Ctrl+3', action: () => setActiveView('graph') });
    registerCommand({ id: 'view:branches', label: 'Show Branches', category: 'Navigation', action: () => setActiveView('branches') });
    registerCommand({ id: 'view:stash', label: 'Show Stash', category: 'Navigation', action: () => setActiveView('stash') });
    registerCommand({ id: 'app:settings', label: 'Open Settings', category: 'Application', action: () => openModal({ type: 'settings' }) });
    registerCommand({ id: 'git:fetch', label: 'Fetch', category: 'Git', action: () => useRepositoryStore.getState().fetch() });
    registerCommand({ id: 'git:pull', label: 'Pull', category: 'Git', action: () => useRepositoryStore.getState().pull() });
    registerCommand({ id: 'git:push', label: 'Push', category: 'Git', action: () => useRepositoryStore.getState().push() });
    registerCommand({ id: 'git:stash', label: 'Stash', category: 'Git', action: () => useRepositoryStore.getState().stash() });
    registerCommand({ id: 'git:undo', label: 'Undo Last Commit', category: 'Git', action: () => useRepositoryStore.getState().undoCommit() });
  }, []);

  // Listen to native menu bar actions from Electron main process
  useEffect(() => {
    const unsubscribeMenu = (window as any).electron?.onMenuAction?.((action: string) => {
      switch (action) {
        case 'view:changes':    setActiveView('changes'); break;
        case 'view:history':    setActiveView('history'); break;
        case 'view:graph':      setActiveView('graph'); break;
        case 'view:branches':   setActiveView('branches'); break;
        case 'settings':        openModal({ type: 'settings' }); break;
        case 'command-palette': openModal({ type: 'command-palette' }); break;
        case 'about':           openModal({ type: 'settings' }); break;
        case 'clone':
          // If path is set (user is in a repo), we could open a modal or just let them use Welcome screen 
          // For now, if they are already in a repo and want to clone, we can clear the path to go to Welcome View
          // or we can implement a separate modal. Easiest is to clear path.
          useRepositoryStore.setState({ path: null, repoError: null });
          // Note: The WelcomeView handles the 'clone' UX now.
          break;
      }
    });

    const unsubscribeOpen = (window as any).electron?.onOpenRepository?.(async (repoPath: string) => {
      await loadRepository(repoPath);
    });

    const unsubscribeInit = (window as any).electron?.onInitRepository?.(async (repoPath: string) => {
      const electron = (window as any).electron;
      if (electron) {
        const result = await electron.git.init(repoPath);
        if (result.success) {
          await loadRepository(repoPath);
        }
      }
    });

    return () => {
      unsubscribeMenu?.();
      unsubscribeOpen?.();
      unsubscribeInit?.();
    };
  }, []);

  return (
    <>
      {!path ? (
        <WelcomeView />
      ) : (
        <AppShell
          sidebar={<Sidebar />}
          toolbar={<Toolbar />}
          statusbar={<StatusBar />}
          contextPanel={<ContextPanel />}
        >
          <Suspense fallback={<div className="skeleton" style={{ width: '100%', height: '100%' }} />}>
            {activeView === 'changes' && <ChangesView />}
            {activeView === 'history' && <HistoryView />}
            {activeView === 'branches' && <BranchesView />}
            {activeView === 'graph' && <GraphView />}
            {activeView === 'stash' && <StashView />}
            {activeView !== 'changes' && activeView !== 'history' && activeView !== 'branches' && activeView !== 'graph' && activeView !== 'stash' && (
              <div style={{ padding: '20px' }}>Content for view: {activeView}</div>
            )}
          </Suspense>
        </AppShell>
      )}
      <CommandPalette />
      <SettingsModal isOpen={modal.type === 'settings'} onClose={closeModal} />
      <NewBranchModal isOpen={modal.type === 'new-branch'} onClose={closeModal} />
    </>
  );
}

