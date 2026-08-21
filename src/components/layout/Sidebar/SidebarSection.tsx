import React from 'react';
import { useUIStore } from '../../../store';
import styles from './Sidebar.module.css';

interface SidebarSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function SidebarSection({ id, title, children, defaultExpanded = false }: SidebarSectionProps) {
  const { collapsedSections, toggleSection } = useUIStore();
  
  // If undefined in state, use defaultExpanded
  const isCollapsed = collapsedSections[id] ?? !defaultExpanded;

  return (
    <div className={styles.section}>
      <div 
        className={styles.sectionHeader} 
        onClick={() => toggleSection(id)}
      >
        <span className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ''}`}>
          ▼
        </span>
        <span className={styles.sectionTitle}>{title}</span>
      </div>
      
      {!isCollapsed && (
        <div className={styles.sectionContent}>
          {children}
        </div>
      )}
    </div>
  );
}
