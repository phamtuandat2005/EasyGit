import React from 'react';
import { useRepositoryStore } from '../store';
import { ChangedFileRow } from '../components/git/ChangedFileRow';
import { CommitComposer } from '../components/git/CommitComposer';
import styles from './ChangesView.module.css';

export default function ChangesView() {
  const { unstagedChanges, stagedChanges } = useRepositoryStore();

  return (
    <div className={styles.container}>
      <div className={styles.fileLists}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Unstaged Changes</span>
            <span className={styles.countBadge}>{unstagedChanges.length}</span>
          </div>
          <div className={styles.fileList}>
            {unstagedChanges.length === 0 ? (
              <div className={styles.emptyState}>No unstaged changes</div>
            ) : (
              unstagedChanges.map(file => (
                <ChangedFileRow key={file.path} file={file} />
              ))
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Staged Changes</span>
            <span className={styles.countBadge}>{stagedChanges.length}</span>
          </div>
          <div className={styles.fileList}>
            {stagedChanges.length === 0 ? (
              <div className={styles.emptyState}>No staged changes</div>
            ) : (
              stagedChanges.map(file => (
                <ChangedFileRow key={file.path} file={file} />
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.composerArea}>
        <CommitComposer />
      </div>
    </div>
  );
}
