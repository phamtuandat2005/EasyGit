import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRepositoryStore, useUIStore } from '../../store';
import { useUiTranslation } from '../../i18n/ui-translations';
import styles from './GitOperationTerminal.module.css';

type TabKey = 'command' | 'output' | 'history' | 'problems';

export function GitOperationTerminal() {
  const { gitTerminalOpen, gitOperations, clearGitTerminal, toggleGitTerminal } = useUIStore();
  const { path } = useRepositoryStore();
  const t = useUiTranslation();
  const endRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('command');

  useEffect(() => {
    if (!gitTerminalOpen) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [gitTerminalOpen, gitOperations]);

  const latest = gitOperations[gitOperations.length - 1];

  const statusLabel = useMemo(() => {
    if (!latest) return t('idle');
    return latest.status.charAt(0).toUpperCase() + latest.status.slice(1);
  }, [latest, t]);

  const copyCommand = async (command?: string) => {
    if (!command) return;
    await navigator.clipboard.writeText(command);
  };

  const visibleOperations = activeTab === 'history' ? gitOperations : latest ? [latest] : [];
  const recentOutput = latest?.output?.slice(-8) ?? [];

  const commandTarget = latest?.command ?? t('noOperations');
  const affectedFiles = latest?.command
    ? latest.command
        .split(' -- ')[1]
        ?.split(' ')
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 5) ?? []
    : [];

  if (!gitTerminalOpen) return null;

  return (
    <div className={styles.shell}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'command' ? styles.activeTab : ''}`} onClick={() => setActiveTab('command')}>
          {t('gitCommand')}
        </button>
        <button className={`${styles.tab} ${activeTab === 'output' ? styles.activeTab : ''}`} onClick={() => setActiveTab('output')}>
          {t('output')}
        </button>
        <button className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`} onClick={() => setActiveTab('history')}>
          {t('history')}
        </button>
        <button className={`${styles.tab} ${activeTab === 'problems' ? styles.activeTab : ''}`} onClick={() => setActiveTab('problems')}>
          {t('problems')}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.terminalPane}>
          <div className={styles.panelTitle}>
            <span className={styles.panelTitleText}>{t('executeHint')}</span>
            <div className={styles.headerActions}>
              <button className={styles.iconBtn} onClick={() => copyCommand(latest?.command)} disabled={!latest} title={t('copyCommand')}>
                ⧉
              </button>
              <button className={styles.iconBtn} onClick={clearGitTerminal} title={t('clear')}>
                ⌫
              </button>
              <button className={styles.iconBtn} onClick={toggleGitTerminal} title={t('collapse')}>
                ▾
              </button>
            </div>
          </div>

          <div className={styles.commandBox}>
            <div className={styles.commandLine}>
              <span className={styles.prompt}>PS {path ?? 'T:\\EasyGit'}</span>
              <span className={styles.commandText}>{commandTarget}</span>
            </div>
          </div>

          <div className={styles.log}>
            {activeTab === 'output' && latest ? (
              <div className={styles.entry}>
                <div className={styles.meta}>
                  <span className={`${styles.badge} ${styles[latest.status]}`}>{latest.status.toUpperCase()}</span>
                  <span>{new Date(latest.startedAt).toLocaleTimeString()}</span>
                  {latest.durationMs != null && <span>{latest.durationMs}ms</span>}
                </div>
                <pre className={styles.command}>$ {latest.command}</pre>
                {recentOutput.length > 0 ? (
                  <pre className={styles.output}>{recentOutput.join('\n')}</pre>
                ) : (
                  <div className={styles.outputMuted}>(no output)</div>
                )}
                {(latest.stderr || latest.error) && <div className={styles.stderr}>{latest.stderr || latest.error}</div>}
              </div>
            ) : visibleOperations.length === 0 ? (
              <div className={styles.empty}>{t('noOperations')}</div>
            ) : (
              visibleOperations.map((op) => (
                <div key={op.id} className={styles.entry}>
                  <div className={styles.meta}>
                    <span className={`${styles.badge} ${styles[op.status]}`}>{op.status.toUpperCase()}</span>
                    <span>{new Date(op.startedAt).toLocaleTimeString()}</span>
                    {op.durationMs != null && <span>{op.durationMs}ms</span>}
                  </div>
                  <div className={styles.commandRow}>
                    <pre className={styles.command}>$ {op.command}</pre>
                    <button
                      className={styles.copyBtn}
                      onClick={() => copyCommand(op.command)}
                      title={t('copyCommand')}
                      aria-label={t('copyCommand')}
                    >
                      ⧉
                    </button>
                  </div>
                  {op.explanation && <div className={styles.explanation}>→ {op.explanation}</div>}
                  {op.output.length > 0 ? (
                    <pre className={styles.output}>{op.output.join('\n')}</pre>
                  ) : (
                    <div className={styles.outputMuted}>(no output)</div>
                  )}
                  {(op.status === 'error' || op.status === 'warning') && op.error && <div className={styles.stderr}>{op.stderr || op.error}</div>}
                </div>
              ))
            )}
            {activeTab === 'problems' && (
              <div className={styles.empty}>{latest?.stderr || latest?.error || t('noAffectedFiles')}</div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div className={styles.infoPane}>
          <div className={styles.infoHeader}>
            <div className={styles.infoTitle}>{t('operationInfo')}</div>
            <button className={styles.closeBtn} onClick={clearGitTerminal} aria-label={t('clear')}>
              ×
            </button>
          </div>

          <div className={styles.infoBody}>
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>{t('stageChanges')}</div>
              <div className={styles.infoValue}>{t('stageChangesDesc')}</div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>{t('gitFlow')}</div>
              <div className={styles.flow}>
                <span className={styles.flowChip}>Working Tree</span>
                <span className={styles.flowArrow}>→</span>
                <span className={`${styles.flowChip} ${styles.flowActive}`}>Staging Area</span>
                <span className={styles.flowArrow}>→</span>
                <span className={styles.flowChip}>Next Commit</span>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>
                {t('affectedFiles')} {affectedFiles.length ? `(${affectedFiles.length})` : ''}
              </div>
              <div className={styles.fileList}>
                {affectedFiles.length > 0 ? (
                  affectedFiles.map((file) => (
                    <div key={file} className={styles.fileRow}>
                      <span className={styles.fileBadge}>M</span>
                      <span className={styles.fileName}>{file}</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyInline}>{t('noAffectedFiles')}</div>
                )}
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>{t('gitCommand')}</div>
              <div className={styles.commandStrip}>
                <div className={styles.commandStripText}>{commandTarget}</div>
                {latest?.command && (
                  <button
                    className={styles.copyBtnSmall}
                    onClick={() => copyCommand(latest.command)}
                    title={t('copyCommand')}
                    aria-label={t('copyCommand')}
                  >
                    ⧉
                  </button>
                )}
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>{t('status')}</div>
              <div className={styles.infoValue}>
                {latest ? `${statusLabel}${latest.durationMs != null ? ` · ${latest.durationMs}ms` : ''}` : t('idle')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
