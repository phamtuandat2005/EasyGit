import React from 'react';
import { useRepositoryStore } from '../../../store';
import styles from './Sidebar.module.css';

export function RepositorySwitcher() {
  const { name, path } = useRepositoryStore();

  return (
    <div className={styles.repoSwitcher}>
      <div className={styles.repoIcon}>
        📚
      </div>
      <div className={styles.repoInfo}>
        <div className={styles.repoName}>{name}</div>
        <div className={styles.repoPath} title={path}>{path}</div>
      </div>
      <div className={styles.repoSelector}>
        ↕
      </div>
    </div>
  );
}
