import React from 'react';
import { useUIStore, useRepositoryStore } from '../../../store';
import { SidebarSection } from './SidebarSection';
import { RepositorySwitcher } from './RepositorySwitcher';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { activeView, setActiveView } = useUIStore();
  const { status, stagedChanges, unstagedChanges, commits, branches, stashes } = useRepositoryStore();

  const totalChanges = stagedChanges.length + unstagedChanges.length;
  
  return (
    <div className={styles.sidebar}>
      <RepositorySwitcher />
      
      <div className={styles.navigation}>
        <SidebarSection id="workspace" title="Workspace" defaultExpanded>
          <div 
            className={`${styles.navItem} ${activeView === 'changes' ? styles.active : ''}`}
            onClick={() => setActiveView('changes')}
          >
            <span className={styles.icon}>📝</span>
            <span className={styles.label}>Changes</span>
            {totalChanges > 0 && <span className={styles.badge}>{totalChanges}</span>}
          </div>
          
          <div 
            className={`${styles.navItem} ${activeView === 'history' ? styles.active : ''}`}
            onClick={() => setActiveView('history')}
          >
            <span className={styles.icon}>🕒</span>
            <span className={styles.label}>History</span>
            <span className={styles.count}>{commits.length}</span>
          </div>

          <div 
            className={`${styles.navItem} ${activeView === 'graph' ? styles.active : ''}`}
            onClick={() => setActiveView('graph')}
          >
            <span className={styles.icon}>🕸️</span>
            <span className={styles.label}>Graph</span>
          </div>
        </SidebarSection>

        <SidebarSection id="repository" title="Repository">
          <div 
            className={`${styles.navItem} ${activeView === 'branches' ? styles.active : ''}`}
            onClick={() => setActiveView('branches')}
          >
            <span className={styles.icon}>🌿</span>
            <span className={styles.label}>Branches</span>
            <span className={styles.count}>{branches.length}</span>
          </div>
          
          <div 
            className={`${styles.navItem} ${activeView === 'stash' ? styles.active : ''}`}
            onClick={() => setActiveView('stash')}
          >
            <span className={styles.icon}>📦</span>
            <span className={styles.label}>Stashes</span>
            {stashes.length > 0 && <span className={styles.count}>{stashes.length}</span>}
          </div>

          <div 
            className={`${styles.navItem} ${activeView === 'tags' ? styles.active : ''}`}
            onClick={() => setActiveView('tags')}
          >
            <span className={styles.icon}>🏷️</span>
            <span className={styles.label}>Tags</span>
          </div>

          <div 
            className={`${styles.navItem} ${activeView === 'remotes' ? styles.active : ''}`}
            onClick={() => setActiveView('remotes')}
          >
            <span className={styles.icon}>☁️</span>
            <span className={styles.label}>Remotes</span>
          </div>
        </SidebarSection>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerItem}>
          <span className={styles.icon}>⚙️</span>
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}
