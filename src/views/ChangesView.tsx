import React from 'react';
import { useRepositoryStore, useSettingsStore } from '../store';
import { TRANSLATIONS } from '../i18n/translations';
import { ChangedFileRow } from '../components/git/ChangedFileRow';
import { CommitComposer } from '../components/git/CommitComposer';
import styles from './ChangesView.module.css';

export default function ChangesView() {
  const { unstagedChanges, stagedChanges, stageAll, unstageAll } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];

  // UNSTAGED: checkbox = "Stage All" trigger. It's never checked (clicking it stages everything).
  // STAGED: checkbox = always checked (they're all staged). Unchecking triggers unstageAll.

  return (
    <div className={styles.container}>
      <div className={styles.fileLists}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <input
              type="checkbox"
              className={styles.selectAllCheckbox}
              checked={false}
              onChange={() => { if (unstagedChanges.length > 0) stageAll(); }}
              title="Stage all files"
              disabled={unstagedChanges.length === 0}
            />
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
            <input
              type="checkbox"
              className={styles.selectAllCheckbox}
              checked={stagedChanges.length > 0}
              onChange={() => { if (stagedChanges.length > 0) unstageAll(); }}
              title="Unstage all files"
              disabled={stagedChanges.length === 0}
            />
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

