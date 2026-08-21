import React from 'react';
import { useRepositoryStore } from '../store';
import { Button } from '../components/ui/Button';
import styles from './BranchesView.module.css';

export default function BranchesView() {
  const { branches, remoteBranches, currentBranch } = useRepositoryStore();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Branches</h2>
        <Button variant="primary" icon="+">New Branch</Button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Local Branches</h3>
          <div className={styles.branchList}>
            {branches.map((branch) => (
              <div 
                key={branch.name} 
                className={`${styles.branchRow} ${branch.isCurrent ? styles.current : ''}`}
              >
                <div className={styles.branchIcon}>
                  {branch.isCurrent ? '✓' : '🌿'}
                </div>
                
                <div className={styles.branchInfo}>
                  <div className={styles.branchName}>{branch.name}</div>
                  {branch.tracking && (
                    <div className={styles.branchTracking}>
                      tracking {branch.tracking}
                    </div>
                  )}
                </div>

                <div className={styles.branchSync}>
                  {branch.ahead > 0 && <span className={styles.ahead}>↑ {branch.ahead}</span>}
                  {branch.behind > 0 && <span className={styles.behind}>↓ {branch.behind}</span>}
                </div>
                
                <div className={styles.branchActions}>
                  {!branch.isCurrent && (
                    <Button variant="ghost" size="sm">Checkout</Button>
                  )}
                  <Button variant="ghost" size="sm">...</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Remote Branches</h3>
          <div className={styles.branchList}>
            {remoteBranches.map((branch) => (
              <div key={branch.name} className={styles.branchRow}>
                <div className={styles.branchIcon}>☁️</div>
                <div className={styles.branchInfo}>
                  <div className={styles.branchName}>{branch.name}</div>
                </div>
                <div className={styles.branchActions}>
                  <Button variant="ghost" size="sm">Checkout</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
