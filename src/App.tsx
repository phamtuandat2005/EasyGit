import React, { Suspense, useEffect } from 'react';
import { useUIStore, useCommandStore } from './store';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { AppShell } from './components/layout/AppShell/AppShell';
import { Sidebar } from './components/layout/Sidebar/Sidebar';
import { Toolbar } from './components/layout/Toolbar/Toolbar';
import { StatusBar } from './components/layout/StatusBar/StatusBar';
import { ContextPanel } from './components/layout/ContextPanel/ContextPanel';
import { CommandPalette } from './components/ui/CommandPalette';
import ChangesView from './views/ChangesView';
import HistoryView from './views/HistoryView';
import BranchesView from './views/BranchesView';
import GraphView from './views/GraphView';
import StashView from './views/StashView';
import styles from './App.module.css';

// Lazy loaded views (to be created)
// ...


export function App() {
  useKeyboardShortcuts();
  
  const activeView = useUIStore(s => s.activeView);
  const setActiveView = useUIStore(s => s.setActiveView);
  const registerCommand = useCommandStore(s => s.registerCommand);

  useEffect(() => {
    registerCommand({ id: 'view:changes', label: 'Show Changes', category: 'Navigation', shortcut: 'Ctrl+1', action: () => setActiveView('changes') });
    registerCommand({ id: 'view:history', label: 'Show History', category: 'Navigation', shortcut: 'Ctrl+2', action: () => setActiveView('history') });
    registerCommand({ id: 'view:graph', label: 'Show Graph', category: 'Navigation', shortcut: 'Ctrl+3', action: () => setActiveView('graph') });
    registerCommand({ id: 'view:branches', label: 'Show Branches', category: 'Navigation', action: () => setActiveView('branches') });
    registerCommand({ id: 'view:stash', label: 'Show Stash', category: 'Navigation', action: () => setActiveView('stash') });
    registerCommand({ id: 'git:fetch', label: 'Fetch', category: 'Git', action: () => console.log('Fetch') });
    registerCommand({ id: 'git:pull', label: 'Pull', category: 'Git', action: () => console.log('Pull') });
    registerCommand({ id: 'git:push', label: 'Push', category: 'Git', action: () => console.log('Push') });
  }, []);

  return (
    <>
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
      <CommandPalette />
    </>
  );
}

