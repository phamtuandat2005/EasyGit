import React, { useState } from 'react';
import { useRepositoryStore, useSettingsStore } from '../../store';
import { TRANSLATIONS } from '../../i18n/translations';
import { Button } from '../ui/Button';
import styles from './CommitComposer.module.css';

export function CommitComposer() {
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const { stagedChanges } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];

  const isReady = stagedChanges.length > 0 && message.trim().length > 0;

  return (
    <div className={styles.composer}>
      <div className={styles.header}>
        <span className={styles.stagedCount}>
          {t.stagedFilesCount(stagedChanges.length)}
        </span>
      </div>
      
      <div className={styles.inputs}>
        <input 
          type="text" 
          placeholder={t.commitMsgPlaceholder} 
          className={styles.messageInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <textarea 
          placeholder={t.commitDescPlaceholder} 
          className={styles.descriptionInput}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className={styles.actions}>
        <Button 
          variant="primary" 
          disabled={!isReady}
        >
          {t.btnCommit}
        </Button>
        <Button 
          variant="secondary" 
          disabled={!isReady}
        >
          {t.btnCommitPush}
        </Button>
      </div>
    </div>
  );
}
