import React from 'react';
import { useRepositoryStore } from '../../../store';
import styles from './AppShell.module.css';

interface AppShellProps {
  sidebar: React.ReactNode;
  toolbar: React.ReactNode;
  statusbar: React.ReactNode;
  contextPanel?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ sidebar, toolbar, statusbar, contextPanel, children }: AppShellProps) {
  const selectedFile = useRepositoryStore(s => s.selectedFile);
  const isPanelOpen = !!selectedFile && !!contextPanel;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {sidebar}
      </div>
      <div className={styles.main}>
        <div className={styles.toolbar}>
          {toolbar}
        </div>
        <div className={styles.workspace}>
          <div className={styles.content}>
            {children}
          </div>
          <div className={isPanelOpen ? styles.contextPanel : styles.contextPanelHidden}>
            {contextPanel}
          </div>
        </div>
        <div className={styles.statusbar}>
          {statusbar}
        </div>
      </div>
    </div>
  );
}
