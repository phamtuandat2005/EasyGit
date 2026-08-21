import React from 'react';
import { useRepositoryStore } from '../../../store';
import { BranchSelector } from './BranchSelector';
import { SyncStatus } from './SyncStatus';
import { Button } from '../../ui/Button';
import styles from './Toolbar.module.css';

export function Toolbar() {
  const { path } = useRepositoryStore();

  if (!path) return <div className={styles.toolbar}></div>;

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" icon="📥">Pull</Button>
          <Button variant="ghost" size="sm" icon="📤">Push</Button>
          <Button variant="ghost" size="sm" icon="🔄">Fetch</Button>
          <div className={styles.divider} />
          <Button variant="ghost" size="sm" icon="📦">Stash</Button>
        </div>
      </div>
      
      <div className={styles.center}>
        <BranchSelector />
      </div>
      
      <div className={styles.right}>
        <SyncStatus />
        <div className={styles.divider} />
        <Button variant="primary" size="sm">New Branch</Button>
      </div>
    </div>
  );
}
