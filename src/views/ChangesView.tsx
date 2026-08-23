import React, { useEffect, useState } from 'react';
import { useRepositoryStore, useSettingsStore } from '../store';
import { TRANSLATIONS } from '../i18n/translations';
import { ChangedFileRow } from '../components/git/ChangedFileRow';
import { CommitComposer } from '../components/git/CommitComposer';
import styles from './ChangesView.module.css';
import { useUiTranslation } from '../i18n/ui-translations';

export default function ChangesView() {
  const { unstagedChanges, stagedChanges, stageAll, unstageAll, stageFile, unstageFile, deleteFiles, restoreFiles, discardFile } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];
  const ui = useUiTranslation();
  const [menu, setMenu] = useState<{ file: any; x: number; y: number } | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  useEffect(() => {
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  }, []);

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
              title={`${ui('stage')} all`}
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
                <ChangedFileRow key={file.path} file={file} onContextMenu={(f, x, y) => { setMenu({ file: f, x, y }); setConfirmDiscard(false); }} />
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
              title={`${ui('unstage')} all`}
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
                <ChangedFileRow key={file.path} file={file} onContextMenu={(f, x, y) => { setMenu({ file: f, x, y }); setConfirmDiscard(false); }} />
              ))
            )}
          </div>
        </div>
      </div>

      {menu && (
        <div className={styles.contextMenu} style={{ left: menu.x, top: menu.y }} onClick={(e) => e.stopPropagation()}>
          {confirmDiscard ? (
            <button type="button" className={styles.contextItemDanger} onClick={async () => { await discardFile(menu.file.path); setConfirmDiscard(false); setMenu(null); }}>
              Confirm Discard
            </button>
          ) : (
            <button type="button" className={styles.contextItemDanger} onClick={() => setConfirmDiscard(true)}>
              Discard
            </button>
          )}
          <button type="button" className={styles.contextItem} onClick={async () => { await stageFile(menu.file.path); setMenu(null); }}>+ Stage</button>
          <button type="button" className={styles.contextItem} onClick={async () => { await unstageFile(menu.file.path); setMenu(null); }}>- Unstage</button>
          {(menu.file.status === 'deleted' || menu.file.staged) && (
            <button type="button" className={styles.contextItem} onClick={async () => { await restoreFiles([menu.file.path]); setMenu(null); }}>Restore</button>
          )}
          <button type="button" className={styles.contextItem} onClick={async () => { await deleteFiles([menu.file.path], { keepLocal: true }); setMenu(null); }}>Remove from Git, keep local</button>
          <button type="button" className={styles.contextItemDanger} onClick={async () => { await deleteFiles([menu.file.path]); setMenu(null); }}>Delete file</button>
        </div>
      )}
      
      <div className={styles.composerArea}>
        <CommitComposer />
      </div>
    </div>
  );
}

