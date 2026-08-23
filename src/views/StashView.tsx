import React, { useState } from 'react';
import { useRepositoryStore, useUIStore } from '../store';
import { formatDate } from '../utils/format';
import { Button } from '../components/ui/Button';
import styles from './StashView.module.css';
import { useUiTranslation } from '../i18n/ui-translations';

export default function StashView() {
  const { stashes, stash, stashPop, stashApply, stashDrop } = useRepositoryStore();
  const { addToast } = useUIStore();
  const ui = useUiTranslation();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [confirmDrop, setConfirmDrop] = useState<number | null>(null);

  const withLoading = async (key: string, fn: () => Promise<boolean>) => {
    setLoadingAction(key);
    const ok = await fn();
    setLoadingAction(null);
    return ok;
  };

  const handleStashAll = async () => {
    const ok = await withLoading('save', () => stash());
    if (ok) addToast({ type: 'success', title: ui('stashSaveSuccess') });
    else addToast({ type: 'error', title: ui('stashSaveFailed') });
  };

  const handleApply = async (index: number) => {
    const ok = await withLoading(`apply-${index}`, () => stashApply(index));
    if (ok) addToast({ type: 'success', title: `${ui('apply')} stash@{${index}}` });
    else addToast({ type: 'error', title: ui('applyFailed') });
  };

  const handlePop = async (index: number) => {
    const ok = await withLoading(`pop-${index}`, () => stashPop(index));
    if (ok) addToast({ type: 'success', title: `${ui('pop')} stash@{${index}}` });
    else addToast({ type: 'error', title: ui('popFailed') });
  };

  const handleDrop = async (index: number) => {
    const ok = await withLoading(`drop-${index}`, () => stashDrop(index));
    setConfirmDrop(null);
    if (ok) addToast({ type: 'success', title: `${ui('dropSuccess')} stash@{${index}}` });
    else addToast({ type: 'error', title: ui('dropFailed') });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{ui('stashes')}</h2>
        <Button
          variant="secondary"
          icon="📦"
          disabled={loadingAction === 'save'}
          onClick={handleStashAll}
        >
          {loadingAction === 'save' ? ui('loading') : ui('stashAllChanges')}
        </Button>
      </div>

      <div className={styles.content}>
        {stashes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>{ui('noStashes')}</h3>
            <p>{ui('noStashesDesc')}</p>
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
                  <span className={styles.filesChanged}>{stash.filesChanged}</span>
                  <div className={styles.statsDetails}>
                    <span className={styles.additions}>+{stash.additions}</span>
                    <span className={styles.deletions}>-{stash.deletions}</span>
                  </div>
                </div>

                <div className={styles.stashActions}>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!!loadingAction}
                    onClick={() => handleApply(stash.index)}
                  >
                    {loadingAction === `apply-${stash.index}` ? '...' : ui('apply')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!!loadingAction}
                    onClick={() => handlePop(stash.index)}
                  >
                    {loadingAction === `pop-${stash.index}` ? '...' : ui('pop')}
                  </Button>

                  {confirmDrop === stash.index ? (
                    <>
                      <Button variant="danger" size="sm" disabled={!!loadingAction} onClick={() => handleDrop(stash.index)}>
                        {loadingAction === `drop-${stash.index}` ? '...' : ui('confirm')}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDrop(null)}>{ui('cancel')}</Button>
                    </>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={!!loadingAction}
                      onClick={() => setConfirmDrop(stash.index)}
                    >
                      {ui('drop')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
