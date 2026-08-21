import React from 'react';
import type { GitFileDiff } from '../../types/git';
import styles from './DiffViewer.module.css';

interface DiffViewerProps {
  diff: GitFileDiff;
}

export function DiffViewer({ diff }: DiffViewerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.filename}>{diff.newPath}</span>
        <div className={styles.stats}>
          <span className={styles.additions}>+{diff.additions}</span>
          <span className={styles.deletions}>-{diff.deletions}</span>
        </div>
      </div>
      
      <div className={styles.content}>
        {diff.hunks.map((hunk, i) => (
          <div key={i} className={styles.hunk}>
            <div className={styles.hunkHeader}>{hunk.header}</div>
            <div className={styles.hunkLines}>
              {hunk.lines.map((line, j) => {
                let typeClass = '';
                if (line.type === 'add') typeClass = styles.addition;
                else if (line.type === 'delete') typeClass = styles.deletion;
                else if (line.type === 'context') typeClass = styles.context;
                
                return (
                  <div key={j} className={`${styles.line} ${typeClass}`}>
                    <div className={styles.lineNumbers}>
                      <span className={styles.oldLine}>{line.oldLineNumber || ' '}</span>
                      <span className={styles.newLine}>{line.newLineNumber || ' '}</span>
                    </div>
                    <div className={styles.lineContent}>
                      <span className={styles.linePrefix}>
                        {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' '}
                      </span>
                      <span>{line.content}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
