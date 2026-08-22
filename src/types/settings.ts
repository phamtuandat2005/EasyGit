/* ============================================
   EasyGit Settings Types
   ============================================ */

export type Language = 'English' | 'Vietnamese' | 'Japanese' | 'Korean' | 'Chinese';
export type Theme = 'Light' | 'Dark' | 'System';
export type AccentColor = '#1f6feb' | '#3fb950' | '#bc8cff' | '#d29922' | '#f85149' | '#39d2c0';
export type FontSize = '12px' | '13px' | '14px' | '15px' | '16px';
export type Density = 'Comfortable' | 'Compact' | 'Spacious';

export type AutoFetchInterval = 'Off' | 'Every 5 minutes' | 'Every 15 minutes' | 'Every 30 minutes';
export type PushBehavior = 'Simple' | 'Current Branch' | 'Upstream' | 'Matching';
export type PullBehavior = 'Merge' | 'Rebase' | 'Fast-forward only';
export type SigningFormat = 'GPG' | 'SSH' | 'X.509';
export type DiffView = 'Side-by-side' | 'Unified';
export type LoggingLevel = 'Error' | 'Warning' | 'Info' | 'Debug' | 'Trace';
export type CredentialManager = 'Git Credential Manager' | 'SSH Agent' | 'Store' | 'Cache';
export type ExternalTool = 'EasyGit Built-in' | 'VS Code' | 'Beyond Compare' | 'Meld' | 'WinMerge' | 'Vimdiff' | 'P4Merge';

export interface GeneralSettings {
  language: Language;
  startOnStartup: boolean;
  defaultRepoDirectory: string;
  checkForUpdates: boolean;
}

export interface AppearanceSettings {
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
  density: Density;
  enableAnimations: boolean;
}

export interface GitSettings {
  gitExecutablePath: string;
  defaultBranchName: string;
  userName: string;
  userEmail: string;
  autoFetch: AutoFetchInterval;
  pruneStaleBranches: boolean;
  pushBehavior: PushBehavior;
  pullBehavior: PullBehavior;
  autoStashBeforePull: boolean;
  signCommits: boolean;
  signingFormat: SigningFormat;
}

export interface DiffSettings {
  diffView: DiffView;
  ignoreWhitespace: boolean;
  wordWrap: boolean;
  syntaxHighlighting: boolean;
  showLineNumbers: boolean;
  externalDiffTool: ExternalTool;
  mergeTool: ExternalTool;
  conflictHighlighting: boolean;
  rememberConflictResolution: boolean;
}

export interface CommitSettings {
  messageTemplate: string;
  conventionalCommits: boolean;
  characterLimit: number;
  openCommitEditor: boolean;
  showAuthorInfo: boolean;
  allowAmend: boolean;
  signOff: boolean;
  gpgSigning: boolean;
  warnEmptyCommit: boolean;
}

export interface NotificationSettings {
  pushCompleted: boolean;
  pullCompleted: boolean;
  fetchCompleted: boolean;
  mergeCompleted: boolean;
  mergeConflict: boolean;
  commitCompleted: boolean;
  backgroundTasks: boolean;
  updateAvailable: boolean;
  desktopNotifications: boolean;
  sound: boolean;
}

export interface ShortcutEntry {
  id: string;
  action: string;
  shortcut: string;
  category: string;
}

export interface AdvancedSettings {
  experimentalFeatures: boolean;
  proxy: string;
  sshKeyPath: string;
  credentialManager: CredentialManager;
  gitCache: boolean;
  repositoryCache: boolean;
  loggingLevel: LoggingLevel;
}

export interface EasyGitSettings {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  git: GitSettings;
  diff: DiffSettings;
  commit: CommitSettings;
  notifications: NotificationSettings;
  shortcuts: ShortcutEntry[];
  advanced: AdvancedSettings;
}
