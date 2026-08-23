import React from 'react';
import { useRepositoryStore } from '../store';
import { formatDate } from '../utils/format';
import styles from './TagsView.module.css';
<<<<<<< HEAD
import { useUiTranslation } from '../i18n/ui-translations';

export default function TagsView() {
  const { tags } = useRepositoryStore();
  const t = useUiTranslation();
=======

export default function TagsView() {
  const { tags } = useRepositoryStore();
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
<<<<<<< HEAD
          <h2>{t('tags')}</h2>
          <span className={styles.subtitle}>{t('tagCount', { count: tags.length })}</span>
=======
          <h2>Tags</h2>
          <span className={styles.subtitle}>{tags.length} tag{tags.length === 1 ? '' : 's'}</span>
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
        </div>
      </div>
      <div className={styles.content}>
        {tags.length === 0 ? (
          <div className={styles.emptyState}>
<<<<<<< HEAD
            <strong>{t('noTags')}</strong>
            <span>{t('tagHint')}</span>
=======
            <strong>No tags found</strong>
            <span>Create a tag from a commit to mark a release point.</span>
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
          </div>
        ) : (
          <div className={styles.list}>
            {tags.map((tag) => (
              <div className={styles.row} key={tag.name}>
                <div className={styles.icon}>#</div>
                <div className={styles.info}>
                  <strong>{tag.name}</strong>
<<<<<<< HEAD
                  <span>{tag.message || t('lightweightTag')}</span>
=======
                  <span>{tag.message || 'Lightweight tag'}</span>
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
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