import React, { useState } from 'react';
import { useRepositoryStore } from '../../store';
import { Button } from '../ui/Button';
import styles from './CommitComposer.module.css';

export function CommitComposer() {
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const { stagedChanges } = useRepositoryStore();

  const isReady = stagedChanges.length > 0 && message.trim().length > 0;

  return (
    <div className={styles.composer}>
      <div className={styles.header}>
        <span className={styles.stagedCount}>
          {stagedChanges.length} staged {stagedChanges.length === 1 ? 'file' : 'files'}
        </span>
      </div>
      
      <div className={styles.inputs}>
        <input 
          type="text" 
          placeholder="Commit message (required)" 
          className={styles.messageInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <textarea 
          placeholder="Description (optional)" 
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
          Commit
        </Button>
        <Button 
          variant="secondary" 
          disabled={!isReady}
        >
          Commit & Push
        </Button>
      </div>
    </div>
  );
}
