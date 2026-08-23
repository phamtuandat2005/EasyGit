import React from 'react';
import { useRepositoryStore } from '../store';
import styles from './RemotesView.module.css';
import { useUiTranslation } from '../i18n/ui-translations';

export default function RemotesView() {
  const { remotes } = useRepositoryStore();
  const t = useUiTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>{t('remotes')}</h2>
          <span className={styles.subtitle}>{t('remoteCount', { count: remotes.length })}</span>
        </div>
      </div>
      <div className={styles.content}>
        {remotes.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>{t('noRemotes')}</strong>
            <span>{t('remoteHint')}</span>
          </div>
        ) : (
          <div className={styles.list}>
            {remotes.map((remote) => (
              <div className={styles.row} key={remote.name}>
                <div className={styles.icon}>↔</div>
                <div className={styles.info}>
                  <strong>{remote.name}</strong>
                  <span>{t('fetchUrl')}: {remote.fetchUrl || t('notConfigured')}</span>
                  <span>{t('pushUrl')}: {remote.pushUrl || t('notConfigured')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}