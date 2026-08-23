import React, { useState } from 'react';
import { useRepositoryStore } from '../../store';
import type { GitChangedFile } from '../../types/git';
import { getStatusLetter } from '../../utils/format';
import { Button } from '../ui/Button';
import styles from './ChangedFileRow.module.css';
import { useUiTranslation } from '../../i18n/ui-translations';

interface ChangedFileRowProps {
  file: GitChangedFile;
}

export function ChangedFileRow({ file }: ChangedFileRowProps) {
  const { stageFile, unstageFile, discardFile, selectFile, selectedFile } = useRepositoryStore();
  const [confirmDiscard, setConfirmDiscard] = useState(false);
<<<<<<< HEAD
  const t = useUiTranslation();
=======
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57

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
        {confirmDiscard ? (
          <>
            <Button
              variant="danger"
              size="sm"
              onClick={async (e) => {
                e.stopPropagation();
                await discardFile(file.path);
                setConfirmDiscard(false);
              }}
            >
<<<<<<< HEAD
              {t('confirm')}
=======
              Confirm
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setConfirmDiscard(false); }}
            >
<<<<<<< HEAD
              {t('cancel')}
            </Button>
          </>
=======
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setConfirmDiscard(true); }}
            title="Discard changes. This cannot be undone."
          >
            Discard
          </Button>
        )}
        {file.staged ? (
          <Button variant="ghost" size="sm" onClick={() => unstageFile(file.path)} icon="−">Unstage</Button>
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
        ) : (
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setConfirmDiscard(true); }}
            title={t('discard')}
          >
            {t('discard')}
          </Button>
        )}
        {file.staged ? (
          <Button variant="ghost" size="sm" onClick={() => unstageFile(file.path)} icon="−">{t('unstage')}</Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => stageFile(file.path)} icon="+">{t('stage')}</Button>
        )}
      </div>
    </div>
  );
}
