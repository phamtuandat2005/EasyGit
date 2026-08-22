import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EasyGitSettings, ShortcutEntry } from '../types/settings';

// ── Default Settings ──────────────────────────────────────────────────────────

export const DEFAULT_SHORTCUTS: ShortcutEntry[] = [
  { id: 'cmd-palette',  action: 'Command Palette',  shortcut: 'Ctrl + K',         category: 'Global' },
  { id: 'commit',       action: 'Commit',            shortcut: 'Ctrl + Enter',     category: 'Global' },
  { id: 'push',         action: 'Push',              shortcut: 'Ctrl + Shift + P', category: 'Git'    },
  { id: 'fetch',        action: 'Fetch',             shortcut: 'Ctrl + Shift + F', category: 'Git'    },
  { id: 'pull',         action: 'Pull',              shortcut: 'Ctrl + Shift + L', category: 'Git'    },
  { id: 'new-branch',   action: 'New Branch',        shortcut: 'Ctrl + Shift + B', category: 'Git'    },
  { id: 'merge',        action: 'Merge',             shortcut: 'Ctrl + Shift + M', category: 'Git'    },
  { id: 'open-diff',    action: 'Open Diff',         shortcut: 'Ctrl + Shift + D', category: 'View'   },
  { id: 'view-changes', action: 'Show Changes',      shortcut: 'Ctrl + 1',         category: 'View'   },
  { id: 'view-history', action: 'Show History',      shortcut: 'Ctrl + 2',         category: 'View'   },
  { id: 'view-graph',   action: 'Show Graph',        shortcut: 'Ctrl + 3',         category: 'View'   },
];

export const DEFAULT_SETTINGS: EasyGitSettings = {
  general: {
    language: 'English',
    startOnStartup: false,
    defaultRepoDirectory: 'C:/Projects',
    checkForUpdates: true,
  },
  appearance: {
    theme: 'Dark',
    accentColor: '#1f6feb',
    fontSize: '14px',
    density: 'Comfortable',
    enableAnimations: true,
  },
  git: {
    gitExecutablePath: 'C:\\Program Files\\Git\\bin\\git.exe',
    defaultBranchName: 'main',
    userName: '',
    userEmail: '',
    autoFetch: 'Every 15 minutes',
    pruneStaleBranches: true,
    pushBehavior: 'Simple',
    pullBehavior: 'Merge',
    autoStashBeforePull: false,
    signCommits: false,
    signingFormat: 'GPG',
  },
  diff: {
    diffView: 'Side-by-side',
    ignoreWhitespace: false,
    wordWrap: true,
    syntaxHighlighting: true,
    showLineNumbers: true,
    externalDiffTool: 'EasyGit Built-in',
    mergeTool: 'EasyGit Built-in',
    conflictHighlighting: true,
    rememberConflictResolution: false,
  },
  commit: {
    messageTemplate: 'feat: ',
    conventionalCommits: true,
    characterLimit: 72,
    openCommitEditor: false,
    showAuthorInfo: true,
    allowAmend: true,
    signOff: false,
    gpgSigning: false,
    warnEmptyCommit: true,
  },
  notifications: {
    pushCompleted: true,
    pullCompleted: true,
    fetchCompleted: false,
    mergeCompleted: true,
    mergeConflict: true,
    commitCompleted: false,
    backgroundTasks: true,
    updateAvailable: true,
    desktopNotifications: true,
    sound: false,
  },
  shortcuts: DEFAULT_SHORTCUTS,
  advanced: {
    experimentalFeatures: false,
    proxy: '',
    sshKeyPath: '~/.ssh/id_rsa',
    credentialManager: 'Git Credential Manager',
    gitCache: true,
    repositoryCache: true,
    loggingLevel: 'Info',
  },
};

// ── Settings Store ────────────────────────────────────────────────────────────

interface SettingsStore {
  settings: EasyGitSettings;
  updateGeneral: (patch: Partial<EasyGitSettings['general']>) => void;
  updateAppearance: (patch: Partial<EasyGitSettings['appearance']>) => void;
  updateGit: (patch: Partial<EasyGitSettings['git']>) => void;
  updateDiff: (patch: Partial<EasyGitSettings['diff']>) => void;
  updateCommit: (patch: Partial<EasyGitSettings['commit']>) => void;
  updateNotifications: (patch: Partial<EasyGitSettings['notifications']>) => void;
  updateShortcut: (id: string, newShortcut: string) => void;
  updateAdvanced: (patch: Partial<EasyGitSettings['advanced']>) => void;
  applySettings: (newSettings: EasyGitSettings) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateGeneral: (patch) =>
        set((s) => ({ settings: { ...s.settings, general: { ...s.settings.general, ...patch } } })),

      updateAppearance: (patch) =>
        set((s) => ({ settings: { ...s.settings, appearance: { ...s.settings.appearance, ...patch } } })),

      updateGit: (patch) =>
        set((s) => ({ settings: { ...s.settings, git: { ...s.settings.git, ...patch } } })),

      updateDiff: (patch) =>
        set((s) => ({ settings: { ...s.settings, diff: { ...s.settings.diff, ...patch } } })),

