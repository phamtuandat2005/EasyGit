import React, { Suspense, useEffect } from 'react';
import { useUIStore, useCommandStore, useSettingsStore, useRepositoryStore, applyAppearanceToDOM, DEFAULT_SETTINGS } from './store';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { AppShell } from './components/layout/AppShell/AppShell';
import { Sidebar } from './components/layout/Sidebar/Sidebar';
import { Toolbar } from './components/layout/Toolbar/Toolbar';
import { StatusBar } from './components/layout/StatusBar/StatusBar';
import { ContextPanel } from './components/layout/ContextPanel/ContextPanel';
import { CommandPalette } from './components/ui/CommandPalette';
import { SettingsModal } from './components/ui/SettingsModal';
import { NewBranchModal } from './components/ui/NewBranchModal';
import { MergeModal } from './components/ui/MergeModal';
import ChangesView from './views/ChangesView';
import HistoryView from './views/HistoryView';
import BranchesView from './views/BranchesView';
import GraphView from './views/GraphView';
import StashView from './views/StashView';
import TagsView from './views/TagsView';
import RemotesView from './views/RemotesView';
import { WelcomeView } from './views/WelcomeView';
import { TRANSLATIONS } from './i18n/translations';
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
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS.English;

  useEffect(() => {
    applyAppearanceToDOM(settings.appearance);
    if (settings.appearance.theme !== 'System') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => applyAppearanceToDOM(settings.appearance);
    media.addEventListener?.('change', handleThemeChange);
    return () => media.removeEventListener?.('change', handleThemeChange);
  }, [settings.appearance]);

  useEffect(() => {
    registerCommand({ id: 'view:changes', label: t.navChanges, category: t.navWorkspace, shortcut: 'Ctrl+1', action: () => setActiveView('changes') });
    registerCommand({ id: 'view:history', label: t.navHistory, category: t.navWorkspace, shortcut: 'Ctrl+2', action: () => setActiveView('history') });
    registerCommand({ id: 'view:graph', label: t.navGraph, category: t.navWorkspace, shortcut: 'Ctrl+3', action: () => setActiveView('graph') });
    registerCommand({ id: 'view:branches', label: t.navBranches, category: t.navRepository, action: () => setActiveView('branches') });
    registerCommand({ id: 'view:stash', label: t.navStashes, category: t.navRepository, action: () => setActiveView('stash') });
    registerCommand({ id: 'app:settings', label: t.navSettings, category: t.navSettings, action: () => openModal({ type: 'settings' }) });
    registerCommand({ id: 'git:fetch', label: t.btnFetch, category: t.gitTitle, action: () => useRepositoryStore.getState().fetch() });
    registerCommand({ id: 'git:pull', label: t.btnPull, category: t.gitTitle, action: () => useRepositoryStore.getState().pull() });
    registerCommand({ id: 'git:push', label: t.btnPush, category: t.gitTitle, action: () => useRepositoryStore.getState().push() });
    registerCommand({ id: 'git:stash', label: t.btnStash, category: t.gitTitle, action: () => useRepositoryStore.getState().stash() });
    registerCommand({ id: 'git:stashPop', label: `${t.btnStash} Pop`, category: t.gitTitle, action: () => useRepositoryStore.getState().stashPop() });
    registerCommand({ id: 'git:undo', label: `${t.btnCommit} Undo`, category: t.gitTitle, action: () => useRepositoryStore.getState().undoCommit() });
    registerCommand({ id: 'git:merge', label: `${t.btnCommit} Merge`, category: t.gitTitle, action: () => openModal({ type: 'merge' }) });
    registerCommand({ id: 'git:resetSoft', label: 'Reset Soft (HEAD~1)', category: 'Git (Advanced)', action: () => useRepositoryStore.getState().resetTo('soft', 'HEAD~1') });
    registerCommand({ id: 'git:resetMixed', label: 'Reset Mixed (HEAD~1)', category: 'Git (Advanced)', action: () => useRepositoryStore.getState().resetTo('mixed', 'HEAD~1') });
    registerCommand({ id: 'git:resetHard', label: 'Reset Hard (HEAD~1) ⚠️', category: 'Git (Advanced)', action: () => useRepositoryStore.getState().resetTo('hard', 'HEAD~1') });
  }, [openModal, registerCommand, setActiveView, settings.general.language, t]);

  // Listen to native menu bar actions from Electron main process
  useEffect(() => {
    const unsubscribeMenu = (window as any).electron?.onMenuAction?.((action: string) => {
      switch (action) {
        case 'view:changes':    setActiveView('changes'); break;
        case 'view:history':    setActiveView('history'); break;
        case 'view:graph':      setActiveView('graph'); break;
        case 'view:branches':   setActiveView('branches'); break;
        case 'settings':        openModal({ type: 'settings' }); break;
        case 'reset-appearance':
          useSettingsStore.getState().applySettings({
            ...useSettingsStore.getState().settings,
            appearance: DEFAULT_SETTINGS.appearance,
          });
          applyAppearanceToDOM(DEFAULT_SETTINGS.appearance);
          break;
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
            {activeView === 'tags' && <TagsView />}
            {activeView === 'remotes' && <RemotesView />}
            {activeView !== 'changes' && activeView !== 'history' && activeView !== 'branches' && activeView !== 'graph' && activeView !== 'stash' && activeView !== 'tags' && activeView !== 'remotes' && (
              <div style={{ padding: '20px' }}>Content for view: {activeView}</div>
            )}
          </Suspense>
        </AppShell>
      )}
      <CommandPalette />
      <SettingsModal isOpen={modal.type === 'settings'} onClose={closeModal} />
      <NewBranchModal isOpen={modal.type === 'new-branch'} onClose={closeModal} />
      <MergeModal isOpen={modal.type === 'merge'} onClose={closeModal} />
    </>
  );
}

