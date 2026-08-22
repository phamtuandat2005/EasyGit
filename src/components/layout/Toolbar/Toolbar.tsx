import React from 'react';
import { useRepositoryStore, useSettingsStore } from '../../../store';
import { TRANSLATIONS } from '../../../i18n/translations';
import { BranchSelector } from './BranchSelector';
import { SyncStatus } from './SyncStatus';
import { Button } from '../../ui/Button';
import styles from './Toolbar.module.css';

export function Toolbar() {
  const { path } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];

  if (!path) return <div className={styles.toolbar}></div>;

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" icon="📥">{t.btnPull}</Button>
          <Button variant="ghost" size="sm" icon="📤">{t.btnPush}</Button>
          <Button variant="ghost" size="sm" icon="🔄">{t.btnFetch}</Button>
          <div className={styles.divider} />
          <Button variant="ghost" size="sm" icon="📦">{t.btnStash}</Button>
        </div>
      </div>
      
      <div className={styles.center}>
        <BranchSelector />
      </div>
      
      <div className={styles.right}>
        <SyncStatus />
        <div className={styles.divider} />
        <Button variant="primary" size="sm">{t.btnNewBranch}</Button>
      </div>
    </div>
  );
}
