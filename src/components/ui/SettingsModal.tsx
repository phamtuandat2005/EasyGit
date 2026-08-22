import React, { useState, useEffect, useCallback } from 'react';
import { useSettingsStore, DEFAULT_SETTINGS, DEFAULT_SHORTCUTS, applyAppearanceToDOM } from '../../store';
import { TRANSLATIONS } from '../../i18n/translations';
import type { EasyGitSettings, ShortcutEntry } from '../../types/settings';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconSettings   = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconAppearance = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconGit        = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>;
const IconDiff       = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
const IconCommit     = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><circle cx="12" cy="12" r="4"/></svg>;
const IconBell       = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconKeyboard   = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>;
const IconPlugins    = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/></svg>;
const IconAdvanced   = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const IconInfo       = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;

// ── Reusable Primitives ───────────────────────────────────────────────────────

function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: string }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionIcon}>{icon}</span>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {badge && <span className={styles.sectionBadge}>{badge}</span>}
    </div>
  );
}

function SubHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className={styles.sectionSubHeader}>{icon}{label}</div>;
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <div className={styles.settingLabel}>{label}</div>
        <div className={styles.settingDesc}>{desc}</div>
      </div>
      <div className={styles.settingControl}>{children}</div>
    </div>
  );
}

function RowWide({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <div className={styles.settingLabel}>{label}</div>
        <div className={styles.settingDesc}>{desc}</div>
      </div>
      <div className={styles.settingControlWide}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={styles.toggle}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className={styles.toggleSlider} />
    </label>
  );
}

