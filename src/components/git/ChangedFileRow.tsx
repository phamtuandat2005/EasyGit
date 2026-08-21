import React from 'react';
import { useRepositoryStore } from '../../store';
import type { GitChangedFile } from '../../types/git';
import { getStatusLetter } from '../../utils/format';
import { Button } from '../ui/Button';
import styles from './ChangedFileRow.module.css';

interface ChangedFileRowProps {
  file: GitChangedFile;
}

export function ChangedFileRow({ file }: ChangedFileRowProps) {
  const { stageFile, unstageFile, selectFile, selectedFile } = useRepositoryStore();

  const handleToggleStage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (file.staged) {
      unstageFile(file.path);
    } else {
      stageFile(file.path);
    }
  };

  const statusClass = styles[`status-${file.status}`] || '';
  const isSelected = selectedFile === file.path;

  return (
    <div 
      className={`${styles.row} ${isSelected ? styles.selected : ''}`}
      onClick={() => selectFile(file.path)}
    >
      <div className={styles.checkboxWrapper}>
        <input 
          type="checkbox" 
          checked={file.staged} 
          onChange={handleToggleStage} 
          className={styles.checkbox}
        />
      </div>
      
      <div className={`${styles.statusIcon} ${statusClass}`} title={file.status}>
        {getStatusLetter(file.status)}
      </div>
      
      <div className={styles.fileInfo}>
        <span className={styles.filename}>{file.filename}</span>
        <span className={styles.directory}>{file.directory}</span>
      </div>
      
      <div className={styles.stats}>
        {file.additions > 0 && <span className={styles.additions}>+{file.additions}</span>}
        {file.deletions > 0 && <span className={styles.deletions}>-{file.deletions}</span>}
      </div>
      
      <div className={styles.actions}>
        {file.staged ? (
          <Button variant="ghost" size="sm" onClick={() => unstageFile(file.path)} icon="−">Unstage</Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => stageFile(file.path)} icon="+">Stage</Button>
        )}
      </div>
    </div>
  );
}
