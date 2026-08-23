import React, { useState } from 'react';
import { useRepositoryStore, useSettingsStore, useUIStore } from '../../store';
import { TRANSLATIONS } from '../../i18n/translations';
import { Button } from '../ui/Button';
import styles from './CommitComposer.module.css';
import { useUiTranslation } from '../../i18n/ui-translations';

export function CommitComposer() {
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);
  const { stagedChanges, commitChanges, push } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const { addToast } = useUIStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];
  const ui = useUiTranslation();

  const isReady = stagedChanges.length > 0 && message.trim().length > 0 && !isCommitting;

  const handleCommit = async (andPush = false) => {
    if (!isReady) return;
    setIsCommitting(true);
    
    const fullMessage = description.trim() ? `${message}\n\n${description}` : message;
    
    try {
      const ok = await commitChanges(fullMessage);
      if (ok) {
        setMessage('');
        setDescription('');
        addToast({ type: 'success', title: ui('commitSuccess') });
        
        if (andPush) {
          addToast({ type: 'info', title: `${t.btnPush}...` });
          const pushOk = await push();
          if (pushOk) {
            addToast({ type: 'success', title: ui('pushSuccess') });
          } else {
            addToast({ type: 'error', title: ui('pushFailed') });
          }
        }
      } else {
        addToast({ type: 'error', title: ui('commitFailed') });
      }
    } finally {
      setIsCommitting(false);
    }
  };

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
          disabled={isCommitting}
        />
        <textarea 
          placeholder={t.commitDescPlaceholder} 
          className={styles.descriptionInput}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={isCommitting}
        />
      </div>
      
      <div className={styles.actions}>
        <div style={{ flex: 1 }}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={async () => {
              if (window.confirm(ui('undoConfirm'))) {
                setIsCommitting(true);
                const ok = await useRepositoryStore.getState().undoCommit();
                if (ok) addToast({ type: 'success', title: ui('undoSuccess') });
                else addToast({ type: 'error', title: ui('undoFailed') });
                setIsCommitting(false);
              }
            }}
            disabled={isCommitting || useRepositoryStore.getState().commits.length === 0}
            title={ui('undo')}
          >
            ↩️ {ui('undo')}
          </Button>
        </div>
        <Button 
          variant="primary" 
          disabled={!isReady}
          onClick={() => handleCommit(false)}
        >
          {t.btnCommit}
        </Button>
        <Button 
          variant="secondary" 
          disabled={!isReady}
          onClick={() => handleCommit(true)}
        >
          {t.btnCommitPush}
        </Button>
      </div>
    </div>
  );
}
