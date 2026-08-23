import React from 'react';
import { useRepositoryStore } from '../store';
import { formatDate } from '../utils/format';
import styles from './TagsView.module.css';
import { useUiTranslation } from '../i18n/ui-translations';

export default function TagsView() {
  const { tags } = useRepositoryStore();
  const t = useUiTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>{t('tags')}</h2>
          <span className={styles.subtitle}>{t('tagCount', { count: tags.length })}</span>
        </div>
      </div>

      <div className={styles.content}>
        {tags.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>{t('noTags')}</strong>
            <span>{t('tagHint')}</span>
          </div>
        ) : (
          <div className={styles.list}>
            {tags.map((tag) => (
              <div className={styles.row} key={tag.name}>
                <div className={styles.icon}>#</div>
                <div className={styles.info}>
                  <strong>{tag.name}</strong>
                  <span>{tag.message || t('lightweightTag')}</span>
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
