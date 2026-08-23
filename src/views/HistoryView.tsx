import React from 'react';
import { useRepositoryStore } from '../store';
import { formatDate, shortHash, stringToColor } from '../utils/format';
import styles from './HistoryView.module.css';
import { useUiTranslation } from '../i18n/ui-translations';

export default function HistoryView() {
  const { commits, selectedCommitHash, selectCommit } = useRepositoryStore();
  const t = useUiTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.colGraph}>{t('graph')}</div>
        <div className={styles.colMessage}>{t('message')}</div>
        <div className={styles.colAuthor}>{t('author')}</div>
        <div className={styles.colDate}>{t('date')}</div>
        <div className={styles.colHash}>{t('hash')}</div>
      </div>
      
      <div className={styles.commitList}>
        {commits.map((commit) => (
          <div 
            key={commit.hash} 
            className={`${styles.commitRow} ${selectedCommitHash === commit.hash ? styles.selected : ''}`}
            onClick={() => selectCommit(commit.hash)}
          >
            <div className={styles.colGraph}>
              {/* Placeholder for Graph Node */}
              <div 
                className={styles.graphNodePlaceholder} 
                style={{ backgroundColor: stringToColor(commit.author) }} 
              />
            </div>
            
            <div className={styles.colMessage}>
              <span className={styles.messageText}>{commit.message}</span>
              {commit.refs.map(ref => (
                <span 
                  key={ref.name} 
                  className={`${styles.refBadge} ${styles[`ref-${ref.type}`]}`}
                >
                  {ref.name}
                </span>
              ))}
              {commit.parentHashes.length > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Parents: {commit.parentHashes.map((parent) => shortHash(parent)).join(', ')}
                </div>
              )}
            </div>
            
            <div className={styles.colAuthor}>
              <div className={styles.avatar} style={{ backgroundColor: stringToColor(commit.author) }}>
                {commit.author.charAt(0)}
              </div>
              <span className={styles.authorName}>{commit.author}</span>
            </div>
            
            <div className={styles.colDate}>
              {formatDate(commit.date)}
            </div>
            
            <div className={styles.colHash}>
              {commit.shortHash}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