      updateCommit: (patch) =>
        set((s) => ({ settings: { ...s.settings, commit: { ...s.settings.commit, ...patch } } })),

      updateNotifications: (patch) =>
        set((s) => ({ settings: { ...s.settings, notifications: { ...s.settings.notifications, ...patch } } })),

      updateShortcut: (id, newShortcut) =>
        set((s) => ({
          settings: {
            ...s.settings,
            shortcuts: s.settings.shortcuts.map((sc) =>
              sc.id === id ? { ...sc, shortcut: newShortcut } : sc
            ),
          },
        })),

      updateAdvanced: (patch) =>
        set((s) => ({ settings: { ...s.settings, advanced: { ...s.settings.advanced, ...patch } } })),

      applySettings: (newSettings) => set({ settings: newSettings }),

      resetToDefaults: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'easygit-settings', // localStorage key
    }
  )
);

// ── Side-effect: Apply appearance settings to DOM ─────────────────────────────
// Called once on app start and whenever settings change.

export function applyAppearanceToDOM(appearance: EasyGitSettings['appearance']) {
  const root = document.documentElement;

  // Accent color
  // Compute emphasis (slightly darker) from the chosen accent
  const accentMap: Record<string, { accent: string; emphasis: string; muted: string }> = {
    '#1f6feb': { accent: '#58a6ff', emphasis: '#1f6feb', muted: 'rgba(56,139,253,0.4)' },
    '#3fb950': { accent: '#3fb950', emphasis: '#238636', muted: 'rgba(63,185,80,0.15)' },
    '#bc8cff': { accent: '#bc8cff', emphasis: '#8957e5', muted: 'rgba(188,140,255,0.15)' },
    '#d29922': { accent: '#e3b341', emphasis: '#d29922', muted: 'rgba(210,153,34,0.15)' },
    '#f85149': { accent: '#f85149', emphasis: '#da3633', muted: 'rgba(248,81,73,0.15)' },
    '#39d2c0': { accent: '#39d2c0', emphasis: '#1da39a', muted: 'rgba(57,210,192,0.15)' },
  };
  const colors = accentMap[appearance.accentColor] ?? accentMap['#1f6feb'];
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--accent-emphasis', colors.emphasis);
  root.style.setProperty('--accent-muted', colors.muted);
  root.style.setProperty('--border-active', appearance.accentColor);

  // Font size (base size scales the whole UI through rem/em)
  const fontSizePx = parseInt(appearance.fontSize, 10);
  root.style.setProperty('--text-base', `${fontSizePx - 1}px`);
  root.style.setProperty('--text-md', `${fontSizePx}px`);
  root.style.setProperty('--text-sm', `${fontSizePx - 2}px`);

  // Density
  const densityMap = {
    Compact:     { space4: '6px',  space5: '10px', space6: '12px' },
    Comfortable: { space4: '8px',  space5: '12px', space6: '16px' },
    Spacious:    { space4: '10px', space5: '16px', space6: '20px' },
  };
  const d = densityMap[appearance.density] ?? densityMap.Comfortable;
  root.style.setProperty('--space-4', d.space4);
  root.style.setProperty('--space-5', d.space5);
  root.style.setProperty('--space-6', d.space6);

  // Animations
  if (!appearance.enableAnimations) {
    root.style.setProperty('--transition-fast', '0ms');
    root.style.setProperty('--transition-normal', '0ms');
    root.style.setProperty('--transition-slow', '0ms');
  } else {
    root.style.setProperty('--transition-fast', '100ms ease');
    root.style.setProperty('--transition-normal', '150ms ease');
    root.style.setProperty('--transition-slow', '250ms ease');
  }

  // Theme — light/dark: swap CSS variables
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark =
    appearance.theme === 'Dark' ||
    (appearance.theme === 'System' && prefersDark);

  if (isDark) {
    root.style.setProperty('--bg-app',            '#0d1117');
    root.style.setProperty('--bg-panel',          '#161b22');
    root.style.setProperty('--bg-surface',        '#1c2128');
    root.style.setProperty('--bg-surface-raised', '#242b35');
    root.style.setProperty('--bg-hover',          '#21262d');
    root.style.setProperty('--text-primary',      '#e6edf3');
    root.style.setProperty('--text-secondary',    '#8b949e');
    root.style.setProperty('--text-tertiary',     '#6e7681');
    root.style.setProperty('--border-default',    '#30363d');
    root.style.setProperty('--border-muted',      '#21262d');
    root.style.setProperty('--border-emphasis',   '#484f58');
  } else {
    root.style.setProperty('--bg-app',            '#ffffff');
    root.style.setProperty('--bg-panel',          '#f6f8fa');
    root.style.setProperty('--bg-surface',        '#eaeef2');
    root.style.setProperty('--bg-surface-raised', '#e0e4e9');
    root.style.setProperty('--bg-hover',          '#dde1e6');
    root.style.setProperty('--text-primary',      '#1f2328');
    root.style.setProperty('--text-secondary',    '#636c76');
    root.style.setProperty('--text-tertiary',     '#8c959f');
    root.style.setProperty('--border-default',    '#d0d7de');
    root.style.setProperty('--border-muted',      '#d8dee4');
    root.style.setProperty('--border-emphasis',   '#bbc1c8');
  }
}
