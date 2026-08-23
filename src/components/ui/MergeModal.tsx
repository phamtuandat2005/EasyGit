import React, { useState } from 'react';
import { useRepositoryStore, useUIStore } from '../../store';
import { Button } from './Button';
import styles from './MergeModal.module.css';
import { useSettingsStore } from '../../store';
import { TRANSLATIONS } from '../../i18n/translations';
import { useUiTranslation } from '../../i18n/ui-translations';

interface MergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MergeModal({ isOpen, onClose }: MergeModalProps) {
  const { branches, currentBranch, mergeBranch, isMerging, conflictedFiles, abortMerge, resolveConflict } =
    useRepositoryStore();
  const { addToast } = useUIStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS.English;
  const ui = useUiTranslation();
  const [selectedBranch, setSelectedBranch] = useState('');
  const [noFF, setNoFF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const mergeableBranches = branches.filter((b) => !b.isCurrent);

  const handleMerge = async () => {
    if (!selectedBranch) return;
    setIsLoading(true);
    const result = await mergeBranch(selectedBranch, noFF);
    setIsLoading(false);

    if (result.success) {
      addToast({ type: 'success', title: `${ui('merge')} ${ui('successful')}`, message: `${selectedBranch} → ${currentBranch}` });
      onClose();
    } else if (result.hasConflict) {
      addToast({ type: 'warning', title: ui('problems'), message: `${conflictedFiles.length}`, duration: 0 });
      // Don't close — show conflict panel below
    } else {
      addToast({ type: 'error', title: `${ui('merge')} ${ui('failed')}`, message: result.error });
    }
  };

  const handleAbort = async () => {
    setIsLoading(true);
    await abortMerge();
    setIsLoading(false);
    addToast({ type: 'info', title: `${ui('merge')} ${ui('cancel')}` });
    onClose();
  };

  const handleResolve = async (filePath: string, resolution: 'ours' | 'theirs') => {
    await resolveConflict(filePath, resolution);
    addToast({ type: 'success', title: `${ui('status')}: ${ui('successful')}`, message: filePath });
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && !isMerging && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>🔀</div>
          <div>
            <h2 className={styles.title}>
              {isMerging ? ui('problems') : ui('merge')}
            </h2>
            <p className={styles.subtitle}>
              {isMerging
                ? `${conflictedFiles.length}`
                : `${currentBranch}`}
            </p>
          </div>
          {!isMerging && (
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          )}
        </div>

        {/* Conflict resolution panel */}
        {isMerging ? (
          <div className={styles.conflictPanel}>
            <div className={styles.conflictWarning}>
              <span className={styles.conflictIcon}>⚠️</span>
              <div>
                <strong>{ui('problems')}</strong>
                <p>{ui('executeHint')}</p>
              </div>
            </div>

            <div className={styles.conflictList}>
              {conflictedFiles.map((file) => (
                <div key={file} className={styles.conflictRow}>
                  <span className={styles.conflictFile}>{file}</span>
                  <div className={styles.conflictActions}>
                    <button
                      className={`${styles.resolveBtn} ${styles.ours}`}
                      onClick={() => handleResolve(file, 'ours')}
                      title={`Giữ code của nhánh ${currentBranch}`}
                    >
                        ✓ {ui('confirm')}
                    </button>
                    <button
                      className={`${styles.resolveBtn} ${styles.theirs}`}
                      onClick={() => handleResolve(file, 'theirs')}
                      title={`Lấy code từ nhánh được merge vào`}
                    >
                        ↓ {ui('apply')}
                    </button>
                  </div>
                </div>
              ))}

              {conflictedFiles.length === 0 && (
                <div className={styles.conflictResolved}>
                  ✅ {ui('successful')}
                </div>
              )}
            </div>

            <div className={styles.conflictFooter}>
              <Button variant="danger" onClick={handleAbort} disabled={isLoading}>
                ✕ {t.btnCancel}
              </Button>
            </div>
          </div>
        ) : (
          /* Normal merge form */
          <div className={styles.body}>
            <div className={styles.field}>
              <label className={styles.label}>{ui('merge')} <strong>{currentBranch}</strong>:</label>
              <select
                id="merge-branch-select"
                className={styles.select}
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">-- {ui('checkout')} --</option>
                {mergeableBranches.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                    {b.ahead > 0 && ` (↑ ${b.ahead} commits)`}
                  </option>
                ))}
              </select>
            </div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={noFF}
                onChange={(e) => setNoFF(e.target.checked)}
              />
              <span>
                <strong>--no-ff</strong> &nbsp;
                <span className={styles.hint}>{ui('merge')}</span>
              </span>
            </label>

            {selectedBranch && (
              <div className={styles.preview}>
                <span className={styles.previewIcon}>💡</span>
                <code>git merge {noFF ? '--no-ff ' : ''}{selectedBranch}</code>
              </div>
            )}

            <div className={styles.footer}>
              <Button variant="ghost" onClick={onClose}>{t.btnCancel}</Button>
              <Button
                variant="primary"
                disabled={!selectedBranch || isLoading}
                onClick={handleMerge}
              >
                {isLoading ? `${ui('loading')}` : `🔀 ${ui('merge')} "${selectedBranch || '?'}"`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
