import React, { useState } from 'react';
import { useRepositoryStore } from '../store';
import styles from './WelcomeView.module.css';

const RecentKey = 'easygit:recent-repos';

function getRecents(): string[] {
  try { return JSON.parse(localStorage.getItem(RecentKey) ?? '[]'); }
  catch { return []; }
}

function addRecent(path: string) {
  const recents = getRecents().filter(p => p !== path);
  localStorage.setItem(RecentKey, JSON.stringify([path, ...recents].slice(0, 10)));
}

export function WelcomeView() {
  const { loadRepository, isLoadingRepo, repoError } = useRepositoryStore();
  const [recents] = useState(getRecents);

  const handleOpen = async () => {
    const electron = (window as any).electron;
    const path: string | null = await electron?.openDirectory();
    if (!path) return;
    const ok = await loadRepository(path);
    if (ok) addRecent(path);
  };

  const handleOpenRecent = async (path: string) => {
    const ok = await loadRepository(path);
    if (ok) addRecent(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Logo & Title */}
        <div className={styles.logoRow}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white" className={styles.logo}>
            <path d="M12 2C10 2 8.5 10 7 19c0 0 1.5.5 2.5-1 1-1.5 1.5-6 2.5-6 1 0 1.5 4.5 2.5 6 1 1.5 2.5 1 2.5 1C15.5 10 14 2 12 2z" />
          </svg>
          <h1 className={styles.title}>EasyGit IDE</h1>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={handleOpen} disabled={isLoadingRepo}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z"/>
            </svg>
            {isLoadingRepo ? 'Đang tải...' : 'Open Folder'}
          </button>

          <button className={styles.secondaryBtn} onClick={() => {}} disabled>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/>
            </svg>
            Clone Repository
          </button>
        </div>

        {/* Error */}
        {repoError && (
          <div className={styles.error}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm.75 7a.875.875 0 1 1 0-1.75A.875.875 0 0 1 8 11.5z"/>
            </svg>
            {repoError}
          </div>
        )}

        {/* Recent Repos */}
        {recents.length > 0 && (
          <div className={styles.recentsSection}>
            <p className={styles.recentsTitle}>Gần đây</p>
            <ul className={styles.recentsList}>
              {recents.map((p) => (
                <li key={p} className={styles.recentItem} onClick={() => handleOpenRecent(p)}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className={styles.recentIcon}>
                    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z"/>
                  </svg>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentName}>{p.split(/[\\/]/).pop()}</span>
                    <span className={styles.recentPath}>{p}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
