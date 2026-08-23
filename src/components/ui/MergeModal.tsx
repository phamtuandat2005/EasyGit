import React, { useState } from 'react';
import { useRepositoryStore, useUIStore } from '../../store';
import { Button } from './Button';
import styles from './MergeModal.module.css';

interface MergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MergeModal({ isOpen, onClose }: MergeModalProps) {
  const { branches, currentBranch, mergeBranch, isMerging, conflictedFiles, abortMerge, resolveConflict } =
    useRepositoryStore();
  const { addToast } = useUIStore();
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
      addToast({ type: 'success', title: 'Merge thành công', message: `Đã merge nhánh "${selectedBranch}" vào "${currentBranch}"` });
      onClose();
    } else if (result.hasConflict) {
      addToast({ type: 'warning', title: 'Xung đột (Conflict)', message: 'Có xung đột cần được giải quyết thủ công.', duration: 0 });
      // Don't close — show conflict panel below
    } else {
      addToast({ type: 'error', title: 'Merge thất bại', message: result.error ?? 'Đã có lỗi xảy ra.' });
    }
  };

  const handleAbort = async () => {
    setIsLoading(true);
    await abortMerge();
    setIsLoading(false);
    addToast({ type: 'info', title: 'Đã huỷ Merge' });
    onClose();
  };

  const handleResolve = async (filePath: string, resolution: 'ours' | 'theirs') => {
    await resolveConflict(filePath, resolution);
    addToast({ type: 'success', title: 'Đã giải quyết xung đột', message: filePath });
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && !isMerging && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>🔀</div>
          <div>
            <h2 className={styles.title}>
              {isMerging ? 'Xung đột cần giải quyết' : 'Merge Branch'}
            </h2>
            <p className={styles.subtitle}>
              {isMerging
                ? `${conflictedFiles.length} file đang bị xung đột`
                : `Đang ở nhánh: ${currentBranch}`}
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
                <strong>Merge Conflict!</strong>
                <p>Git không thể tự động merge các file dưới đây. Hãy chọn giữ phiên bản nào hoặc chỉnh sửa tay.</p>
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
                      ✓ Của tôi
                    </button>
                    <button
                      className={`${styles.resolveBtn} ${styles.theirs}`}
                      onClick={() => handleResolve(file, 'theirs')}
                      title={`Lấy code từ nhánh được merge vào`}
                    >
                      ↓ Của họ
                    </button>
                  </div>
                </div>
              ))}

              {conflictedFiles.length === 0 && (
                <div className={styles.conflictResolved}>
                  ✅ Tất cả xung đột đã được giải quyết! Bạn có thể commit để hoàn tất.
                </div>
              )}
            </div>

            <div className={styles.conflictFooter}>
              <Button variant="danger" onClick={handleAbort} disabled={isLoading}>
                ✕ Huỷ Merge
              </Button>
            </div>
          </div>
        ) : (
          /* Normal merge form */
          <div className={styles.body}>
            <div className={styles.field}>
              <label className={styles.label}>Chọn nhánh cần merge vào <strong>{currentBranch}</strong>:</label>
              <select
                id="merge-branch-select"
                className={styles.select}
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">-- Chọn một nhánh --</option>
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
                <span className={styles.hint}>Luôn tạo merge commit (không fast-forward)</span>
              </span>
            </label>

            {selectedBranch && (
              <div className={styles.preview}>
                <span className={styles.previewIcon}>💡</span>
                <code>git merge {noFF ? '--no-ff ' : ''}{selectedBranch}</code>
              </div>
            )}

            <div className={styles.footer}>
              <Button variant="ghost" onClick={onClose}>Huỷ</Button>
              <Button
                variant="primary"
                disabled={!selectedBranch || isLoading}
                onClick={handleMerge}
              >
                {isLoading ? 'Đang merge...' : `🔀 Merge "${selectedBranch || '?'}"`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
