import React from 'react';
import { useRepositoryStore, useSettingsStore, useUIStore } from '../../../store';
import { TRANSLATIONS } from '../../../i18n/translations';
import { BranchSelector } from './BranchSelector';
import { SyncStatus } from './SyncStatus';
import { Button } from '../../ui/Button';
import styles from './Toolbar.module.css';

// ─── SVG Icon for Layout Toggle ──────────────────────────────────────────────
const IconLayoutSidebar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zm1 0h3v10H3V3zm4 10h6V3H7v10z"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

export function Toolbar() {
  const { path, push, pull, fetch, refreshStatus } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const { sidebarCollapsed, toggleSidebar, addToast } = useUIStore();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];

  // ── Auto-refresh on window focus ─────────────────────────────────────────────
  React.useEffect(() => {
    if (!path) return;
    const onFocus = () => {
      refreshStatus();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [path, refreshStatus]);

  if (!path) return <div className={styles.toolbar}></div>;

  const handleNetworkAction = async (action: 'push' | 'pull' | 'fetch' | 'stash') => {
    setIsSyncing(true);
    let ok = false;
    try {
      if (action === 'push') ok = await push();
      else if (action === 'pull') ok = await pull();
      else if (action === 'fetch') ok = await fetch();
      else if (action === 'stash') ok = await useRepositoryStore.getState().stash();
      
      if (ok) {
        addToast({ type: 'success', title: `${action} successful` });
      } else {
        addToast({ type: 'error', title: `${action} failed` });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStatus();
    setIsRefreshing(false);
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <div className={styles.actions}>
          {sidebarCollapsed && (
            <>
              <button 
                className={styles.toggleBtn} 
                onClick={toggleSidebar} 
                title="Open Sidebar"
                aria-label="Open Sidebar"
              >
                <IconLayoutSidebar />
              </button>
              <div className={styles.divider} />
            </>
          )}
          <button
            className={`${styles.refreshBtn} ${isRefreshing ? styles.spinning : ''}`}
            onClick={handleRefresh}
            title="Refresh status (F5)"
            disabled={isRefreshing}
            aria-label="Refresh"
          >
            <IconRefresh />
          </button>
          <div className={styles.divider} />
          <Button variant="ghost" size="sm" icon="📥" onClick={() => handleNetworkAction('pull')} disabled={isSyncing}>{t.btnPull}</Button>
          <Button variant="ghost" size="sm" icon="📤" onClick={() => handleNetworkAction('push')} disabled={isSyncing}>{t.btnPush}</Button>
          <Button variant="ghost" size="sm" icon="🔄" onClick={() => handleNetworkAction('fetch')} disabled={isSyncing}>{t.btnFetch}</Button>
          <div className={styles.divider} />
          <Button variant="ghost" size="sm" icon="📦" onClick={() => handleNetworkAction('stash')} disabled={isSyncing}>{t.btnStash}</Button>
        </div>
      </div>
      
      <div className={styles.center}>
        <BranchSelector />
      </div>
      
      <div className={styles.right}>
        <SyncStatus />
        <div className={styles.divider} />
        <Button variant="primary" size="sm" onClick={() => useUIStore.getState().openModal({ type: 'new-branch' })}>
          {t.btnNewBranch}
        </Button>
      </div>
    </div>
  );
}
