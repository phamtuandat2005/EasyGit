import React from 'react';
import { useRepositoryStore, useSettingsStore } from '../../../store';
import { TRANSLATIONS } from '../../../i18n/translations';
import { DiffViewer } from '../../git/DiffViewer';
import type { GitFileDiff } from '../../../types/git';
import styles from './ContextPanel.module.css';

// Mock diff data for the prototype
const getMockDiff = (filePath: string): GitFileDiff => ({
  oldPath: filePath,
  newPath: filePath,
  isBinary: false,
  status: 'modified',
  additions: 15,
  deletions: 4,
  hunks: [
    {
      oldStart: 12, oldLines: 4, newStart: 12, newLines: 6,
      header: '@@ -12,7 +12,11 @@',
      lines: [
        { type: 'context', content: ' function calculateSyncState(local, remote) {', oldLineNumber: 12, newLineNumber: 12 },
        { type: 'context', content: '   if (!remote) return { ahead: 0, behind: 0 };', oldLineNumber: 13, newLineNumber: 13 },
        { type: 'delete', content: '-  return parseSync(local, remote);', oldLineNumber: 14 },
        { type: 'add', content: '+  const ahead = getAhead(local, remote);', newLineNumber: 14 },
        { type: 'add', content: '+  const behind = getBehind(local, remote);', newLineNumber: 15 },
        { type: 'add', content: '+', newLineNumber: 16 },
        { type: 'add', content: '+  return { ahead, behind };', newLineNumber: 17 },
        { type: 'context', content: ' }', oldLineNumber: 15, newLineNumber: 18 },
      ]
    }
  ]
});

export function ContextPanel() {
  const { selectedFile, selectFile } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];

  if (!selectedFile) {
    return null;
  }

  const diff = getMockDiff(selectedFile);

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
        <DiffViewer diff={diff} />
      </div>
    </div>
  );
}
