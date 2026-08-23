import React, { useEffect, useMemo, useRef } from 'react';
import { useUIStore } from '../../store';
import { Button } from '../ui/Button';
import styles from './GitOperationTerminal.module.css';

export function GitOperationTerminal() {
  const { gitTerminalOpen, gitTerminalExpanded, gitOperations, clearGitTerminal, toggleGitTerminal } = useUIStore();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gitTerminalOpen) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [gitTerminalOpen, gitOperations]);

  const latest = gitOperations[0];

  const copyCommand = async () => {
    if (!latest?.command) return;
    await navigator.clipboard.writeText(latest.command);
  };

  const statusLabel = useMemo(() => {
    if (!latest) return 'Idle';
    return latest.status.charAt(0).toUpperCase() + latest.status.slice(1);
  }, [latest]);

  if (!gitTerminalOpen) return null;

  return (
    <div className={`${styles.drawer} ${gitTerminalExpanded ? styles.expanded : styles.collapsed}`}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Git Operation Terminal</div>
          <div className={styles.subtitle}>
            {latest ? `${statusLabel}${latest.durationMs != null ? ` · ${latest.durationMs}ms` : ''}` : 'No operations yet'}
          </div>
        </div>
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={copyCommand} disabled={!latest}>Copy Command</Button>
          <Button variant="ghost" size="sm" onClick={clearGitTerminal}>Clear</Button>
          <Button variant="ghost" size="sm" onClick={toggleGitTerminal}>{gitTerminalExpanded ? 'Collapse' : 'Expand'}</Button>
        </div>
      </div>

      {gitTerminalExpanded && (
        <div className={styles.body}>
          {gitOperations.length === 0 ? (
            <div className={styles.empty}>Run a Git action to see the real CLI output here.</div>
          ) : (
            gitOperations.map((op) => (
              <div key={op.id} className={styles.entry}>
                <div className={styles.meta}>
                  <span className={`${styles.badge} ${styles[op.status]}`}>{op.status.toUpperCase()}</span>
                  <span>{new Date(op.startedAt).toLocaleTimeString()}</span>
                  {op.durationMs != null && <span>{op.durationMs}ms</span>}
                </div>
                <pre className={styles.command}>$ {op.command}</pre>
                {op.explanation && <div className={styles.explanation}>→ {op.explanation}</div>}
                {op.output.length > 0 ? (
                  <pre className={styles.output}>{op.output.join('\n')}</pre>
                ) : (
                  <div className={styles.outputMuted}>(no output)</div>
                )}
                {(op.status === 'error' || op.status === 'warning') && op.error && (
                  <div className={styles.error}>{op.error}</div>
                )}
                {(op.stderr || op.error) && (
                  <div className={styles.stderr}>{op.stderr || op.error}</div>
                )}
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
