import React from 'react';
import { useRepositoryStore } from '../store';
import { formatDate } from '../utils/format';
import styles from './TagsView.module.css';

export default function TagsView() {
  const { tags } = useRepositoryStore();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Tags</h2>
          <span className={styles.subtitle}>{tags.length} tag{tags.length === 1 ? '' : 's'}</span>
        </div>
      </div>
      <div className={styles.content}>
        {tags.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>No tags found</strong>
            <span>Create a tag from a commit to mark a release point.</span>
          </div>
        ) : (
          <div className={styles.list}>
            {tags.map((tag) => (
              <div className={styles.row} key={tag.name}>
                <div className={styles.icon}>#</div>
                <div className={styles.info}>
                  <strong>{tag.name}</strong>
                  <span>{tag.message || 'Lightweight tag'}</span>
                </div>
                <div className={styles.meta}>
                  <code>{tag.hash}</code>
                  {tag.date && <span>{formatDate(tag.date)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}