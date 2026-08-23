import React from 'react';
import { useRepositoryStore } from '../store';
import styles from './RemotesView.module.css';
<<<<<<< HEAD
import { useUiTranslation } from '../i18n/ui-translations';

export default function RemotesView() {
  const { remotes } = useRepositoryStore();
  const t = useUiTranslation();
=======

export default function RemotesView() {
  const { remotes } = useRepositoryStore();
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
<<<<<<< HEAD
          <h2>{t('remotes')}</h2>
          <span className={styles.subtitle}>{t('remoteCount', { count: remotes.length })}</span>
=======
          <h2>Remotes</h2>
          <span className={styles.subtitle}>{remotes.length} remote{remotes.length === 1 ? '' : 's'}</span>
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
        </div>
      </div>
      <div className={styles.content}>
        {remotes.length === 0 ? (
          <div className={styles.emptyState}>
<<<<<<< HEAD
            <strong>{t('noRemotes')}</strong>
            <span>{t('remoteHint')}</span>
=======
            <strong>No remotes configured</strong>
            <span>Add a remote to fetch and push this repository.</span>
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
          </div>
        ) : (
          <div className={styles.list}>
            {remotes.map((remote) => (
              <div className={styles.row} key={remote.name}>
                <div className={styles.icon}>↔</div>
                <div className={styles.info}>
                  <strong>{remote.name}</strong>
<<<<<<< HEAD
                  <span>{t('fetchUrl')}: {remote.fetchUrl || t('notConfigured')}</span>
                  <span>{t('pushUrl')}: {remote.pushUrl || t('notConfigured')}</span>
=======
                  <span>Fetch: {remote.fetchUrl || 'Not configured'}</span>
                  <span>Push: {remote.pushUrl || 'Not configured'}</span>
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}