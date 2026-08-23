import React, { useState } from 'react';
import { useRepositoryStore, useSettingsStore, useUIStore } from '../store';
import { TRANSLATIONS } from '../i18n/translations';
import { Button } from '../components/ui/Button';
import styles from './BranchesView.module.css';

export default function BranchesView() {
  const { branches, remoteBranches, currentBranch, checkout, deleteBranch, renameBranch } = useRepositoryStore();
  const { openModal } = useUIStore();
  const { addToast } = useUIStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [renamingBranch, setRenamingBranch] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCheckout = async (branchName: string) => {
    setIsCheckingOut(true);
    const ok = await checkout(branchName);
    setIsCheckingOut(false);
    if (!ok) addToast({ type: 'error', title: 'Checkout thất bại', message: `Không thể chuyển sang nhánh "${branchName}"` });
  };

  const handleStartRename = (branchName: string) => {
    setRenamingBranch(branchName);
    setRenameValue(branchName);
  };

  const handleRename = async () => {
    if (!renamingBranch || !renameValue.trim() || renameValue === renamingBranch) {
      setRenamingBranch(null);
      return;
    }
    const ok = await renameBranch(renamingBranch, renameValue.trim());
    setRenamingBranch(null);
    if (ok) addToast({ type: 'success', title: 'Đổi tên thành công', message: `"${renamingBranch}" → "${renameValue.trim()}"` });
    else addToast({ type: 'error', title: 'Đổi tên thất bại' });
  };

  const handleDelete = async (branchName: string, force = false) => {
    const ok = await deleteBranch(branchName, force);
    setConfirmDelete(null);
    if (ok) addToast({ type: 'success', title: 'Đã xoá nhánh', message: `Nhánh "${branchName}" đã bị xoá.` });
    else addToast({ type: 'error', title: 'Xoá thất bại', message: 'Nhánh chưa được merge. Thử Force Delete?' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{t.navBranches || 'Branches'}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="🔀" onClick={() => openModal({ type: 'merge' })}>
            Merge
          </Button>
          <Button variant="primary" icon="+" onClick={() => openModal({ type: 'new-branch' })}>
            {t.btnNewBranch}
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Local Branches */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Local Branches</h3>
          <div className={styles.branchList}>
            {branches.map((branch) => (
              <div
                key={branch.name}
                className={`${styles.branchRow} ${branch.isCurrent ? styles.current : ''}`}
              >
                <div className={styles.branchIcon}>{branch.isCurrent ? '✓' : '🌿'}</div>

                <div className={styles.branchInfo}>
                  {/* Inline rename input */}
                  {renamingBranch === branch.name ? (
                    <div className={styles.renameRow}>
                      <input
                        className={styles.renameInput}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename();
                          if (e.key === 'Escape') setRenamingBranch(null);
                        }}
                        autoFocus
                      />
                      <Button variant="primary" size="sm" onClick={handleRename}>✓</Button>
                      <Button variant="ghost" size="sm" onClick={() => setRenamingBranch(null)}>✕</Button>
                    </div>
                  ) : (
                    <div className={styles.branchName}>{branch.name}</div>
                  )}
                  {branch.tracking && (
                    <div className={styles.branchTracking}>tracking {branch.tracking}</div>
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

                  {!branch.isCurrent && renamingBranch !== branch.name && (
                    <Button variant="ghost" size="sm" onClick={() => handleStartRename(branch.name)}>
                      ✏️
                    </Button>
                  )}

                  {!branch.isCurrent && (
                    <>
                      {confirmDelete === branch.name ? (
                        <div className={styles.deleteConfirm}>
                          <span>Xoá?</span>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(branch.name)}>
                            ✓ Xoá
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(branch.name, true)}>
                            Force
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                            Huỷ
                          </Button>
                        </div>
                      ) : (
                        <Button variant="danger" size="sm" onClick={() => setConfirmDelete(branch.name)}>
                          🗑️
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Branches */}
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
