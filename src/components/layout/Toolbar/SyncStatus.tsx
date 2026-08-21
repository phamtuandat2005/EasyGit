import React from 'react';
import { useRepositoryStore } from '../../../store';
import styles from './Toolbar.module.css';

export function SyncStatus() {
  const { ahead, behind } = useRepositoryStore();

  if (ahead === 0 && behind === 0) {
    return (
      <div className={styles.syncStatus} title="Up to date">
        <span className={styles.syncIcon}>✓</span>
      </div>
    );
  }

  return (
    <div className={styles.syncStatus} title={`${ahead} ahead, ${behind} behind`}>
      {ahead > 0 && <span className={styles.syncAhead}>↑ {ahead}</span>}
      {behind > 0 && <span className={styles.syncBehind}>↓ {behind}</span>}
    </div>
  );
}
