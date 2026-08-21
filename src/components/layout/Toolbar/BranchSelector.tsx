import React from 'react';
import { useRepositoryStore } from '../../../store';
import styles from './Toolbar.module.css';

export function BranchSelector() {
  const { currentBranch, name } = useRepositoryStore();

  return (
    <div className={styles.branchSelector}>
      <span className={styles.repoName}>{name}</span>
      <span className={styles.separator}>/</span>
      <span className={styles.branchName}>{currentBranch}</span>
      <span className={styles.dropdownIcon}>▼</span>
    </div>
  );
}
