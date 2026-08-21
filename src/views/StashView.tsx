import React from 'react';
import { useRepositoryStore } from '../store';
import { formatDate } from '../utils/format';
import { Button } from '../components/ui/Button';
import styles from './StashView.module.css';

export default function StashView() {
  const { stashes } = useRepositoryStore();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Stashes</h2>
        <Button variant="secondary" icon="📦">Stash All Changes</Button>
      </div>

      <div className={styles.content}>
        {stashes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>No stashes found</h3>
            <p>You haven't stashed any changes yet.</p>
          </div>
        ) : (
          <div className={styles.stashList}>
            {stashes.map((stash) => (
              <div key={stash.index} className={styles.stashRow}>
                <div className={styles.stashIcon}>📦</div>
                
                <div className={styles.stashInfo}>
                  <div className={styles.stashMessage}>
                    stash@&#123;{stash.index}&#125;: {stash.message}
                  </div>
                  <div className={styles.stashMeta}>
                    <span className={styles.stashDate}>{formatDate(stash.date)}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.stashBranch}>on {stash.branch}</span>
                  </div>
                </div>

                <div className={styles.stashStats}>
                  <span className={styles.filesChanged}>{stash.filesChanged} files</span>
                  <div className={styles.statsDetails}>
                    <span className={styles.additions}>+{stash.additions}</span>
                    <span className={styles.deletions}>-{stash.deletions}</span>
                  </div>
                </div>
                
                <div className={styles.stashActions}>
                  <Button variant="primary" size="sm">Apply</Button>
                  <Button variant="ghost" size="sm">Pop</Button>
                  <Button variant="danger" size="sm">Drop</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
