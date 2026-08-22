import React, { useState, useEffect, useRef } from 'react';
import { useUIStore, useRepositoryStore, useSettingsStore } from '../../store';
import { TRANSLATIONS } from '../../i18n/translations';
import { Button } from './Button';
import styles from './NewBranchModal.module.css';

interface NewBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewBranchModal({ isOpen, onClose }: NewBranchModalProps) {
  const { createBranch } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const { addToast } = useUIStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];
  
  const [branchName, setBranchName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setBranchName('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim() || isCreating) return;

    setIsCreating(true);
    const success = await createBranch(branchName.trim());
    setIsCreating(false);

    if (success) {
      addToast({ type: 'success', title: `Branch '${branchName}' created successfully` });
      onClose();
    } else {
      addToast({ type: 'error', title: `Failed to create branch '${branchName}'` });
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t.btnNewBranch}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            <div className={styles.inputGroup}>
              <label>Branch Name</label>
              <input 
                ref={inputRef}
                type="text"
                className={styles.input}
                value={branchName}
                onChange={e => setBranchName(e.target.value)}
                placeholder="e.g. feature/new-button"
              />
            </div>
          </div>
          
          <div className={styles.footer}>
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={!branchName.trim() || isCreating}>
              {isCreating ? 'Creating...' : 'Create Branch'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
