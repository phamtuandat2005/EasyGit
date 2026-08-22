import React from 'react';
import { useRepositoryStore, useSettingsStore, useUIStore } from '../store';
import { TRANSLATIONS } from '../i18n/translations';
import { Button } from '../components/ui/Button';
import styles from './BranchesView.module.css';

export default function BranchesView() {
  const { branches, remoteBranches, checkout } = useRepositoryStore();
  const { openModal } = useUIStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const handleCheckout = async (branchName: string) => {
    setIsCheckingOut(true);
    await checkout(branchName);
    setIsCheckingOut(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{t.navBranches || 'Branches'}</h2>
        <Button variant="primary" icon="+" onClick={() => openModal({ type: 'new-branch' })}>
          {t.btnNewBranch}
        </Button>
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={isCheckingOut}
                      onClick={() => handleCheckout(branch.name)}
                    >
                      Checkout
                    </Button>
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
                  {/* Remote branches often require checkout to a local branch, simplifed here for now */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={isCheckingOut}
                    onClick={() => handleCheckout(branch.name)}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
