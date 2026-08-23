import React from 'react';
import { useRepositoryStore } from '../../../store';
import { useUiTranslation } from '../../../i18n/ui-translations';
import styles from './StatusBar.module.css';

export function StatusBar() {
  const { path, isLoading } = useRepositoryStore();
  const t = useUiTranslation();

  return (
    <div className={styles.statusbar}>
      <div className={styles.left}>
        <span className={styles.item}>{path}</span>
      </div>
      <div className={styles.right}>
        {isLoading && <span className={styles.item}>{t('loading')}</span>}
        <span className={styles.item}>EasyGit 1.0.0</span>
      </div>
    </div>
  );
}
