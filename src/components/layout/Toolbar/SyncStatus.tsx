import React from 'react';
import { useRepositoryStore } from '../../../store';
import { useUiTranslation } from '../../../i18n/ui-translations';
import styles from './Toolbar.module.css';

export function SyncStatus() {
  const { ahead, behind } = useRepositoryStore();
  const t = useUiTranslation();

  if (ahead === 0 && behind === 0) {
    return (
      <div className={styles.syncStatus} title={t('upToDate')}>
        <span className={styles.syncIcon}>✓</span>
      </div>
    );
  }

  return (
    <div className={styles.syncStatus} title={t('aheadBehind', { ahead, behind })}>
      {ahead > 0 && <span className={styles.syncAhead}>↑ {ahead}</span>}
      {behind > 0 && <span className={styles.syncBehind}>↓ {behind}</span>}
    </div>
  );
}
