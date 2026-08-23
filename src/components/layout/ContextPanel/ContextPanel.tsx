import React, { useEffect, useState } from 'react';
import { useRepositoryStore, useSettingsStore } from '../../../store';
import { TRANSLATIONS } from '../../../i18n/translations';
import { DiffViewer } from '../../git/DiffViewer';
import type { GitFileDiff } from '../../../types/git';
import styles from './ContextPanel.module.css';

export function ContextPanel() {
  const { selectedFile, selectFile, getFileDiff, stagedChanges } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];
  const [diff, setDiff] = useState<GitFileDiff | null>(null);
  const [loading, setLoading] = useState(false);

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
    return null;
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
          <DiffViewer diff={diff} />
        ) : (
          <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>No diff available.</div>
        )}
      </div>
    </div>
  );
}
