import React from 'react';
import { useRepositoryStore, useUIStore } from '../../../store';
import { GitOperationTerminal } from '../../git/GitOperationTerminal';
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
  const sidebarCollapsed = useUIStore(s => s.sidebarCollapsed);
  const { toasts, removeToast } = useUIStore();
  const isPanelOpen = !!selectedFile && !!contextPanel;

  const [panelWidth, setPanelWidth] = React.useState(500);
  const isResizing = React.useRef(false);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = document.body.clientWidth - e.clientX;
    if (newWidth > 300 && newWidth < 1000) {
      setPanelWidth(newWidth);
    }
  }, []);

  const stopResizing = React.useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'default';
  }, [handleMouseMove]);

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize';
  }, [handleMouseMove, stopResizing]);

  return (
    <div className={styles.container}>
      <div className={styles.toastViewport}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}
            onClick={() => removeToast(toast.id)}
          >
            <div className={styles.toastTitle}>{toast.title}</div>
            {toast.message && <div className={styles.toastMessage}>{toast.message}</div>}
          </div>
        ))}
      </div>
      <div className={sidebarCollapsed ? styles.sidebarHidden : styles.sidebar}>
        {sidebar}
      </div>
      <div className={styles.main}>
        <div className={styles.toolbar}>
          {toolbar}
        </div>
        <div className={styles.workspace}>
          <div className={styles.content}>
            <div className={styles.viewContent}>{children}</div>
          </div>
          {isPanelOpen && (
            <>
              <div 
                className={styles.resizer} 
                onMouseDown={startResizing}
              />
              <div 
                className={styles.contextPanel} 
                style={{ width: `${panelWidth}px` }}
              >
                {contextPanel}
              </div>
            </>
          )}
        </div>
        <div className={styles.dock}>
          <GitOperationTerminal />
        </div>
        <div className={styles.statusbar}>
          {statusbar}
        </div>
      </div>
    </div>
  );
}
