import React from 'react';
import { useRepositoryStore } from '../../../store';
import styles from './StatusBar.module.css';

export function StatusBar() {
  const { path, isLoading } = useRepositoryStore();

  return (
    <div className={styles.statusbar}>
      <div className={styles.left}>
        <span className={styles.item}>{path}</span>
      </div>
      <div className={styles.right}>
        {isLoading && <span className={styles.item}>Loading...</span>}
        <span className={styles.item}>EasyGit 1.0.0</span>
      </div>
    </div>
  );
}
