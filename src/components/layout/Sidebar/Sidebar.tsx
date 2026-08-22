import React, { useState } from 'react';
import { useUIStore, useRepositoryStore, useSettingsStore } from '../../../store';
import { TRANSLATIONS } from '../../../i18n/translations';
import styles from './Sidebar.module.css';

// ─── SVG Icons (VS Code style) ───────────────────────────────────────────────
const IconChanges = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1 3h14v1H1V3zm0 5h14v1H1V8zm0 5h14v1H1v-1z"/>
    <circle cx="13" cy="3.5" r="2.5" fill="var(--icon-modified)"/>
  </svg>
);
const IconHistory = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2zm-.5 2.5v4.25l3.5 2-.5.866L7 9V4.5h.5z"/>
  </svg>
);
const IconGraph = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="3" cy="4" r="2"/><circle cx="13" cy="4" r="2"/><circle cx="8" cy="12" r="2"/>
    <path d="M5 4h6M3 6v4.5M13 6v4.5M5 12h6" stroke="currentColor" strokeWidth="1.2" fill="none"/>
  </svg>
);
const IconBranch = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm8-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM8 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM4 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-2 2a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
    <path d="M4 6v4M10 6c0 2.5-1.5 4-4 4" stroke="currentColor" strokeWidth="1.2" fill="none"/>
  </svg>
);
const IconStash = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1L1 5v6l7 4 7-4V5L8 1zm0 1.18L14 6l-6 3.44L2 6l6-3.82zM2 7.12l5.5 3.15V14L2 10.85V7.12zm7.5 3.15L14 7.12v3.73L9.5 14v-3.73z"/>
  </svg>
);
const IconTag = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1 2h7l7 6-7 6H1l7-6-7-6zm1 1.18L7.5 8 2 12.82V3.18z"/>
  </svg>
);
const IconRemote = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1c.9 0 1.9.8 2.7 2.3.3.6.6 1.3.8 2.2H4.5c.2-.9.5-1.6.8-2.2C6.1 2.8 7.1 2 8 2zM2.1 7h3.3c-.1.65-.1 1.35 0 2H2.1A5.9 5.9 0 0 1 2 8c0-.35.03-.68.1-1zm.5 3h2.8c.2.9.5 1.7.9 2.3A6 6 0 0 1 2.6 10zm8.9 2.3c.4-.6.7-1.4.9-2.3h2.8a6 6 0 0 1-3.7 2.3zm1.3-3.3h-3.4c.1-.65.1-1.35 0-2h3.4c.07.32.1.65.1 1s-.03.68-.1 1zM11.6 6c-.2-.9-.5-1.6-.8-2.2A6 6 0 0 1 13.4 6h-1.8z"/>
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.1.9l-.4 1.7a5.5 5.5 0 0 0-1.4 0L6.9.9l-1.8.7.3 1.7A5.5 5.5 0 0 0 4.3 4.4L2.6 4l-.7 1.8 1.4.9a5.5 5.5 0 0 0 0 2.6L1.9 10.2l1.7 1.7 1.3-1.4a5.5 5.5 0 0 0 1.4.6l.4 1.7h2.6l.4-1.7a5.5 5.5 0 0 0 1.4-.6l1.3 1.4 1.7-1.7-1.4-1.3a5.5 5.5 0 0 0 .6-1.4l1.7-.4V6.1l-1.7-.4a5.5 5.5 0 0 0-.6-1.4l1.4-1.3-1.7-1.7-1.3 1.4A5.5 5.5 0 0 0 9.7 2L9.1.9zM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
  </svg>
);
const IconChevron = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
    style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 150ms ease', flexShrink: 0 }}
  >
    <path d="M3 2l4 3-4 3V2z"/>
  </svg>
);

// ─── Section Component ────────────────────────────────────────────────────────
function Section({ title, children, defaultExpanded = false }: {
  title: string; children: React.ReactNode; defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={() => setExpanded(!expanded)}>
        <IconChevron expanded={expanded} />
        <span className={styles.sectionTitle}>{title}</span>
      </div>
      {expanded && <div className={styles.sectionItems}>{children}</div>}
    </div>
  );
}

// ─── Nav Item Component ───────────────────────────────────────────────────────
function NavItem({ icon, label, active, badge, count, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean;
  badge?: number; count?: number; onClick: () => void;
}) {
  return (
    <div className={`${styles.navItem} ${active ? styles.active : ''}`} onClick={onClick}>
      <span className={styles.navIcon}>{icon}</span>
      <span className={styles.navLabel}>{label}</span>
      {badge != null && badge > 0 && <span className={styles.badge}>{badge}</span>}
      {count != null && count > 0 && !badge && <span className={styles.count}>{count}</span>}
    </div>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export function Sidebar() {
  const { activeView, setActiveView, openModal } = useUIStore();
  const { stagedChanges, unstagedChanges, commits, branches, stashes } = useRepositoryStore();
  const { settings } = useSettingsStore();
  const t = TRANSLATIONS[settings.general.language] || TRANSLATIONS['English'];

  const totalChanges = stagedChanges.length + unstagedChanges.length;

  return (
    <div className={styles.sidebar}>
      {/* Navigation */}
      <div className={styles.navigation}>
        <Section title={t.navWorkspace} defaultExpanded>
          <NavItem icon={<IconChanges />} label={t.navChanges}   active={activeView === 'changes'}  badge={totalChanges}   onClick={() => setActiveView('changes')} />
          <NavItem icon={<IconHistory />} label={t.navHistory}   active={activeView === 'history'}  count={commits.length} onClick={() => setActiveView('history')} />
          <NavItem icon={<IconGraph   />} label={t.navGraph}     active={activeView === 'graph'}                           onClick={() => setActiveView('graph')} />
        </Section>

        <Section title={t.navRepository}>
          <NavItem icon={<IconBranch />} label={t.navBranches} active={activeView === 'branches'} count={branches.length} onClick={() => setActiveView('branches')} />
          <NavItem icon={<IconStash  />} label={t.navStashes}  active={activeView === 'stash'}    count={stashes.length}  onClick={() => setActiveView('stash')} />
          <NavItem icon={<IconTag    />} label={t.navTags}     active={activeView === 'tags'}                              onClick={() => setActiveView('tags')} />
          <NavItem icon={<IconRemote />} label={t.navRemotes}  active={activeView === 'remotes'}                          onClick={() => setActiveView('remotes')} />
        </Section>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerItem} onClick={() => openModal({ type: 'settings' })}>
          <IconSettings />
          <span>{t.navSettings}</span>
        </div>
      </div>
    </div>
  );
}


