import React, { useEffect, useState } from 'react';
import { useRepositoryStore, useSettingsStore } from '../../../store';
import { TRANSLATIONS } from '../../../i18n/translations';
import { DiffViewer } from '../../git/DiffViewer';
import type { GitFileDiff } from '../../../types/git';
import { Button } from '../../ui/Button';
import styles from './ContextPanel.module.css';

export function ContextPanel() {
  const { selectedFile, selectFile, getFileDiff, stagedChanges, commits, selectedCommitHash, deleteFiles } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];
  const [diff, setDiff] = useState<GitFileDiff | null>(null);
  const [loading, setLoading] = useState(false);
  const selectedCommit = commits.find((commit) => commit.hash === selectedCommitHash) ?? null;
  const isSelectedFileStaged = selectedFile ? stagedChanges.some(f => f.path === selectedFile) : false;

  useEffect(() => {
    if (!selectedFile) {
      setDiff(null);
      return;
    }

    const loadDiff = async () => {
      setLoading(true);
      // Check if file is staged to decide which diff to fetch
      const isStaged = stagedChanges.some(f => f.path === selectedFile);
      const realDiff = await getFileDiff(selectedFile, isStaged);
      setDiff(realDiff);
      setLoading(false);
    };

    loadDiff();
  }, [selectedFile, getFileDiff, stagedChanges]);

  if (!selectedFile) {
    if (!selectedCommit) return null;
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3>{t.fileDetails}</h3>
          <button className={styles.closeBtn} onClick={() => selectFile(null)} title={t.btnClosePanel}>
            x
          </button>
        </div>
        <div className={styles.content} style={{ padding: 20 }}>
          <div style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>
            <div><strong>{selectedCommit.shortHash}</strong></div>
            <div>{selectedCommit.message}</div>
            <div>{selectedCommit.author} | {selectedCommit.date}</div>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Parents: {selectedCommit.parentHashes.length ? selectedCommit.parentHashes.join(', ') : 'None (root commit)'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>{t.fileDetails}</h3>
        <button 
          className={styles.closeBtn} 
          onClick={() => selectFile(null)}
          title={t.btnClosePanel}
        >
          ×
        </button>
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading diff...</div>
        ) : diff ? (
          <>
            <DiffViewer diff={diff} />
            <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  if (!selectedFile) return;
                  await deleteFiles([selectedFile], { keepLocal: true });
                }}
              >
                Remove from Git, keep local
              </Button>
              {isSelectedFileStaged && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!selectedFile) return;
                    await deleteFiles([selectedFile]);
                  }}
                >
                  Delete file
                </Button>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>No diff available.</div>
        )}
      </div>
    </div>
  );
}
