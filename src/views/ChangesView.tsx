import React from 'react';
import { useRepositoryStore, useSettingsStore } from '../store';
import { TRANSLATIONS } from '../i18n/translations';
import { ChangedFileRow } from '../components/git/ChangedFileRow';
import { CommitComposer } from '../components/git/CommitComposer';
import styles from './ChangesView.module.css';

export default function ChangesView() {
  const { unstagedChanges, stagedChanges } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];

  return (
    <div className={styles.container}>
      <div className={styles.fileLists}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t.unstagedChanges}</span>
            <span className={styles.countBadge}>{unstagedChanges.length}</span>
          </div>
          <div className={styles.fileList}>
            {unstagedChanges.length === 0 ? (
              <div className={styles.emptyState}>{t.noUnstagedChanges}</div>
            ) : (
              unstagedChanges.map(file => (
                <ChangedFileRow key={file.path} file={file} />
              ))
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t.stagedChanges}</span>
            <span className={styles.countBadge}>{stagedChanges.length}</span>
          </div>
          <div className={styles.fileList}>
            {stagedChanges.length === 0 ? (
              <div className={styles.emptyState}>{t.noStagedChanges}</div>
            ) : (
              stagedChanges.map(file => (
                <ChangedFileRow key={file.path} file={file} />
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.composerArea}>
        <CommitComposer />
      </div>
    </div>
  );
}
