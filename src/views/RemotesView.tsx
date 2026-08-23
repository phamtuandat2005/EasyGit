import React from 'react';
import { useRepositoryStore } from '../store';
import styles from './RemotesView.module.css';

export default function RemotesView() {
  const { remotes } = useRepositoryStore();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Remotes</h2>
          <span className={styles.subtitle}>{remotes.length} remote{remotes.length === 1 ? '' : 's'}</span>
        </div>
      </div>
      <div className={styles.content}>
        {remotes.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>No remotes configured</strong>
            <span>Add a remote to fetch and push this repository.</span>
          </div>
        ) : (
          <div className={styles.list}>
            {remotes.map((remote) => (
              <div className={styles.row} key={remote.name}>
                <div className={styles.icon}>↔</div>
                <div className={styles.info}>
                  <strong>{remote.name}</strong>
                  <span>Fetch: {remote.fetchUrl || 'Not configured'}</span>
                  <span>Push: {remote.pushUrl || 'Not configured'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}