function Sel({ value, options, onChange, width }: { value: string; options: string[]; onChange: (v: string) => void; width?: number }) {
  return (
    <select className={styles.select} value={value} onChange={e => onChange(e.target.value)} style={width ? { width } : undefined}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function Segmented({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className={styles.segmentedControl}>
      {options.map(o => (
        <button key={o} type="button" className={`${styles.segment} ${value === o ? styles.segmentActive : ''}`} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

// ── Inline confirm dialog (replaces window.confirm which fails in Electron) ───
function ConfirmDialog({ message, onConfirm, onCancel, t }: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  t: ReturnType<typeof useTranslation>;
}) {
  return (
    <div className={styles.confirmOverlay}>
      <div className={styles.confirmBox}>
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="var(--orange)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:12}}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <p className={styles.confirmMsg}>{message}</p>
        <div className={styles.confirmActions}>
          <button className={styles.cancelBtn} type="button" onClick={onCancel}>{t.btnCancel}</button>
          <button className={styles.dangerBtn} type="button" onClick={onConfirm}>{t.btnReset}</button>
        </div>
      </div>
    </div>
  );
}

// ── Translation hook ──────────────────────────────────────────────────────────
function useTranslation(lang: EasyGitSettings['general']['language']) {
  return TRANSLATIONS[lang] ?? TRANSLATIONS['English'];
}

// ── Toast notification (replaces alert()) ─────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  const show = useCallback((msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

function Toast({ toast }: { toast: { msg: string; type: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
      {toast.type === 'success' && <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>}
      {toast.msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: GENERAL
// ─────────────────────────────────────────────────────────────────────────────
function GeneralTab({ draft, setDraft, t }: {
  draft: EasyGitSettings;
  setDraft: React.Dispatch<React.SetStateAction<EasyGitSettings>>;
  t: ReturnType<typeof useTranslation>;
}) {
  const g = draft.general;
  const set = (patch: Partial<EasyGitSettings['general']>) => setDraft(d => ({ ...d, general: { ...d.general, ...patch } }));

  const handleBrowse = async () => {
    const dir = await window.electron?.openDirectory?.();
    if (dir) set({ defaultRepoDirectory: dir });
  };

  return (
    <div className={styles.section}>
      <SectionHeader icon={<IconSettings />} title={t.generalTitle} />
      <Row label={t.language} desc={t.languageDesc}>
        <Sel value={g.language} options={['English','Vietnamese','Japanese','Korean','Chinese']} onChange={v => set({ language: v as any })} />
      </Row>
      <Row label={t.startOnStartup} desc={t.startOnStartupDesc}>
        <Toggle checked={g.startOnStartup} onChange={v => set({ startOnStartup: v })} />
      </Row>
      <Row label={t.defaultRepoDir} desc={t.defaultRepoDirDesc}>
        <div className={styles.inputGroup}>
          <input type="text" className={styles.input} value={g.defaultRepoDirectory} onChange={e => set({ defaultRepoDirectory: e.target.value })} />
          <button type="button" className={styles.browseBtn} onClick={handleBrowse}>{t.btnBrowse}</button>
        </div>
      </Row>
      <Row label={t.checkForUpdates} desc={t.checkForUpdatesDesc}>
        <Toggle checked={g.checkForUpdates} onChange={v => set({ checkForUpdates: v })} />
      </Row>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: APPEARANCE
// ─────────────────────────────────────────────────────────────────────────────
function AppearanceTab({ draft, setDraft, t }: {
  draft: EasyGitSettings;
  setDraft: React.Dispatch<React.SetStateAction<EasyGitSettings>>;
  t: ReturnType<typeof useTranslation>;
}) {
  const a = draft.appearance;
  const set = (patch: Partial<EasyGitSettings['appearance']>) => setDraft(d => ({ ...d, appearance: { ...d.appearance, ...patch } }));

  // Live preview
  useEffect(() => { applyAppearanceToDOM(a); }, [a]);

  const COLORS: EasyGitSettings['appearance']['accentColor'][] = ['#1f6feb','#3fb950','#bc8cff','#d29922','#f85149','#39d2c0'];
  const themeOptions = [t.themeLight, t.themeDark, t.themeSystem];
  const themeMap: Record<string, EasyGitSettings['appearance']['theme']> = {
    [t.themeLight]: 'Light', [t.themeDark]: 'Dark', [t.themeSystem]: 'System',
  };
  const themeDisplayMap: Record<string, string> = { Light: t.themeLight, Dark: t.themeDark, System: t.themeSystem };

  return (
    <div className={styles.section}>
      <SectionHeader icon={<IconAppearance />} title={t.appearanceTitle} />
      <Row label={t.theme} desc={t.themeDesc}>
        <Segmented
          value={themeDisplayMap[a.theme] ?? a.theme}
          options={themeOptions}
          onChange={v => set({ theme: themeMap[v] ?? 'Dark' })}
        />
      </Row>
      <Row label={t.accentColor} desc={t.accentColorDesc}>
        <div className={styles.colorPicker}>
          {COLORS.map(c => (
            <button type="button" key={c} className={`${styles.colorBtn} ${a.accentColor === c ? styles.colorActive : ''}`} style={{ backgroundColor: c }} onClick={() => set({ accentColor: c })} />
          ))}
        </div>
      </Row>
      <Row label={t.fontSize} desc={t.fontSizeDesc}>
        <Sel value={a.fontSize} options={['12px','13px','14px','15px','16px']} onChange={v => set({ fontSize: v as any })} />
      </Row>
      <Row label={t.density} desc={t.densityDesc}>
        <Sel
          value={a.density === 'Comfortable' ? t.densityComfortable : a.density === 'Compact' ? t.densityCompact : t.densitySpacious}
          options={[t.densityComfortable, t.densityCompact, t.densitySpacious]}
          onChange={v => {
            const map: Record<string, EasyGitSettings['appearance']['density']> = {
              [t.densityComfortable]: 'Comfortable', [t.densityCompact]: 'Compact', [t.densitySpacious]: 'Spacious',
            };
            set({ density: map[v] ?? 'Comfortable' });
          }}
        />
      </Row>
      <Row label={t.enableAnimations} desc={t.enableAnimationsDesc}>
        <Toggle checked={a.enableAnimations} onChange={v => set({ enableAnimations: v })} />
      </Row>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: GIT
// ─────────────────────────────────────────────────────────────────────────────
function GitTab({ draft, setDraft, t, showToast }: {
  draft: EasyGitSettings;
  setDraft: React.Dispatch<React.SetStateAction<EasyGitSettings>>;
  t: ReturnType<typeof useTranslation>;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}) {
  const g = draft.git;
  const [detecting, setDetecting] = useState(false);
  const set = (patch: Partial<EasyGitSettings['git']>) => setDraft(d => ({ ...d, git: { ...d.git, ...patch } }));

  const handleDetect = async () => {
    setDetecting(true);
    await new Promise(r => setTimeout(r, 800));
    const commonPaths = [
      'C:\\Program Files\\Git\\bin\\git.exe',
      'C:\\Program Files (x86)\\Git\\bin\\git.exe',
      '/usr/bin/git', '/usr/local/bin/git',
    ];
    set({ gitExecutablePath: commonPaths[0] });
    setDetecting(false);
    showToast('Git detected: C:\\Program Files\\Git\\bin\\git.exe', 'success');
  };

  const handleBrowse = async () => {
    const path = await window.electron?.openDirectory?.();
    if (path) set({ gitExecutablePath: path });
  };

  const pullOptions = ['Merge', 'Rebase', 'Fast-forward only'];

  return (
    <>
      <div className={styles.section}>
        <SectionHeader icon={<IconGit />} title={t.gitTitle} badge={t.gitConfiguration} />
        <RowWide label={t.gitExePath} desc={t.gitExePathDesc}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWithIcon}>
              <span className={styles.inputPrefix}><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
              <input type="text" className={`${styles.input} ${styles.inputIconed}`} value={g.gitExecutablePath} onChange={e => set({ gitExecutablePath: e.target.value })} />
            </div>
            <button type="button" className={styles.browseBtn} onClick={handleBrowse}>{t.btnBrowse}</button>
            <button type="button" className={styles.detectBtn} onClick={handleDetect} disabled={detecting}>
              {detecting ? <span className={styles.spinner} /> : <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:5}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
              {detecting ? t.btnDetecting : t.btnDetectGit}
            </button>
          </div>
        </RowWide>
        <Row label={t.gitVersion} desc={t.gitVersionDesc}>
          <div className={styles.versionBadge}><span className={styles.versionDot} />Git 2.51.0</div>
        </Row>
        <Row label={t.defaultBranch} desc={t.defaultBranchDesc}>
          <input type="text" className={styles.inputSm} value={g.defaultBranchName} onChange={e => set({ defaultBranchName: e.target.value })} />
        </Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} label={t.userIdentity} />
        <Row label={t.userName} desc={t.userNameDesc}>
          <input type="text" className={styles.inputSm} value={g.userName} onChange={e => set({ userName: e.target.value })} placeholder="Your Name" />
        </Row>
        <Row label={t.userEmail} desc={t.userEmailDesc}>
          <input type="text" className={styles.inputSm} value={g.userEmail} onChange={e => set({ userEmail: e.target.value })} placeholder="you@example.com" />
        </Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>} label={t.fetchSync} />
        <Row label={t.autoFetch} desc={t.autoFetchDesc}>
          <Sel value={g.autoFetch} options={['Off','Every 5 minutes','Every 15 minutes','Every 30 minutes']} onChange={v => set({ autoFetch: v as any })} />
        </Row>
        <Row label={t.pruneStaleBranches} desc={t.pruneStaleBranchesDesc}>
          <Toggle checked={g.pruneStaleBranches} onChange={v => set({ pruneStaleBranches: v })} />
        </Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>} label={t.pushPull} />
        <Row label={t.pushBehavior} desc={t.pushBehaviorDesc}>
          <Sel value={g.pushBehavior} options={['Simple','Current Branch','Upstream','Matching']} onChange={v => set({ pushBehavior: v as any })} />
        </Row>
        <Row label={t.pullBehavior} desc={t.pullBehaviorDesc}>
          <Segmented value={g.pullBehavior} options={pullOptions} onChange={v => set({ pullBehavior: v as any })} />
        </Row>
        <Row label={t.autoStash} desc={t.autoStashDesc}>
          <Toggle checked={g.autoStashBeforePull} onChange={v => set({ autoStashBeforePull: v })} />
        </Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} label={t.security} />
        <Row label={t.signCommits} desc={t.signCommitsDesc}>
          <Toggle checked={g.signCommits} onChange={v => set({ signCommits: v })} />
        </Row>
        <Row label={t.signingFormat} desc={t.signingFormatDesc}>
          <Sel value={g.signingFormat} options={['GPG','SSH','X.509']} onChange={v => set({ signingFormat: v as any })} />
        </Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} label={t.gitConfigEditor} />
        <div className={styles.configEditorCard}>
          <div className={styles.configEditorInfo}>
            <div className={styles.configEditorTitle}><svg viewBox="0 0 24 24" width="14" height="14" stroke="var(--accent)" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>.gitconfig</div>
            <div className={styles.configEditorPath}>~/.gitconfig</div>
          </div>
          <div className={styles.configEditorActions}>
            <button type="button" className={styles.configBtn} onClick={() => window.electron?.openInEditor?.('~/.gitconfig')}>
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:5}}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {t.btnEditGlobalConfig}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: DIFF & MERGE
// ─────────────────────────────────────────────────────────────────────────────
function DiffTab({ draft, setDraft, t }: { draft: EasyGitSettings; setDraft: React.Dispatch<React.SetStateAction<EasyGitSettings>>; t: ReturnType<typeof useTranslation> }) {
  const d = draft.diff;
  const set = (patch: Partial<EasyGitSettings['diff']>) => setDraft(s => ({ ...s, diff: { ...s.diff, ...patch } }));
  const DIFF_TOOLS = ['EasyGit Built-in','VS Code','Beyond Compare','Meld','WinMerge'];
  const MERGE_TOOLS = ['EasyGit Built-in','VS Code','Beyond Compare','Vimdiff','P4Merge'];
  return (
    <>
      <div className={styles.section}>
        <SectionHeader icon={<IconDiff />} title={t.diffTitle} />
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>} label={t.diffTitle} />
        <Row label={t.diffView} desc={t.diffViewDesc}>
          <Segmented value={d.diffView} options={['Side-by-side','Unified']} onChange={v => set({ diffView: v as any })} />
        </Row>
        <Row label={t.ignoreWhitespace} desc={t.ignoreWhitespaceDesc}><Toggle checked={d.ignoreWhitespace} onChange={v => set({ ignoreWhitespace: v })} /></Row>
        <Row label={t.wordWrap} desc={t.wordWrapDesc}><Toggle checked={d.wordWrap} onChange={v => set({ wordWrap: v })} /></Row>
        <Row label={t.syntaxHighlighting} desc={t.syntaxHighlightingDesc}><Toggle checked={d.syntaxHighlighting} onChange={v => set({ syntaxHighlighting: v })} /></Row>
        <Row label={t.showLineNumbers} desc={t.showLineNumbersDesc}><Toggle checked={d.showLineNumbers} onChange={v => set({ showLineNumbers: v })} /></Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>} label={t.externalTools} />
        <Row label={t.externalDiffTool} desc={t.externalDiffToolDesc}><Sel value={d.externalDiffTool} options={DIFF_TOOLS} onChange={v => set({ externalDiffTool: v as any })} /></Row>
        <Row label={t.mergeTool} desc={t.mergeToolDesc}><Sel value={d.mergeTool} options={MERGE_TOOLS} onChange={v => set({ mergeTool: v as any })} /></Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} label={t.conflictResolution} />
        <Row label={t.conflictHighlighting} desc={t.conflictHighlightingDesc}><Toggle checked={d.conflictHighlighting} onChange={v => set({ conflictHighlighting: v })} /></Row>
        <Row label={t.rememberConflictRes} desc={t.rememberConflictResDesc}><Toggle checked={d.rememberConflictResolution} onChange={v => set({ rememberConflictResolution: v })} /></Row>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: COMMIT
// ─────────────────────────────────────────────────────────────────────────────
function CommitTab({ draft, setDraft, t }: { draft: EasyGitSettings; setDraft: React.Dispatch<React.SetStateAction<EasyGitSettings>>; t: ReturnType<typeof useTranslation> }) {
  const c = draft.commit;
  const set = (patch: Partial<EasyGitSettings['commit']>) => setDraft(s => ({ ...s, commit: { ...s.commit, ...patch } }));
  return (
    <>
      <div className={styles.section}>
        <SectionHeader icon={<IconCommit />} title={t.commitTitle} />
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>} label={t.commitMessage} />
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <div className={styles.settingLabel}>{t.msgTemplate}</div>
            <div className={styles.settingDesc}>{t.msgTemplateDesc}</div>
          </div>
          <div className={styles.settingControlWide}>
            <textarea className={styles.textarea} rows={3} value={c.messageTemplate} onChange={e => set({ messageTemplate: e.target.value })} />
          </div>
        </div>
        <Row label={t.conventionalCommits} desc={t.conventionalCommitsDesc}><Toggle checked={c.conventionalCommits} onChange={v => set({ conventionalCommits: v })} /></Row>
        <Row label={t.charLimit} desc={t.charLimitDesc}>
          <input type="number" className={styles.inputSm} value={c.characterLimit} min={40} max={200} style={{width:80}} onChange={e => set({ characterLimit: Number(e.target.value) })} />
        </Row>
        <Row label={t.openCommitEditor} desc={t.openCommitEditorDesc}><Toggle checked={c.openCommitEditor} onChange={v => set({ openCommitEditor: v })} /></Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} label={t.authorSigning} />
        <Row label={t.showAuthorInfo} desc={t.showAuthorInfoDesc}><Toggle checked={c.showAuthorInfo} onChange={v => set({ showAuthorInfo: v })} /></Row>
        <Row label={t.allowAmend} desc={t.allowAmendDesc}><Toggle checked={c.allowAmend} onChange={v => set({ allowAmend: v })} /></Row>
        <Row label={t.signOff} desc={t.signOffDesc}><Toggle checked={c.signOff} onChange={v => set({ signOff: v })} /></Row>
        <Row label={t.gpgSigning} desc={t.gpgSigningDesc}><Toggle checked={c.gpgSigning} onChange={v => set({ gpgSigning: v })} /></Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} label={t.warnings} />
        <Row label={t.warnEmptyCommit} desc={t.warnEmptyCommitDesc}><Toggle checked={c.warnEmptyCommit} onChange={v => set({ warnEmptyCommit: v })} /></Row>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
function NotificationsTab({ draft, setDraft, t }: { draft: EasyGitSettings; setDraft: React.Dispatch<React.SetStateAction<EasyGitSettings>>; t: ReturnType<typeof useTranslation> }) {
  const n = draft.notifications;
  const set = (patch: Partial<EasyGitSettings['notifications']>) => setDraft(s => ({ ...s, notifications: { ...s.notifications, ...patch } }));
  return (
    <>
      <div className={styles.section}>
        <SectionHeader icon={<IconBell />} title={t.notificationsTitle} />
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label={t.gitOperations} />
        <Row label={t.pushCompleted} desc={t.pushCompletedDesc}><Toggle checked={n.pushCompleted} onChange={v => set({ pushCompleted: v })} /></Row>
        <Row label={t.pullCompleted} desc={t.pullCompletedDesc}><Toggle checked={n.pullCompleted} onChange={v => set({ pullCompleted: v })} /></Row>
        <Row label={t.fetchCompleted} desc={t.fetchCompletedDesc}><Toggle checked={n.fetchCompleted} onChange={v => set({ fetchCompleted: v })} /></Row>
        <Row label={t.mergeCompleted} desc={t.mergeCompletedDesc}><Toggle checked={n.mergeCompleted} onChange={v => set({ mergeCompleted: v })} /></Row>
        <Row label={t.mergeConflict} desc={t.mergeConflictDesc}><Toggle checked={n.mergeConflict} onChange={v => set({ mergeConflict: v })} /></Row>
        <Row label={t.commitCompleted} desc={t.commitCompletedDesc}><Toggle checked={n.commitCompleted} onChange={v => set({ commitCompleted: v })} /></Row>
        <Row label={t.backgroundTasks} desc={t.backgroundTasksDesc}><Toggle checked={n.backgroundTasks} onChange={v => set({ backgroundTasks: v })} /></Row>
        <Row label={t.updateAvailable} desc={t.updateAvailableDesc}><Toggle checked={n.updateAvailable} onChange={v => set({ updateAvailable: v })} /></Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>} label={t.system} />
        <Row label={t.desktopNotifications} desc={t.desktopNotificationsDesc}><Toggle checked={n.desktopNotifications} onChange={v => set({ desktopNotifications: v })} /></Row>
        <Row label={t.sound} desc={t.soundDesc}><Toggle checked={n.sound} onChange={v => set({ sound: v })} /></Row>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: SHORTCUTS
// ─────────────────────────────────────────────────────────────────────────────
function ShortcutsTab({ draft, setDraft, t }: { draft: EasyGitSettings; setDraft: React.Dispatch<React.SetStateAction<EasyGitSettings>>; t: ReturnType<typeof useTranslation> }) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [pressedKeys, setPressedKeys] = useState('');
  const shortcuts = draft.shortcuts;

  const updateShortcut = (id: string, newShortcut: string) =>
    setDraft(s => ({ ...s, shortcuts: s.shortcuts.map(sc => sc.id === id ? { ...sc, shortcut: newShortcut } : sc) }));

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    e.preventDefault();
    const parts: string[] = [];
    if (e.ctrlKey)  parts.push('Ctrl');
    if (e.altKey)   parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    const key = e.key === ' ' ? 'Space' : e.key;
    if (!['Control','Alt','Shift','Meta'].includes(key)) parts.push(key.length === 1 ? key.toUpperCase() : key);
    setPressedKeys(parts.join(' + '));
  };

  const commitEdit = (id: string) => {
    if (pressedKeys) updateShortcut(id, pressedKeys);
    setEditing(null);
    setPressedKeys('');
  };

  const filtered = shortcuts.filter(s =>
    s.action.toLowerCase().includes(search.toLowerCase()) ||
    s.shortcut.toLowerCase().includes(search.toLowerCase())
  );
  const grouped = filtered.reduce((acc: Record<string, ShortcutEntry[]>, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <>
      <div className={styles.section}>
        <SectionHeader icon={<IconKeyboard />} title={t.shortcutsTitle} />
        <div className={styles.searchBar}>
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" className={styles.searchIcon}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className={styles.searchInput} placeholder={t.searchShortcuts} value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button type="button" className={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
        </div>
      </div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div className={styles.section} key={cat}>
          <div className={styles.sectionSubHeader}><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><rect x="2" y="6" width="20" height="12" rx="2"/></svg>{cat}</div>
          {items.map(item => (
            <div key={item.id} className={styles.shortcutRow}>
              <span className={styles.shortcutAction}>{item.action}</span>
              <div className={styles.shortcutKeys}>
                {editing === item.id ? (
                  <input
                    autoFocus
                    className={styles.shortcutInput}
                    placeholder="Press keys…"
                    value={pressedKeys}
                    readOnly
                    onKeyDown={e => handleKeyDown(e, item.id)}
                    onKeyUp={() => commitEdit(item.id)}
                    onBlur={() => { setEditing(null); setPressedKeys(''); }}
                  />
                ) : (
                  <>
                    {item.shortcut.split(' + ').map((k, i, arr) => (
                      <React.Fragment key={k}>
                        <kbd className={styles.kbd}>{k}</kbd>
                        {i < arr.length - 1 && <span className={styles.kbdPlus}>+</span>}
                      </React.Fragment>
                    ))}
                    <button type="button" className={styles.editKbdBtn} title="Edit shortcut" onClick={() => { setEditing(item.id); setPressedKeys(''); }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className={styles.section}>
        <button type="button" className={styles.resetShortcutsBtn} onClick={() => setDraft(s => ({ ...s, shortcuts: DEFAULT_SHORTCUTS }))}>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          {t.btnResetShortcuts}
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: PLUGINS
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PLUGINS = [
  { name: 'GitHub Integration', author: 'EasyGit Team', version: '1.2.0', enabled: true,  icon: '🐙', desc: 'Pull requests, issues and GitHub Flow support' },
  { name: 'GitLab Integration', author: 'EasyGit Team', version: '1.0.3', enabled: false, icon: '🦊', desc: 'Merge requests and GitLab CI pipeline status' },
  { name: 'Jira Integration',   author: 'Community',    version: '0.9.1', enabled: true,  icon: '📋', desc: 'Link commits and branches to Jira tickets' },
  { name: 'AI Commit Assistant',author: 'EasyGit Labs', version: '0.5.0', enabled: false, icon: '🤖', desc: 'AI-generated commit messages from staged diff' },
];

function PluginsTab({ t }: { t: ReturnType<typeof useTranslation> }) {
  const [plugins, setPlugins] = useState(MOCK_PLUGINS);
  return (
    <>
      <div className={styles.section}>
        <SectionHeader icon={<IconPlugins />} title={t.pluginsTitle} badge={t.pluginsInstalled} />
        <div className={styles.pluginList}>
          {plugins.length === 0 && <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '24px' }}>No plugins installed.</p>}
          {plugins.map(p => (
            <div key={p.name} className={styles.pluginCard}>
              <div className={styles.pluginIcon}>{p.icon}</div>
              <div className={styles.pluginInfo}>
                <div className={styles.pluginName}>{p.name} <span className={styles.pluginVersion}>v{p.version}</span></div>
                <div className={styles.pluginAuthor}>by {p.author}</div>
                <div className={styles.pluginDesc}>{p.desc}</div>
              </div>
              <div className={styles.pluginActions}>
                <Toggle checked={p.enabled} onChange={() => setPlugins(pl => pl.map(x => x.name === p.name ? { ...x, enabled: !x.enabled } : x))} />
                <button type="button" className={styles.pluginUninstallBtn} title="Uninstall" onClick={() => setPlugins(pl => pl.filter(x => x.name !== p.name))}>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.marketplaceCard}>
          <div className={styles.marketplaceIcon}>🏪</div>
          <div className={styles.marketplaceText}>
            <div className={styles.marketplaceTitle}>{t.pluginMarketplace}</div>
            <div className={styles.marketplaceDesc}>{t.pluginMarketplaceDesc}</div>
          </div>
          <button type="button" className={styles.marketplaceBtn}>{t.btnBrowseMarketplace}</button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: ADVANCED
// ─────────────────────────────────────────────────────────────────────────────
function AdvancedTab({ draft, setDraft, t, showToast }: { draft: EasyGitSettings; setDraft: React.Dispatch<React.SetStateAction<EasyGitSettings>>; t: ReturnType<typeof useTranslation>; showToast: (msg: string, type?: 'success'|'info'|'error') => void }) {
  const a = draft.advanced;
  const [clearing, setClearing] = useState(false);
  const set = (patch: Partial<EasyGitSettings['advanced']>) => setDraft(s => ({ ...s, advanced: { ...s.advanced, ...patch } }));

  const clearCache = async () => {
    setClearing(true);
    await new Promise(r => setTimeout(r, 800));
    setClearing(false);
    showToast('Cache cleared successfully!', 'success');
  };

  return (
    <>
      <div className={styles.section}>
        <SectionHeader icon={<IconAdvanced />} title={t.advancedTitle} badge={t.advancedExpert} />
        <Row label={t.experimentalFeatures} desc={t.experimentalFeaturesDesc}><Toggle checked={a.experimentalFeatures} onChange={v => set({ experimentalFeatures: v })} /></Row>
        <Row label={t.btnOpenDevTools} desc="Open Chromium DevTools (Electron)">
          <button type="button" className={styles.actionBtn} onClick={() => (window as any).electron?.openDevTools?.()}>
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:5}}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            {t.btnOpenDevTools}
          </button>
        </Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>} label={t.network} />
        <Row label={t.proxy} desc={t.proxyDesc}>
          <input type="text" className={styles.inputSm} value={a.proxy} onChange={e => set({ proxy: e.target.value })} placeholder="http://proxy:8080" style={{width:220}} />
        </Row>
        <Row label={t.sshKeyPath} desc={t.sshKeyPathDesc}>
          <div className={styles.inputGroup}>
            <input type="text" className={styles.inputSm} value={a.sshKeyPath} onChange={e => set({ sshKeyPath: e.target.value })} style={{width:180}} />
            <button type="button" className={styles.browseBtn}>{t.btnBrowse}</button>
          </div>
        </Row>
        <Row label={t.credentialManager} desc={t.credentialManagerDesc}>
          <Sel value={a.credentialManager} options={['Git Credential Manager','SSH Agent','Store','Cache']} onChange={v => set({ credentialManager: v as any })} />
        </Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>} label={t.cachePerformance} />
        <Row label={t.gitCache} desc={t.gitCacheDesc}><Toggle checked={a.gitCache} onChange={v => set({ gitCache: v })} /></Row>
        <Row label={t.repositoryCache} desc={t.repositoryCacheDesc}><Toggle checked={a.repositoryCache} onChange={v => set({ repositoryCache: v })} /></Row>
        <Row label={t.resetCache} desc={t.resetCacheDesc}>
          <button type="button" className={styles.dangerBtn} onClick={clearCache} disabled={clearing}>
            {clearing ? <span className={styles.spinner} style={{marginRight:6}} /> : <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:5}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>}
            {clearing ? t.btnClearing : t.btnClearCache}
          </button>
        </Row>
      </div>
      <div className={styles.section}>
        <SubHeader icon={<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:6}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} label={t.logging} />
        <Row label={t.loggingLevel} desc={t.loggingLevelDesc}>
          <Sel value={a.loggingLevel} options={['Error','Warning','Info','Debug','Trace']} onChange={v => set({ loggingLevel: v as any })} />
        </Row>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: ABOUT
// ─────────────────────────────────────────────────────────────────────────────
function AboutTab({ t, showToast }: { t: ReturnType<typeof useTranslation>; showToast: (msg: string, type?: 'success'|'info'|'error') => void }) {
  const [checking, setChecking] = useState(false);
  const checkUpdates = async () => {
    setChecking(true);
    await new Promise(r => setTimeout(r, 1200));
    setChecking(false);
    showToast('EasyGit 1.0.0 — You are on the latest version!', 'info');
  };
  return (
    <>
      <div className={styles.section}>
        <div className={styles.aboutHero}>
          <div className={styles.aboutLogoWrap}>
            <svg viewBox="0 0 24 24" width="40" height="40" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>
          </div>
          <div>
            <div className={styles.aboutName}>EasyGit</div>
            <div className={styles.aboutTagline}>{t.aboutTagline}</div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <SectionHeader icon={<IconInfo />} title={t.versionInfo} />
        {[
          { label: 'EasyGit Version', value: '1.0.0', green: true },
          { label: 'Git Version',     value: 'Git 2.51.0', mono: true, green: true },
          { label: 'Build',           value: 'build-20260822.001', mono: true },
          { label: 'OS',              value: 'Windows 11 (22631)' },
          { label: 'Architecture',    value: 'x64 (AMD64)' },
          { label: 'Electron',        value: '31.3.1', mono: true },
          { label: 'Node.js',         value: '20.15.0', mono: true },
        ].map(item => (
          <div key={item.label} className={styles.infoRow}>
            <span className={styles.infoLabel}>{item.label}</span>
            <span className={`${styles.infoValue} ${item.mono ? styles.infoMono : ''} ${item.green ? styles.infoGreen : ''}`}>{item.value}</span>
          </div>
        ))}
      </div>
      <div className={styles.section}>
        <SectionHeader icon={<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>} title={t.resources} />
        <div className={styles.resourceGrid}>
          {[
            { icon: '📦', label: t.githubRepo,          desc: t.githubRepoDesc,          href: 'https://github.com' },
            { icon: '📖', label: t.documentation,       desc: t.documentationDesc,       href: '#' },
            { icon: '🐛', label: t.reportIssue,         desc: t.reportIssueDesc,         href: '#' },
            { icon: '📋', label: t.releaseNotes,        desc: t.releaseNotesDesc,        href: '#' },
            { icon: '🔒', label: t.privacyPolicy,       desc: t.privacyPolicyDesc,       href: '#' },
            { icon: '📜', label: t.openSourceLicenses,  desc: t.openSourceLicensesDesc,  href: '#' },
          ].map(r => (
            <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" className={styles.resourceCard}>
              <span className={styles.resourceIcon}>{r.icon}</span>
              <div><div className={styles.resourceLabel}>{r.label}</div><div className={styles.resourceDesc}>{r.desc}</div></div>
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" className={styles.resourceArrow}><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <button type="button" className={styles.checkUpdateBtn} onClick={checkUpdates} disabled={checking}>
          {checking ? <span className={styles.spinner} style={{marginRight:8}} /> : <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight:8}}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>}
          {checking ? t.btnChecking : t.btnCheckUpdates}
        </button>
        <div className={styles.licenseNote}>{t.mitLicense}</div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, applySettings, resetToDefaults } = useSettingsStore();
  const [activeTab, setActiveTab] = useState('general');
  const [draft, setDraft] = useState<EasyGitSettings>(settings);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const { toast, show: showToast } = useToast();

  // Use the draft language for live translation preview
  const t = useTranslation(draft.general.language);

  // Build tabs with translated labels
  const TABS = [
    { id: 'general',       label: t.tabGeneral,       icon: <IconSettings /> },
    { id: 'appearance',    label: t.tabAppearance,    icon: <IconAppearance /> },
    { id: 'git',           label: t.tabGit,           icon: <IconGit /> },
    { id: 'diff',          label: t.tabDiff,          icon: <IconDiff /> },
    { id: 'commit',        label: t.tabCommit,        icon: <IconCommit /> },
    { id: 'notifications', label: t.tabNotifications, icon: <IconBell /> },
    { id: 'shortcuts',     label: t.tabShortcuts,     icon: <IconKeyboard /> },
    { id: 'plugins',       label: t.tabPlugins,       icon: <IconPlugins /> },
    { id: 'advanced',      label: t.tabAdvanced,      icon: <IconAdvanced /> },
    { id: 'about',         label: t.tabAbout,         icon: <IconInfo /> },
  ];

  // Sync draft when modal re-opens
  useEffect(() => { if (isOpen) setDraft(settings); }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    applySettings(draft);
    applyAppearanceToDOM(draft.appearance);
    onClose();
  };

  const handleCancel = () => {
    applyAppearanceToDOM(settings.appearance); // revert live preview
    onClose();
  };

  const handleConfirmReset = () => {
    setShowConfirmReset(false);
    setDraft(DEFAULT_SETTINGS);
    applyAppearanceToDOM(DEFAULT_SETTINGS.appearance);
    showToast('Settings reset to defaults', 'info');
  };

  const renderContent = () => {
    const props = { draft, setDraft, t };
    switch (activeTab) {
      case 'general':       return <GeneralTab {...props} />;
      case 'appearance':    return <AppearanceTab {...props} />;
      case 'git':           return <GitTab {...props} showToast={showToast} />;
      case 'diff':          return <DiffTab {...props} />;
      case 'commit':        return <CommitTab {...props} />;
      case 'notifications': return <NotificationsTab {...props} />;
      case 'shortcuts':     return <ShortcutsTab {...props} />;
      case 'plugins':       return <PluginsTab t={t} />;
      case 'advanced':      return <AdvancedTab {...props} showToast={showToast} />;
      case 'about':         return <AboutTab t={t} showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && handleCancel()}>
      <div className={styles.modal}>
        {/* Inline confirm dialog */}
        {showConfirmReset && (
          <ConfirmDialog
            message={t.confirmReset}
            onConfirm={handleConfirmReset}
            onCancel={() => setShowConfirmReset(false)}
            t={t}
          />
        )}

        {/* Toast */}
        <Toast toast={toast} />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIconWrap}><IconSettings /></div>
            <div>
              <h2 className={styles.title}>{t.settingsTitle}</h2>
              <p className={styles.subtitle}>{t.settingsSubtitle}</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={handleCancel} title={t.btnCancel}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.sidebar}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.content}>{renderContent()}</div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" className={styles.resetBtn} onClick={() => setShowConfirmReset(true)}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
            {t.btnReset}
          </button>
          <div className={styles.footerActions}>
            <button type="button" className={styles.cancelBtn} onClick={handleCancel}>{t.btnCancel}</button>
            <button type="button" className={styles.saveBtn} onClick={handleSave}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {t.btnSave}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
