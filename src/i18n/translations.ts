/* ============================================
   EasyGit i18n — Translations
   ============================================ */

export type Language = 'English' | 'Vietnamese' | 'Japanese' | 'Korean' | 'Chinese';

export interface Translations {
  // Main UI
  navWorkspace: string;
  navChanges: string;
  navHistory: string;
  navGraph: string;
  navRepository: string;
  navBranches: string;
  navStashes: string;
  navTags: string;
  navRemotes: string;
  navSettings: string;

  // Toolbar & Buttons
  btnPull: string;
  btnPush: string;
  btnFetch: string;
  btnStash: string;
  btnNewBranch: string;
  btnCommit: string;
  btnCommitPush: string;

  // Changes View & Context Panel
  unstagedChanges: string;
  stagedChanges: string;
  noUnstagedChanges: string;
  noStagedChanges: string;
  stagedFilesCount: (count: number) => string;
  commitMsgPlaceholder: string;
  commitDescPlaceholder: string;
  fileDetails: string;
  btnClosePanel: string;

  // Tabs
  tabGeneral: string;
  tabAppearance: string;
  tabGit: string;
  tabDiff: string;
  tabCommit: string;
  tabNotifications: string;
  tabShortcuts: string;
  tabPlugins: string;
  tabAdvanced: string;
  tabAbout: string;

  // Header
  settingsTitle: string;
  settingsSubtitle: string;

  // Footer buttons
  btnSave: string;
  btnCancel: string;
  btnReset: string;
  btnBrowse: string;
  btnDetectGit: string;
  btnDetecting: string;
  btnEditGlobalConfig: string;
  btnOpenDevTools: string;
  btnCheckUpdates: string;
  btnChecking: string;
  btnClearCache: string;
  btnClearing: string;
  btnResetShortcuts: string;
  btnBrowseMarketplace: string;
  btnOpenMergeEditor: string;
  confirmReset: string;

  // General
  generalTitle: string;
  language: string;
  languageDesc: string;
  startOnStartup: string;
  startOnStartupDesc: string;
  defaultRepoDir: string;
  defaultRepoDirDesc: string;
  checkForUpdates: string;
  checkForUpdatesDesc: string;

  // Appearance
  appearanceTitle: string;
  theme: string;
  themeDesc: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  accentColor: string;
  accentColorDesc: string;
  fontSize: string;
  fontSizeDesc: string;
  density: string;
  densityDesc: string;
  densityComfortable: string;
  densityCompact: string;
  densitySpacious: string;
  enableAnimations: string;
  enableAnimationsDesc: string;

  // Git
  gitTitle: string;
  gitConfiguration: string;
  gitExePath: string;
  gitExePathDesc: string;
  gitVersion: string;
  gitVersionDesc: string;
  defaultBranch: string;
  defaultBranchDesc: string;
  userIdentity: string;
  userName: string;
  userNameDesc: string;
  userEmail: string;
  userEmailDesc: string;
  fetchSync: string;
  autoFetch: string;
  autoFetchDesc: string;
  pruneStaleBranches: string;
  pruneStaleBranchesDesc: string;
  pushPull: string;
  pushBehavior: string;
  pushBehaviorDesc: string;
  pullBehavior: string;
  pullBehaviorDesc: string;
  autoStash: string;
  autoStashDesc: string;
  security: string;
  signCommits: string;
  signCommitsDesc: string;
  signingFormat: string;
  signingFormatDesc: string;
  gitConfigEditor: string;

  // Diff & Merge
  diffTitle: string;
  diffView: string;
  diffViewDesc: string;
  ignoreWhitespace: string;
  ignoreWhitespaceDesc: string;
  wordWrap: string;
  wordWrapDesc: string;
  syntaxHighlighting: string;
  syntaxHighlightingDesc: string;
  showLineNumbers: string;
  showLineNumbersDesc: string;
  externalTools: string;
  externalDiffTool: string;
  externalDiffToolDesc: string;
  mergeTool: string;
  mergeToolDesc: string;
  conflictResolution: string;
  conflictHighlighting: string;
  conflictHighlightingDesc: string;
  rememberConflictRes: string;
  rememberConflictResDesc: string;

  // Commit
  commitTitle: string;
  commitMessage: string;
  msgTemplate: string;
  msgTemplateDesc: string;
  conventionalCommits: string;
  conventionalCommitsDesc: string;
  charLimit: string;
  charLimitDesc: string;
  openCommitEditor: string;
  openCommitEditorDesc: string;
  authorSigning: string;
  showAuthorInfo: string;
  showAuthorInfoDesc: string;
  allowAmend: string;
  allowAmendDesc: string;
  signOff: string;
  signOffDesc: string;
  gpgSigning: string;
  gpgSigningDesc: string;
  warnings: string;
  warnEmptyCommit: string;
  warnEmptyCommitDesc: string;

  // Notifications
  notificationsTitle: string;
  gitOperations: string;
  pushCompleted: string;
  pushCompletedDesc: string;
  pullCompleted: string;
  pullCompletedDesc: string;
  fetchCompleted: string;
  fetchCompletedDesc: string;
  mergeCompleted: string;
  mergeCompletedDesc: string;
  mergeConflict: string;
  mergeConflictDesc: string;
  commitCompleted: string;
  commitCompletedDesc: string;
  backgroundTasks: string;
  backgroundTasksDesc: string;
  updateAvailable: string;
  updateAvailableDesc: string;
  system: string;
  desktopNotifications: string;
  desktopNotificationsDesc: string;
  sound: string;
  soundDesc: string;

  // Shortcuts
  shortcutsTitle: string;
  searchShortcuts: string;

  // Plugins
  pluginsTitle: string;
  pluginsInstalled: string;
  pluginMarketplace: string;
  pluginMarketplaceDesc: string;
  developerMode: string;
  developerModeDesc: string;

  // Advanced
  advancedTitle: string;
  advancedExpert: string;
  experimentalFeatures: string;
  experimentalFeaturesDesc: string;
  network: string;
  proxy: string;
  proxyDesc: string;
  sshKeyPath: string;
  sshKeyPathDesc: string;
  credentialManager: string;
  credentialManagerDesc: string;
  cachePerformance: string;
  gitCache: string;
  gitCacheDesc: string;
  repositoryCache: string;
  repositoryCacheDesc: string;
  resetCache: string;
  resetCacheDesc: string;
  logging: string;
  loggingLevel: string;
  loggingLevelDesc: string;

  // About
  aboutTagline: string;
  versionInfo: string;
  resources: string;
  githubRepo: string;
  githubRepoDesc: string;
  documentation: string;
  documentationDesc: string;
  reportIssue: string;
  reportIssueDesc: string;
  releaseNotes: string;
  releaseNotesDesc: string;
  privacyPolicy: string;
  privacyPolicyDesc: string;
  openSourceLicenses: string;
  openSourceLicensesDesc: string;
  mitLicense: string;
}

// ── English ───────────────────────────────────────────────────────────────────
const en: Translations = {
  navWorkspace: 'Workspace', navChanges: 'Changes', navHistory: 'History', navGraph: 'Graph',
  navRepository: 'Repository', navBranches: 'Branches', navStashes: 'Stashes', navTags: 'Tags',
  navRemotes: 'Remotes', navSettings: 'Settings',
  btnPull: 'Pull', btnPush: 'Push', btnFetch: 'Fetch', btnStash: 'Stash', btnNewBranch: 'New Branch',
  unstagedChanges: 'Unstaged Changes', stagedChanges: 'Staged Changes',
  noUnstagedChanges: 'No unstaged changes', noStagedChanges: 'No staged changes',
  stagedFilesCount: (c: number) => `${c} staged ${c === 1 ? 'file' : 'files'}`,
  commitMsgPlaceholder: 'Commit message (required)', commitDescPlaceholder: 'Description (optional)',
  btnCommit: 'Commit', btnCommitPush: 'Commit & Push',
  fileDetails: 'File Details', btnClosePanel: 'Close panel',

  tabGeneral: 'General', tabAppearance: 'Appearance', tabGit: 'Git',
  tabDiff: 'Diff & Merge', tabCommit: 'Commit', tabNotifications: 'Notifications',
  tabShortcuts: 'Shortcuts', tabPlugins: 'Plugins', tabAdvanced: 'Advanced', tabAbout: 'About',

  settingsTitle: 'Settings', settingsSubtitle: 'Customize EasyGit to match your workflow',
  btnSave: 'Save Changes', btnCancel: 'Cancel', btnReset: 'Reset to Defaults',
  btnBrowse: 'Browse', btnDetectGit: 'Detect Git', btnDetecting: 'Detecting…',
  btnEditGlobalConfig: 'Edit Global Config', btnOpenDevTools: 'Open DevTools',
  btnCheckUpdates: 'Check for Updates', btnChecking: 'Checking…',
  btnClearCache: 'Clear Cache', btnClearing: 'Clearing…',
  btnResetShortcuts: 'Reset All Shortcuts to Defaults',
  btnBrowseMarketplace: 'Browse Marketplace',
  btnOpenMergeEditor: 'Open Merge Editor',
  confirmReset: 'Reset ALL settings to defaults? This cannot be undone.',

  generalTitle: 'General',
  language: 'Language', languageDesc: 'Choose your preferred language',
  startOnStartup: 'Start EasyGit on system startup', startOnStartupDesc: 'Automatically start EasyGit when you log in',
  defaultRepoDir: 'Default repository directory', defaultRepoDirDesc: 'Default directory when opening repositories',
  checkForUpdates: 'Check for updates', checkForUpdatesDesc: 'Automatically check for updates on startup',

  appearanceTitle: 'Appearance',
  theme: 'Theme', themeDesc: 'Choose your preferred theme',
  themeLight: 'Light', themeDark: 'Dark', themeSystem: 'System',
  accentColor: 'Accent color', accentColorDesc: 'Choose the accent color for EasyGit',
  fontSize: 'Font size', fontSizeDesc: 'Adjust the application font size',
  density: 'Interface density', densityDesc: 'Adjust the spacing and size of UI elements',
  densityComfortable: 'Comfortable', densityCompact: 'Compact', densitySpacious: 'Spacious',
  enableAnimations: 'Enable animations', enableAnimationsDesc: 'Enable smooth animations throughout the interface',

  gitTitle: 'Git', gitConfiguration: 'Configuration',
  gitExePath: 'Git Executable Path', gitExePathDesc: 'Path to the Git binary on your machine',
  gitVersion: 'Git Version', gitVersionDesc: 'Currently detected Git version',
  defaultBranch: 'Default Branch Name', defaultBranchDesc: 'Default branch when initializing a new repository',
  userIdentity: 'User Identity',
  userName: 'User Name', userNameDesc: 'Your name used in commits (user.name)',
  userEmail: 'User Email', userEmailDesc: 'Your email used in commits (user.email)',
  fetchSync: 'Fetch & Sync',
  autoFetch: 'Auto Fetch', autoFetchDesc: 'Automatically fetch remote changes in the background',
  pruneStaleBranches: 'Prune Stale Branches', pruneStaleBranchesDesc: 'Remove remote-tracking branches no longer on remote',
  pushPull: 'Push & Pull',
  pushBehavior: 'Push Behavior', pushBehaviorDesc: 'Configure how git push behaves by default',
  pullBehavior: 'Pull Behavior', pullBehaviorDesc: 'How git pull integrates changes',
  autoStash: 'Auto Stash Before Pull', autoStashDesc: 'Automatically stash local changes before pulling',
  security: 'Security',
  signCommits: 'Sign Commits', signCommitsDesc: 'Sign commits using GPG or SSH key',
  signingFormat: 'Signing Format', signingFormatDesc: 'Choose the signing format',
  gitConfigEditor: 'Git Config Editor',

  diffTitle: 'Diff & Merge',
  diffView: 'Diff View', diffViewDesc: 'Choose how file differences are displayed',
  ignoreWhitespace: 'Ignore Whitespace', ignoreWhitespaceDesc: 'Ignore whitespace changes when comparing files',
  wordWrap: 'Word Wrap', wordWrapDesc: 'Automatically wrap long lines in the diff view',
  syntaxHighlighting: 'Syntax Highlighting', syntaxHighlightingDesc: 'Apply syntax highlighting to code in diff view',
  showLineNumbers: 'Show Line Numbers', showLineNumbersDesc: 'Show line numbers in the diff view',
  externalTools: 'External Tools',
  externalDiffTool: 'External Diff Tool', externalDiffToolDesc: 'Use an external tool to view file differences',
  mergeTool: 'Merge Tool', mergeToolDesc: 'Choose your preferred tool for resolving conflicts',
  conflictResolution: 'Conflict Resolution',
  conflictHighlighting: 'Conflict Highlighting', conflictHighlightingDesc: 'Visually highlight conflict markers',
  rememberConflictRes: 'Remember Conflict Resolution', rememberConflictResDesc: 'Remember previous conflict resolution choices',

  commitTitle: 'Commit', commitMessage: 'Message',
  msgTemplate: 'Commit Message Template', msgTemplateDesc: 'Default template when writing a commit message',
  conventionalCommits: 'Conventional Commits', conventionalCommitsDesc: 'Enable feat, fix, docs, refactor, test, chore format assistance',
  charLimit: 'Commit Character Limit', charLimitDesc: 'Maximum characters in the first line of a commit message',
  openCommitEditor: 'Open Commit Editor', openCommitEditorDesc: 'Open full-screen editor when writing commit messages',
  authorSigning: 'Author & Signing',
  showAuthorInfo: 'Show Author Information', showAuthorInfoDesc: 'Display user name and email before committing',
  allowAmend: 'Amend Last Commit', allowAmendDesc: 'Allow amending the most recent commit',
  signOff: 'Sign-off Commit', signOffDesc: 'Automatically append Signed-off-by line',
  gpgSigning: 'GPG/SSH Commit Signing', gpgSigningDesc: 'Cryptographically sign every commit',
  warnings: 'Warnings',
  warnEmptyCommit: 'Warn Before Empty Commit', warnEmptyCommitDesc: 'Show a warning when trying to commit with no changes',

  notificationsTitle: 'Notifications', gitOperations: 'Git Operations',
  pushCompleted: 'Push Completed', pushCompletedDesc: 'Notify when a push operation succeeds',
  pullCompleted: 'Pull Completed', pullCompletedDesc: 'Notify when a pull operation succeeds',
  fetchCompleted: 'Fetch Completed', fetchCompletedDesc: 'Notify when fetch completes',
  mergeCompleted: 'Merge Completed', mergeCompletedDesc: 'Notify when a merge succeeds',
  mergeConflict: 'Merge Conflict', mergeConflictDesc: 'Alert immediately when conflicts are detected',
  commitCompleted: 'Commit Completed', commitCompletedDesc: 'Notify when a commit is created',
  backgroundTasks: 'Background Tasks', backgroundTasksDesc: 'Notify about background Git operations',
  updateAvailable: 'Update Available', updateAvailableDesc: 'Notify when a new version of EasyGit is available',
  system: 'System',
  desktopNotifications: 'Desktop Notifications', desktopNotificationsDesc: 'Show Windows system notifications from EasyGit',
  sound: 'Sound', soundDesc: 'Play a sound when a notification appears',

  shortcutsTitle: 'Shortcuts', searchShortcuts: 'Search shortcuts...',

  pluginsTitle: 'Plugins', pluginsInstalled: 'Installed',
  pluginMarketplace: 'Plugin Marketplace', pluginMarketplaceDesc: 'Discover and install plugins to extend EasyGit',
  developerMode: 'Developer Mode', developerModeDesc: 'Allow loading local unpublished plugins from disk',

  advancedTitle: 'Advanced', advancedExpert: 'Expert',
  experimentalFeatures: 'Experimental Features', experimentalFeaturesDesc: 'Enable unreleased features (may be unstable)',
  network: 'Network',
  proxy: 'Proxy', proxyDesc: 'Configure HTTP/HTTPS proxy for Git operations',
  sshKeyPath: 'SSH Key Path', sshKeyPathDesc: 'Custom SSH key path for Git',
  credentialManager: 'Credential Manager', credentialManagerDesc: 'How Git stores authentication credentials',
  cachePerformance: 'Cache & Performance',
  gitCache: 'Git Cache', gitCacheDesc: 'Cache frequently accessed Git data to improve performance',
  repositoryCache: 'Repository Cache', repositoryCacheDesc: 'Cache repository metadata to speed up the UI',
  resetCache: 'Reset Cache', resetCacheDesc: 'Clear all cached data and rebuild from scratch',
  logging: 'Logging',
  loggingLevel: 'Logging Level', loggingLevelDesc: 'Control how verbose the application log is',

  aboutTagline: 'Make Git understandable without hiding Git',
  versionInfo: 'Version Information', resources: 'Resources',
  githubRepo: 'GitHub Repository', githubRepoDesc: 'View source code',
  documentation: 'Documentation', documentationDesc: 'User guide & API reference',
  reportIssue: 'Report Issue', reportIssueDesc: 'Submit a bug report',
  releaseNotes: 'Release Notes', releaseNotesDesc: "What's new in this version",
  privacyPolicy: 'Privacy Policy', privacyPolicyDesc: 'How we handle your data',
  openSourceLicenses: 'Open Source Licenses', openSourceLicensesDesc: 'Third-party libraries',
  mitLicense: 'EasyGit is licensed under the MIT License.',
};

// ── Vietnamese ────────────────────────────────────────────────────────────────
const vi: Translations = {
  navWorkspace: 'Không gian làm việc', navChanges: 'Thay đổi', navHistory: 'Lịch sử', navGraph: 'Sơ đồ',
  navRepository: 'Kho lưu trữ', navBranches: 'Nhánh', navStashes: 'Stash', navTags: 'Thẻ',
  navRemotes: 'Remotes', navSettings: 'Cài đặt',
  btnPull: 'Pull', btnPush: 'Push', btnFetch: 'Fetch', btnStash: 'Stash', btnNewBranch: 'Nhánh mới',
  unstagedChanges: 'Thay đổi chưa Staged', stagedChanges: 'Thay đổi đã Staged',
  noUnstagedChanges: 'Không có thay đổi nào chưa staged', noStagedChanges: 'Không có thay đổi nào đã staged',
  stagedFilesCount: (c: number) => `${c} tệp đã staged`,
  commitMsgPlaceholder: 'Thông điệp commit (bắt buộc)', commitDescPlaceholder: 'Mô tả (tùy chọn)',
  btnCommit: 'Commit', btnCommitPush: 'Commit & Push',
  fileDetails: 'Chi tiết tệp', btnClosePanel: 'Đóng bảng',

  tabGeneral: 'Chung', tabAppearance: 'Giao diện', tabGit: 'Git',
  tabDiff: 'Diff & Merge', tabCommit: 'Commit', tabNotifications: 'Thông báo',
  tabShortcuts: 'Phím tắt', tabPlugins: 'Tiện ích', tabAdvanced: 'Nâng cao', tabAbout: 'Giới thiệu',

  settingsTitle: 'Cài đặt', settingsSubtitle: 'Tùy chỉnh EasyGit phù hợp với luồng công việc của bạn',
  btnSave: 'Lưu thay đổi', btnCancel: 'Hủy', btnReset: 'Khôi phục mặc định',
  btnBrowse: 'Duyệt', btnDetectGit: 'Tự động tìm Git', btnDetecting: 'Đang tìm…',
  btnEditGlobalConfig: 'Sửa Config toàn cục', btnOpenDevTools: 'Mở DevTools',
  btnCheckUpdates: 'Kiểm tra cập nhật', btnChecking: 'Đang kiểm tra…',
  btnClearCache: 'Xóa Cache', btnClearing: 'Đang xóa…',
  btnResetShortcuts: 'Khôi phục mọi phím tắt về mặc định',
  btnBrowseMarketplace: 'Duyệt kho tiện ích',
  btnOpenMergeEditor: 'Mở Merge Editor',
  confirmReset: 'Khôi phục tất cả cài đặt về mặc định? Bạn không thể hoàn tác thao tác này.',

  generalTitle: 'Cài đặt chung',
  language: 'Ngôn ngữ', languageDesc: 'Chọn ngôn ngữ hiển thị',
  startOnStartup: 'Khởi động EasyGit cùng hệ thống', startOnStartupDesc: 'Tự động bật EasyGit khi bạn đăng nhập',
  defaultRepoDir: 'Thư mục kho lưu trữ mặc định', defaultRepoDirDesc: 'Thư mục mở ra mặc định khi tìm kho lưu trữ',
  checkForUpdates: 'Kiểm tra cập nhật', checkForUpdatesDesc: 'Tự động kiểm tra bản cập nhật khi khởi động',

  appearanceTitle: 'Giao diện',
  theme: 'Giao diện', themeDesc: 'Chọn giao diện ưa thích của bạn',
  themeLight: 'Sáng', themeDark: 'Tối', themeSystem: 'Hệ thống',
  accentColor: 'Màu nhấn', accentColorDesc: 'Chọn màu nhấn cho EasyGit',
  fontSize: 'Cỡ chữ', fontSizeDesc: 'Điều chỉnh cỡ chữ của ứng dụng',
  density: 'Mật độ giao diện', densityDesc: 'Điều chỉnh khoảng cách và kích thước các thành phần UI',
  densityComfortable: 'Thoải mái', densityCompact: 'Thu gọn', densitySpacious: 'Rộng rãi',
  enableAnimations: 'Bật hiệu ứng', enableAnimationsDesc: 'Bật hiệu ứng mượt mà cho toàn bộ giao diện',

  gitTitle: 'Git', gitConfiguration: 'Cấu hình',
  gitExePath: 'Đường dẫn Git', gitExePathDesc: 'Đường dẫn tới file thực thi Git trên máy',
  gitVersion: 'Phiên bản Git', gitVersionDesc: 'Phiên bản Git hiện đang được sử dụng',
  defaultBranch: 'Tên branch mặc định', defaultBranchDesc: 'Branch mặc định khi khởi tạo repository mới',
  userIdentity: 'Thông tin người dùng',
  userName: 'Tên người dùng', userNameDesc: 'Tên dùng trong commit (user.name)',
  userEmail: 'Email', userEmailDesc: 'Email dùng trong commit (user.email)',
  fetchSync: 'Fetch & Đồng bộ',
  autoFetch: 'Tự động Fetch', autoFetchDesc: 'Tự động fetch thay đổi từ remote trong nền',
  pruneStaleBranches: 'Dọn branch cũ', pruneStaleBranchesDesc: 'Xóa remote-tracking branch không còn tồn tại trên remote',
  pushPull: 'Push & Pull',
  pushBehavior: 'Hành vi Push', pushBehaviorDesc: 'Cấu hình cách git push hoạt động mặc định',
  pullBehavior: 'Hành vi Pull', pullBehaviorDesc: 'Cách git pull tích hợp thay đổi',
  autoStash: 'Tự động Stash trước Pull', autoStashDesc: 'Tự động stash thay đổi local trước khi pull',
  security: 'Bảo mật',
  signCommits: 'Ký commit', signCommitsDesc: 'Ký commit bằng GPG hoặc SSH key',
  signingFormat: 'Định dạng ký', signingFormatDesc: 'Chọn định dạng ký commit',
  gitConfigEditor: 'Trình chỉnh sửa Git Config',

  diffTitle: 'Diff & Merge',
  diffView: 'Kiểu hiển thị Diff', diffViewDesc: 'Chọn cách hiển thị sự khác biệt trong file',
  ignoreWhitespace: 'Bỏ qua khoảng trắng', ignoreWhitespaceDesc: 'Bỏ qua thay đổi khoảng trắng khi so sánh',
  wordWrap: 'Tự xuống dòng', wordWrapDesc: 'Tự động xuống dòng khi dòng quá dài trong diff',
  syntaxHighlighting: 'Tô màu cú pháp', syntaxHighlightingDesc: 'Áp dụng tô màu cú pháp trong diff',
  showLineNumbers: 'Hiển thị số dòng', showLineNumbersDesc: 'Hiển thị số dòng trong diff view',
  externalTools: 'Công cụ bên ngoài',
  externalDiffTool: 'Công cụ Diff ngoài', externalDiffToolDesc: 'Dùng công cụ bên ngoài để xem diff',
  mergeTool: 'Công cụ Merge', mergeToolDesc: 'Chọn công cụ xử lý conflict ưa thích',
  conflictResolution: 'Xử lý Conflict',
  conflictHighlighting: 'Đánh dấu Conflict', conflictHighlightingDesc: 'Đánh dấu trực quan các conflict marker',
  rememberConflictRes: 'Ghi nhớ cách xử lý Conflict', rememberConflictResDesc: 'Ghi nhớ lựa chọn xử lý conflict trước đó',

  commitTitle: 'Commit', commitMessage: 'Nội dung',
  msgTemplate: 'Mẫu commit message', msgTemplateDesc: 'Template mặc định khi viết commit message',
  conventionalCommits: 'Conventional Commits', conventionalCommitsDesc: 'Hỗ trợ format feat, fix, docs, refactor, test, chore',
  charLimit: 'Giới hạn ký tự', charLimitDesc: 'Số ký tự tối đa cho dòng đầu tiên của commit message',
  openCommitEditor: 'Mở trình soạn thảo Commit', openCommitEditorDesc: 'Mở editor toàn màn hình khi viết commit message',
  authorSigning: 'Tác giả & Ký',
  showAuthorInfo: 'Hiển thị thông tin tác giả', showAuthorInfoDesc: 'Hiển thị tên và email trước khi commit',
  allowAmend: 'Sửa commit cuối', allowAmendDesc: 'Cho phép sửa đổi commit gần nhất',
  signOff: 'Ký tên commit', signOffDesc: 'Tự động thêm dòng Signed-off-by',
  gpgSigning: 'Ký commit bằng GPG/SSH', gpgSigningDesc: 'Ký mã hóa mọi commit',
  warnings: 'Cảnh báo',
  warnEmptyCommit: 'Cảnh báo commit rỗng', warnEmptyCommitDesc: 'Hiển thị cảnh báo khi tạo commit không có thay đổi',

  notificationsTitle: 'Thông báo', gitOperations: 'Thao tác Git',
  pushCompleted: 'Push hoàn tất', pushCompletedDesc: 'Thông báo khi push thành công',
  pullCompleted: 'Pull hoàn tất', pullCompletedDesc: 'Thông báo khi pull thành công',
  fetchCompleted: 'Fetch hoàn tất', fetchCompletedDesc: 'Thông báo khi fetch hoàn tất',
  mergeCompleted: 'Merge hoàn tất', mergeCompletedDesc: 'Thông báo khi merge thành công',
  mergeConflict: 'Merge Conflict', mergeConflictDesc: 'Cảnh báo ngay khi phát hiện conflict',
  commitCompleted: 'Commit hoàn tất', commitCompletedDesc: 'Thông báo khi tạo commit thành công',
  backgroundTasks: 'Tác vụ nền', backgroundTasksDesc: 'Thông báo các tác vụ Git chạy trong nền',
  updateAvailable: 'Có cập nhật mới', updateAvailableDesc: 'Thông báo khi có phiên bản EasyGit mới',
  system: 'Hệ thống',
  desktopNotifications: 'Thông báo desktop', desktopNotificationsDesc: 'Hiển thị thông báo hệ thống Windows từ EasyGit',
  sound: 'Âm thanh', soundDesc: 'Phát âm thanh khi có thông báo',

  shortcutsTitle: 'Phím tắt', searchShortcuts: 'Tìm phím tắt...',

  pluginsTitle: 'Plugin', pluginsInstalled: 'Đã cài đặt',
  pluginMarketplace: 'Plugin Marketplace', pluginMarketplaceDesc: 'Khám phá và cài đặt plugin để mở rộng EasyGit',
  developerMode: 'Chế độ nhà phát triển', developerModeDesc: 'Cho phép tải plugin local chưa xuất bản',

  advancedTitle: 'Nâng cao', advancedExpert: 'Chuyên gia',
  experimentalFeatures: 'Tính năng thử nghiệm', experimentalFeaturesDesc: 'Bật các tính năng chưa phát hành (có thể không ổn định)',
  network: 'Mạng',
  proxy: 'Proxy', proxyDesc: 'Cấu hình HTTP/HTTPS proxy cho các thao tác Git',
  sshKeyPath: 'Đường dẫn SSH Key', sshKeyPathDesc: 'Đường dẫn SSH key tùy chỉnh cho Git',
  credentialManager: 'Quản lý thông tin xác thực', credentialManagerDesc: 'Cách Git lưu trữ thông tin xác thực',
  cachePerformance: 'Cache & Hiệu suất',
  gitCache: 'Git Cache', gitCacheDesc: 'Cache dữ liệu Git thường xuyên truy cập để tăng hiệu suất',
  repositoryCache: 'Repository Cache', repositoryCacheDesc: 'Cache metadata repository để tăng tốc UI',
  resetCache: 'Xóa Cache', resetCacheDesc: 'Xóa toàn bộ cache và xây dựng lại từ đầu',
  logging: 'Nhật ký',
  loggingLevel: 'Mức độ ghi log', loggingLevelDesc: 'Kiểm soát độ chi tiết của log ứng dụng',

  aboutTagline: 'Giúp Git dễ hiểu mà không che giấu Git',
  versionInfo: 'Thông tin phiên bản', resources: 'Tài nguyên',
  githubRepo: 'GitHub Repository', githubRepoDesc: 'Xem mã nguồn',
  documentation: 'Tài liệu', documentationDesc: 'Hướng dẫn sử dụng & tài liệu API',
  reportIssue: 'Báo lỗi', reportIssueDesc: 'Gửi báo cáo lỗi',
  releaseNotes: 'Ghi chú phát hành', releaseNotesDesc: 'Xem thay đổi trong phiên bản này',
  privacyPolicy: 'Chính sách quyền riêng tư', privacyPolicyDesc: 'Cách chúng tôi xử lý dữ liệu của bạn',
  openSourceLicenses: 'Giấy phép mã nguồn mở', openSourceLicensesDesc: 'Thư viện bên thứ ba',
  mitLicense: 'EasyGit được cấp phép theo MIT License.',
};

// ── Japanese ──────────────────────────────────────────────────────────────────
const ja: Translations = {
  navWorkspace: 'ワークスペース', navChanges: '変更', navHistory: '履歴', navGraph: 'グラフ',
  navRepository: 'リポジトリ', navBranches: 'ブランチ', navStashes: 'スタッシュ', navTags: 'タグ',
  navRemotes: 'リモート', navSettings: '設定',
  btnPull: 'プル', btnPush: 'プッシュ', btnFetch: 'フェッチ', btnStash: 'スタッシュ', btnNewBranch: '新しいブランチ',
  unstagedChanges: 'ステージされていない変更', stagedChanges: 'ステージ済みの変更',
  noUnstagedChanges: 'ステージされていない変更はありません', noStagedChanges: 'ステージ済みの変更はありません',
  stagedFilesCount: (c: number) => `${c}件のステージ済みファイル`,
  commitMsgPlaceholder: 'コミットメッセージ（必須）', commitDescPlaceholder: '説明（任意）',
  btnCommit: 'コミット', btnCommitPush: 'コミット＆プッシュ',
  fileDetails: 'ファイルの詳細', btnClosePanel: 'パネルを閉じる',

  tabGeneral: '一般', tabAppearance: '外観', tabGit: 'Git',
  tabDiff: 'Diff・マージ', tabCommit: 'コミット', tabNotifications: '通知',
  tabShortcuts: 'ショートカット', tabPlugins: 'プラグイン', tabAdvanced: '詳細設定', tabAbout: '情報',

  settingsTitle: '設定', settingsSubtitle: 'EasyGitをカスタマイズしてワークフローに合わせましょう',
  btnSave: '変更を保存', btnCancel: 'キャンセル', btnReset: 'デフォルトにリセット',
  btnBrowse: '参照', btnDetectGit: 'Gitを検出', btnDetecting: '検出中…',
  btnEditGlobalConfig: 'グローバル設定を編集', btnOpenDevTools: 'DevToolsを開く',
  btnCheckUpdates: 'アップデートを確認', btnChecking: '確認中…',
  btnClearCache: 'キャッシュを削除', btnClearing: '削除中…',
  btnResetShortcuts: 'すべてのショートカットをリセット',
  btnBrowseMarketplace: 'マーケットプレイスを見る',
  btnOpenMergeEditor: 'マージエディタを開く',
  confirmReset: 'すべての設定をデフォルトにリセットしますか？この操作は元に戻せません。',

  generalTitle: '一般',
  language: '言語', languageDesc: '使用する言語を選択してください',
  startOnStartup: 'システム起動時にEasyGitを起動', startOnStartupDesc: 'ログイン時にEasyGitを自動的に起動します',
  defaultRepoDir: 'デフォルトのリポジトリディレクトリ', defaultRepoDirDesc: 'リポジトリを開く際のデフォルトディレクトリ',
  checkForUpdates: 'アップデートを確認', checkForUpdatesDesc: '起動時に自動的にアップデートを確認します',

  appearanceTitle: '外観',
  theme: 'テーマ', themeDesc: 'テーマを選択してください',
  themeLight: 'ライト', themeDark: 'ダーク', themeSystem: 'システム',
  accentColor: 'アクセントカラー', accentColorDesc: 'EasyGitのアクセントカラーを選択',
  fontSize: 'フォントサイズ', fontSizeDesc: 'アプリのフォントサイズを調整',
  density: 'インターフェイス密度', densityDesc: 'UI要素の間隔とサイズを調整',
  densityComfortable: '快適', densityCompact: 'コンパクト', densitySpacious: '広め',
  enableAnimations: 'アニメーションを有効化', enableAnimationsDesc: 'インターフェイス全体で滑らかなアニメーションを有効にします',

  gitTitle: 'Git', gitConfiguration: '設定',
  gitExePath: 'Git実行ファイルのパス', gitExePathDesc: 'マシン上のGitバイナリへのパス',
  gitVersion: 'Gitバージョン', gitVersionDesc: '現在検出されているGitのバージョン',
  defaultBranch: 'デフォルトブランチ名', defaultBranchDesc: '新しいリポジトリ作成時のデフォルトブランチ',
  userIdentity: 'ユーザー情報',
  userName: 'ユーザー名', userNameDesc: 'コミットに使用する名前 (user.name)',
  userEmail: 'メールアドレス', userEmailDesc: 'コミットに使用するメール (user.email)',
  fetchSync: 'フェッチ & 同期',
  autoFetch: '自動フェッチ', autoFetchDesc: 'バックグラウンドでリモートの変更を自動的にフェッチします',
  pruneStaleBranches: '古いブランチを削除', pruneStaleBranchesDesc: 'リモートに存在しないリモートトラッキングブランチを削除します',
  pushPull: 'プッシュ & プル',
  pushBehavior: 'プッシュの動作', pushBehaviorDesc: 'git pushのデフォルト動作を設定します',
  pullBehavior: 'プルの動作', pullBehaviorDesc: 'git pullの変更取り込み方法',
  autoStash: 'プル前に自動スタッシュ', autoStashDesc: 'プル前にローカルの変更を自動的にスタッシュします',
  security: 'セキュリティ',
  signCommits: 'コミットに署名', signCommitsDesc: 'GPGまたはSSHキーでコミットに署名します',
  signingFormat: '署名フォーマット', signingFormatDesc: '署名フォーマットを選択',
  gitConfigEditor: 'Git設定エディタ',

  diffTitle: 'Diff・マージ',
  diffView: 'Diff表示', diffViewDesc: 'ファイルの差分表示方法を選択します',
  ignoreWhitespace: '空白を無視', ignoreWhitespaceDesc: 'ファイル比較時に空白の変更を無視します',
  wordWrap: '折り返し', wordWrapDesc: 'Diffビューで長い行を自動的に折り返します',
  syntaxHighlighting: 'シンタックスハイライト', syntaxHighlightingDesc: 'Diffビューでコードのシンタックスハイライトを適用します',
  showLineNumbers: '行番号を表示', showLineNumbersDesc: 'Diffビューで行番号を表示します',
  externalTools: '外部ツール',
  externalDiffTool: '外部Diffツール', externalDiffToolDesc: '外部ツールを使ってファイルの差分を表示します',
  mergeTool: 'マージツール', mergeToolDesc: 'コンフリクト解決に使用するツールを選択します',
  conflictResolution: 'コンフリクト解決',
  conflictHighlighting: 'コンフリクトのハイライト', conflictHighlightingDesc: 'コンフリクトマーカーを視覚的にハイライトします',
  rememberConflictRes: 'コンフリクト解決を記憶', rememberConflictResDesc: '以前のコンフリクト解決の選択を記憶します',

  commitTitle: 'コミット', commitMessage: 'メッセージ',
  msgTemplate: 'コミットメッセージテンプレート', msgTemplateDesc: 'コミットメッセージ入力時のデフォルトテンプレート',
  conventionalCommits: 'Conventional Commits', conventionalCommitsDesc: 'feat, fix, docs, refactor, test, choreフォーマットのサポートを有効にします',
  charLimit: '文字数制限', charLimitDesc: 'コミットメッセージ1行目の最大文字数',
  openCommitEditor: 'コミットエディタを開く', openCommitEditorDesc: 'コミットメッセージ入力時にフルスクリーンエディタを開きます',
  authorSigning: '作成者 & 署名',
  showAuthorInfo: '作成者情報を表示', showAuthorInfoDesc: 'コミット前に名前とメールを表示します',
  allowAmend: '最後のコミットを修正', allowAmendDesc: '直前のコミットの修正を許可します',
  signOff: 'コミットにサインオフ', signOffDesc: 'Signed-off-by行を自動的に追加します',
  gpgSigning: 'GPG/SSH署名', gpgSigningDesc: 'すべてのコミットに暗号署名します',
  warnings: '警告',
  warnEmptyCommit: '空のコミット前に警告', warnEmptyCommitDesc: '変更がない状態でコミットしようとした時に警告を表示します',

  notificationsTitle: '通知', gitOperations: 'Git操作',
  pushCompleted: 'プッシュ完了', pushCompletedDesc: 'プッシュが成功した時に通知します',
  pullCompleted: 'プル完了', pullCompletedDesc: 'プルが成功した時に通知します',
  fetchCompleted: 'フェッチ完了', fetchCompletedDesc: 'フェッチが完了した時に通知します',
  mergeCompleted: 'マージ完了', mergeCompletedDesc: 'マージが成功した時に通知します',
  mergeConflict: 'マージコンフリクト', mergeConflictDesc: 'コンフリクトが検出された時に即座に警告します',
  commitCompleted: 'コミット完了', commitCompletedDesc: 'コミットが作成された時に通知します',
  backgroundTasks: 'バックグラウンドタスク', backgroundTasksDesc: 'バックグラウンドのGit操作について通知します',
  updateAvailable: 'アップデートあり', updateAvailableDesc: 'EasyGitの新バージョンが利用可能な時に通知します',
  system: 'システム',
  desktopNotifications: 'デスクトップ通知', desktopNotificationsDesc: 'EasyGitからのWindowsシステム通知を表示します',
  sound: '通知音', soundDesc: '通知が表示された時に音を再生します',

  shortcutsTitle: 'ショートカット', searchShortcuts: 'ショートカットを検索...',

  pluginsTitle: 'プラグイン', pluginsInstalled: 'インストール済み',
  pluginMarketplace: 'プラグインマーケットプレイス', pluginMarketplaceDesc: 'EasyGitを拡張するプラグインを探してインストールします',
  developerMode: '開発者モード', developerModeDesc: 'ディスクからローカルの未公開プラグインを読み込めるようにします',

  advancedTitle: '詳細設定', advancedExpert: 'エキスパート',
  experimentalFeatures: '実験的な機能', experimentalFeaturesDesc: '未リリースの機能を有効にします（不安定な場合があります）',
  network: 'ネットワーク',
  proxy: 'プロキシ', proxyDesc: 'Git操作のHTTP/HTTPSプロキシを設定します',
  sshKeyPath: 'SSHキーパス', sshKeyPathDesc: 'Git用のカスタムSSHキーパス',
  credentialManager: '認証情報マネージャー', credentialManagerDesc: 'Gitが認証情報を保存する方法',
  cachePerformance: 'キャッシュ & パフォーマンス',
  gitCache: 'Gitキャッシュ', gitCacheDesc: 'パフォーマンス向上のためよく使うGitデータをキャッシュします',
  repositoryCache: 'リポジトリキャッシュ', repositoryCacheDesc: 'UIの高速化のためリポジトリのメタデータをキャッシュします',
  resetCache: 'キャッシュをリセット', resetCacheDesc: 'すべてのキャッシュデータを削除して再構築します',
  logging: 'ログ',
  loggingLevel: 'ログレベル', loggingLevelDesc: 'アプリケーションログの詳細度を制御します',

  aboutTagline: 'Gitを隠さずに、わかりやすくする',
  versionInfo: 'バージョン情報', resources: 'リソース',
  githubRepo: 'GitHubリポジトリ', githubRepoDesc: 'ソースコードを見る',
  documentation: 'ドキュメント', documentationDesc: 'ユーザーガイド & APIリファレンス',
  reportIssue: '問題を報告', reportIssueDesc: 'バグレポートを送信',
  releaseNotes: 'リリースノート', releaseNotesDesc: 'このバージョンの新機能',
  privacyPolicy: 'プライバシーポリシー', privacyPolicyDesc: 'データの取り扱いについて',
  openSourceLicenses: 'オープンソースライセンス', openSourceLicensesDesc: 'サードパーティライブラリ',
  mitLicense: 'EasyGitはMITライセンスのもとで配布されています。',
};

// ── Korean ────────────────────────────────────────────────────────────────────
const ko: Translations = {
  navWorkspace: '작업 공간', navChanges: '변경사항', navHistory: '기록', navGraph: '그래프',
  navRepository: '저장소', navBranches: '브랜치', navStashes: '스태시', navTags: '태그',
  navRemotes: '원격', navSettings: '설정',
  btnPull: '풀', btnPush: '푸시', btnFetch: '페치', btnStash: '스태시', btnNewBranch: '새 브랜치',
  unstagedChanges: '스테이징되지 않은 변경사항', stagedChanges: '스테이징된 변경사항',
  noUnstagedChanges: '스테이징되지 않은 변경사항 없음', noStagedChanges: '스테이징된 변경사항 없음',
  stagedFilesCount: (c: number) => `${c}개의 파일이 스테이징됨`,
  commitMsgPlaceholder: '커밋 메시지 (필수)', commitDescPlaceholder: '설명 (선택 사항)',
  btnCommit: '커밋', btnCommitPush: '커밋 및 푸시',
  fileDetails: '파일 세부 정보', btnClosePanel: '패널 닫기',

  tabGeneral: '일반', tabAppearance: '모양', tabGit: 'Git',
  tabDiff: 'Diff·병합', tabCommit: '커밋', tabNotifications: '알림',
  tabShortcuts: '단축키', tabPlugins: '플러그인', tabAdvanced: '고급', tabAbout: '정보',

  settingsTitle: '설정', settingsSubtitle: 'EasyGit을 내 워크플로우에 맞게 설정하세요',
  btnSave: '변경사항 저장', btnCancel: '취소', btnReset: '기본값으로 초기화',
  btnBrowse: '찾아보기', btnDetectGit: 'Git 자동 감지', btnDetecting: '감지 중…',
  btnEditGlobalConfig: '글로벌 설정 편집', btnOpenDevTools: 'DevTools 열기',
  btnCheckUpdates: '업데이트 확인', btnChecking: '확인 중…',
  btnClearCache: '캐시 지우기', btnClearing: '지우는 중…',
  btnResetShortcuts: '모든 단축키를 기본값으로 초기화',
  btnBrowseMarketplace: '마켓플레이스 보기',
  btnOpenMergeEditor: '병합 편집기 열기',
  confirmReset: '모든 설정을 기본값으로 초기화하시겠습니까? 이 작업은 취소할 수 없습니다.',

  generalTitle: '일반',
  language: '언어', languageDesc: '선호하는 언어를 선택하세요',
  startOnStartup: '시스템 시작 시 EasyGit 실행', startOnStartupDesc: '로그인할 때 EasyGit을 자동으로 시작합니다',
  defaultRepoDir: '기본 저장소 디렉토리', defaultRepoDirDesc: '저장소를 열 때의 기본 디렉토리',
  checkForUpdates: '업데이트 확인', checkForUpdatesDesc: '시작 시 자동으로 업데이트를 확인합니다',

  appearanceTitle: '모양',
  theme: '테마', themeDesc: '선호하는 테마를 선택하세요',
  themeLight: '밝음', themeDark: '어두움', themeSystem: '시스템',
  accentColor: '강조 색상', accentColorDesc: 'EasyGit의 강조 색상을 선택하세요',
  fontSize: '글꼴 크기', fontSizeDesc: '애플리케이션 글꼴 크기를 조정하세요',
  density: '인터페이스 밀도', densityDesc: 'UI 요소의 간격과 크기를 조정하세요',
  densityComfortable: '편안함', densityCompact: '컴팩트', densitySpacious: '넓음',
  enableAnimations: '애니메이션 활성화', enableAnimationsDesc: '인터페이스 전반에 부드러운 애니메이션을 활성화합니다',

  gitTitle: 'Git', gitConfiguration: '구성',
  gitExePath: 'Git 실행 파일 경로', gitExePathDesc: '컴퓨터의 Git 바이너리 경로',
  gitVersion: 'Git 버전', gitVersionDesc: '현재 감지된 Git 버전',
  defaultBranch: '기본 브랜치 이름', defaultBranchDesc: '새 저장소 초기화 시 기본 브랜치',
  userIdentity: '사용자 정보',
  userName: '사용자 이름', userNameDesc: '커밋에 사용되는 이름 (user.name)',
  userEmail: '이메일', userEmailDesc: '커밋에 사용되는 이메일 (user.email)',
  fetchSync: 'Fetch & 동기화',
  autoFetch: '자동 Fetch', autoFetchDesc: '백그라운드에서 원격 변경사항을 자동으로 fetch합니다',
  pruneStaleBranches: '오래된 브랜치 정리', pruneStaleBranchesDesc: '원격에 더 이상 없는 원격 추적 브랜치를 제거합니다',
  pushPull: 'Push & Pull',
  pushBehavior: 'Push 동작', pushBehaviorDesc: 'git push의 기본 동작을 설정합니다',
  pullBehavior: 'Pull 동작', pullBehaviorDesc: 'git pull이 변경사항을 통합하는 방법',
  autoStash: 'Pull 전 자동 Stash', autoStashDesc: 'Pull 전에 로컬 변경사항을 자동으로 stash합니다',
  security: '보안',
  signCommits: '커밋 서명', signCommitsDesc: 'GPG 또는 SSH 키로 커밋에 서명합니다',
  signingFormat: '서명 형식', signingFormatDesc: '서명 형식을 선택하세요',
  gitConfigEditor: 'Git 설정 편집기',

  diffTitle: 'Diff & 병합',
  diffView: 'Diff 보기', diffViewDesc: '파일 차이 표시 방법을 선택하세요',
  ignoreWhitespace: '공백 무시', ignoreWhitespaceDesc: '파일 비교 시 공백 변경을 무시합니다',
  wordWrap: '자동 줄 바꿈', wordWrapDesc: 'Diff 보기에서 긴 줄을 자동으로 줄 바꿈합니다',
  syntaxHighlighting: '구문 강조', syntaxHighlightingDesc: 'Diff 보기에서 코드 구문 강조를 적용합니다',
  showLineNumbers: '줄 번호 표시', showLineNumbersDesc: 'Diff 보기에서 줄 번호를 표시합니다',
  externalTools: '외부 도구',
  externalDiffTool: '외부 Diff 도구', externalDiffToolDesc: '외부 도구를 사용하여 파일 차이를 봅니다',
  mergeTool: '병합 도구', mergeToolDesc: '충돌 해결에 선호하는 도구를 선택하세요',
  conflictResolution: '충돌 해결',
  conflictHighlighting: '충돌 강조', conflictHighlightingDesc: '충돌 마커를 시각적으로 강조합니다',
  rememberConflictRes: '충돌 해결 방법 기억', rememberConflictResDesc: '이전 충돌 해결 선택을 기억합니다',

  commitTitle: '커밋', commitMessage: '메시지',
  msgTemplate: '커밋 메시지 템플릿', msgTemplateDesc: '커밋 메시지 작성 시 기본 템플릿',
  conventionalCommits: 'Conventional Commits', conventionalCommitsDesc: 'feat, fix, docs, refactor, test, chore 형식 지원을 활성화합니다',
  charLimit: '문자 제한', charLimitDesc: '커밋 메시지 첫 줄의 최대 문자 수',
  openCommitEditor: '커밋 편집기 열기', openCommitEditorDesc: '커밋 메시지 작성 시 전체 화면 편집기를 엽니다',
  authorSigning: '작성자 & 서명',
  showAuthorInfo: '작성자 정보 표시', showAuthorInfoDesc: '커밋 전에 사용자 이름과 이메일을 표시합니다',
  allowAmend: '마지막 커밋 수정', allowAmendDesc: '가장 최근 커밋을 수정할 수 있습니다',
  signOff: '커밋 서명', signOffDesc: 'Signed-off-by 줄을 자동으로 추가합니다',
  gpgSigning: 'GPG/SSH 커밋 서명', gpgSigningDesc: '모든 커밋에 암호화 서명을 합니다',
  warnings: '경고',
  warnEmptyCommit: '빈 커밋 전 경고', warnEmptyCommitDesc: '변경사항 없이 커밋하려 할 때 경고를 표시합니다',

  notificationsTitle: '알림', gitOperations: 'Git 작업',
  pushCompleted: 'Push 완료', pushCompletedDesc: 'Push 성공 시 알림',
  pullCompleted: 'Pull 완료', pullCompletedDesc: 'Pull 성공 시 알림',
  fetchCompleted: 'Fetch 완료', fetchCompletedDesc: 'Fetch 완료 시 알림',
  mergeCompleted: '병합 완료', mergeCompletedDesc: '병합 성공 시 알림',
  mergeConflict: '병합 충돌', mergeConflictDesc: '충돌 감지 시 즉시 경고',
  commitCompleted: '커밋 완료', commitCompletedDesc: '커밋 생성 시 알림',
  backgroundTasks: '백그라운드 작업', backgroundTasksDesc: '백그라운드 Git 작업에 대해 알림',
  updateAvailable: '업데이트 가능', updateAvailableDesc: '새 버전의 EasyGit이 있을 때 알림',
  system: '시스템',
  desktopNotifications: '데스크탑 알림', desktopNotificationsDesc: 'EasyGit의 Windows 시스템 알림을 표시합니다',
  sound: '소리', soundDesc: '알림이 나타날 때 소리를 재생합니다',

  shortcutsTitle: '단축키', searchShortcuts: '단축키 검색...',

  pluginsTitle: '플러그인', pluginsInstalled: '설치됨',
  pluginMarketplace: '플러그인 마켓플레이스', pluginMarketplaceDesc: 'EasyGit을 확장하는 플러그인을 찾아 설치하세요',
  developerMode: '개발자 모드', developerModeDesc: '디스크에서 로컬 미공개 플러그인을 불러올 수 있습니다',

  advancedTitle: '고급', advancedExpert: '전문가',
  experimentalFeatures: '실험적 기능', experimentalFeaturesDesc: '출시되지 않은 기능을 활성화합니다 (불안정할 수 있음)',
  network: '네트워크',
  proxy: '프록시', proxyDesc: 'Git 작업을 위한 HTTP/HTTPS 프록시 설정',
  sshKeyPath: 'SSH 키 경로', sshKeyPathDesc: 'Git용 커스텀 SSH 키 경로',
  credentialManager: '자격 증명 관리자', credentialManagerDesc: 'Git이 인증 자격 증명을 저장하는 방법',
  cachePerformance: '캐시 & 성능',
  gitCache: 'Git 캐시', gitCacheDesc: '성능 향상을 위해 자주 접근하는 Git 데이터를 캐시합니다',
  repositoryCache: '저장소 캐시', repositoryCacheDesc: 'UI 속도 향상을 위해 저장소 메타데이터를 캐시합니다',
  resetCache: '캐시 초기화', resetCacheDesc: '모든 캐시 데이터를 지우고 다시 빌드합니다',
  logging: '로깅',
  loggingLevel: '로그 수준', loggingLevelDesc: '애플리케이션 로그의 상세 수준을 조정합니다',

  aboutTagline: 'Git을 숨기지 않고 이해하기 쉽게',
  versionInfo: '버전 정보', resources: '리소스',
  githubRepo: 'GitHub 저장소', githubRepoDesc: '소스 코드 보기',
  documentation: '문서', documentationDesc: '사용자 가이드 & API 참조',
  reportIssue: '이슈 보고', reportIssueDesc: '버그 보고서 제출',
  releaseNotes: '릴리스 노트', releaseNotesDesc: '이 버전의 새 기능',
  privacyPolicy: '개인정보 처리방침', privacyPolicyDesc: '데이터 처리 방법',
  openSourceLicenses: '오픈소스 라이선스', openSourceLicensesDesc: '서드파티 라이브러리',
  mitLicense: 'EasyGit은 MIT 라이선스에 따라 배포됩니다.',
};

// ── Chinese ───────────────────────────────────────────────────────────────────
const zh: Translations = {
  navWorkspace: '工作区', navChanges: '更改', navHistory: '历史', navGraph: '图表',
  navRepository: '仓库', navBranches: '分支', navStashes: '储藏 (Stash)', navTags: '标签',
  navRemotes: '远程', navSettings: '设置',
  btnPull: '拉取 (Pull)', btnPush: '推送 (Push)', btnFetch: '获取 (Fetch)', btnStash: '储藏 (Stash)', btnNewBranch: '新分支',
  unstagedChanges: '未暂存的更改', stagedChanges: '已暂存的更改',
  noUnstagedChanges: '没有未暂存的更改', noStagedChanges: '没有已暂存的更改',
  stagedFilesCount: (c: number) => `已暂存 ${c} 个文件`,
  commitMsgPlaceholder: '提交消息 (必填)', commitDescPlaceholder: '描述 (可选)',
  btnCommit: '提交', btnCommitPush: '提交并推送',
  fileDetails: '文件详情', btnClosePanel: '关闭面板',

  tabGeneral: '通用', tabAppearance: '外观', tabGit: 'Git',
  tabDiff: 'Diff·合并', tabCommit: '提交', tabNotifications: '通知',
  tabShortcuts: '快捷键', tabPlugins: '插件', tabAdvanced: '高级', tabAbout: '关于',

  settingsTitle: '设置', settingsSubtitle: '自定义 EasyGit 以匹配您的工作流程',
  btnSave: '保存更改', btnCancel: '取消', btnReset: '恢复默认',
  btnBrowse: '浏览', btnDetectGit: '自动检测 Git', btnDetecting: '检测中…',
  btnEditGlobalConfig: '编辑全局配置', btnOpenDevTools: '打开 DevTools',
  btnCheckUpdates: '检查更新', btnChecking: '检查中…',
  btnClearCache: '清除缓存', btnClearing: '清除中…',
  btnResetShortcuts: '将所有快捷键重置为默认值',
  btnBrowseMarketplace: '浏览市场',
  btnOpenMergeEditor: '打开合并编辑器',
  confirmReset: '将所有设置重置为默认值？此操作无法撤销。',

  generalTitle: '通用',
  language: '语言', languageDesc: '选择您的首选语言',
  startOnStartup: '开机时启动 EasyGit', startOnStartupDesc: '登录时自动启动 EasyGit',
  defaultRepoDir: '默认仓库目录', defaultRepoDirDesc: '打开仓库时的默认目录',
  checkForUpdates: '检查更新', checkForUpdatesDesc: '启动时自动检查更新',

  appearanceTitle: '外观',
  theme: '主题', themeDesc: '选择您的首选主题',
  themeLight: '浅色', themeDark: '深色', themeSystem: '跟随系统',
  accentColor: '强调色', accentColorDesc: '选择 EasyGit 的强调色',
  fontSize: '字体大小', fontSizeDesc: '调整应用程序字体大小',
  density: '界面密度', densityDesc: '调整 UI 元素的间距和大小',
  densityComfortable: '舒适', densityCompact: '紧凑', densitySpacious: '宽松',
  enableAnimations: '启用动画', enableAnimationsDesc: '在整个界面中启用流畅动画',

  gitTitle: 'Git', gitConfiguration: '配置',
  gitExePath: 'Git 可执行文件路径', gitExePathDesc: '计算机上 Git 二进制文件的路径',
  gitVersion: 'Git 版本', gitVersionDesc: '当前检测到的 Git 版本',
  defaultBranch: '默认分支名称', defaultBranchDesc: '初始化新仓库时的默认分支',
  userIdentity: '用户身份',
  userName: '用户名', userNameDesc: '提交中使用的名称 (user.name)',
  userEmail: '电子邮件', userEmailDesc: '提交中使用的电子邮件 (user.email)',
  fetchSync: 'Fetch & 同步',
  autoFetch: '自动 Fetch', autoFetchDesc: '在后台自动获取远程更改',
  pruneStaleBranches: '清理过时分支', pruneStaleBranchesDesc: '删除远程上不再存在的远程跟踪分支',
  pushPull: 'Push & Pull',
  pushBehavior: 'Push 行为', pushBehaviorDesc: '配置 git push 的默认行为',
  pullBehavior: 'Pull 行为', pullBehaviorDesc: 'git pull 整合更改的方式',
  autoStash: 'Pull 前自动 Stash', autoStashDesc: 'Pull 前自动暂存本地更改',
  security: '安全',
  signCommits: '签名提交', signCommitsDesc: '使用 GPG 或 SSH 密钥对提交进行签名',
  signingFormat: '签名格式', signingFormatDesc: '选择签名格式',
  gitConfigEditor: 'Git 配置编辑器',

  diffTitle: 'Diff & 合并',
  diffView: 'Diff 视图', diffViewDesc: '选择文件差异的显示方式',
  ignoreWhitespace: '忽略空白', ignoreWhitespaceDesc: '比较文件时忽略空白更改',
  wordWrap: '自动换行', wordWrapDesc: '在 Diff 视图中自动换行显示长行',
  syntaxHighlighting: '语法高亮', syntaxHighlightingDesc: '在 Diff 视图中对代码应用语法高亮',
  showLineNumbers: '显示行号', showLineNumbersDesc: '在 Diff 视图中显示行号',
  externalTools: '外部工具',
  externalDiffTool: '外部 Diff 工具', externalDiffToolDesc: '使用外部工具查看文件差异',
  mergeTool: '合并工具', mergeToolDesc: '选择解决冲突的首选工具',
  conflictResolution: '冲突解决',
  conflictHighlighting: '冲突高亮', conflictHighlightingDesc: '直观地高亮显示冲突标记',
  rememberConflictRes: '记住冲突解决方案', rememberConflictResDesc: '记住之前的冲突解决选择',

  commitTitle: '提交', commitMessage: '消息',
  msgTemplate: '提交消息模板', msgTemplateDesc: '编写提交消息时的默认模板',
  conventionalCommits: 'Conventional Commits', conventionalCommitsDesc: '启用 feat, fix, docs, refactor, test, chore 格式辅助',
  charLimit: '字符限制', charLimitDesc: '提交消息第一行的最大字符数',
  openCommitEditor: '打开提交编辑器', openCommitEditorDesc: '编写提交消息时打开全屏编辑器',
  authorSigning: '作者 & 签名',
  showAuthorInfo: '显示作者信息', showAuthorInfoDesc: '提交前显示用户名和电子邮件',
  allowAmend: '修改最后一次提交', allowAmendDesc: '允许修改最近的提交',
  signOff: '提交签名', signOffDesc: '自动添加 Signed-off-by 行',
  gpgSigning: 'GPG/SSH 提交签名', gpgSigningDesc: '对每次提交进行加密签名',
  warnings: '警告',
  warnEmptyCommit: '空提交前警告', warnEmptyCommitDesc: '尝试在没有更改的情况下提交时显示警告',

  notificationsTitle: '通知', gitOperations: 'Git 操作',
  pushCompleted: 'Push 完成', pushCompletedDesc: 'Push 成功时通知',
  pullCompleted: 'Pull 完成', pullCompletedDesc: 'Pull 成功时通知',
  fetchCompleted: 'Fetch 完成', fetchCompletedDesc: 'Fetch 完成时通知',
  mergeCompleted: '合并完成', mergeCompletedDesc: '合并成功时通知',
  mergeConflict: '合并冲突', mergeConflictDesc: '检测到冲突时立即警告',
  commitCompleted: '提交完成', commitCompletedDesc: '创建提交时通知',
  backgroundTasks: '后台任务', backgroundTasksDesc: '通知后台 Git 操作',
  updateAvailable: '有可用更新', updateAvailableDesc: '有新版本 EasyGit 时通知',
  system: '系统',
  desktopNotifications: '桌面通知', desktopNotificationsDesc: '显示来自 EasyGit 的 Windows 系统通知',
  sound: '声音', soundDesc: '出现通知时播放声音',

  shortcutsTitle: '快捷键', searchShortcuts: '搜索快捷键...',

  pluginsTitle: '插件', pluginsInstalled: '已安装',
  pluginMarketplace: '插件市场', pluginMarketplaceDesc: '发现并安装插件以扩展 EasyGit',
  developerMode: '开发者模式', developerModeDesc: '允许从磁盘加载本地未发布的插件',

  advancedTitle: '高级', advancedExpert: '专家',
  experimentalFeatures: '实验性功能', experimentalFeaturesDesc: '启用未发布的功能（可能不稳定）',
  network: '网络',
  proxy: '代理', proxyDesc: '为 Git 操作配置 HTTP/HTTPS 代理',
  sshKeyPath: 'SSH 密钥路径', sshKeyPathDesc: 'Git 的自定义 SSH 密钥路径',
  credentialManager: '凭据管理器', credentialManagerDesc: 'Git 存储身份验证凭据的方式',
  cachePerformance: '缓存 & 性能',
  gitCache: 'Git 缓存', gitCacheDesc: '缓存常访问的 Git 数据以提高性能',
  repositoryCache: '仓库缓存', repositoryCacheDesc: '缓存仓库元数据以加速 UI',
  resetCache: '重置缓存', resetCacheDesc: '清除所有缓存数据并重新构建',
  logging: '日志',
  loggingLevel: '日志级别', loggingLevelDesc: '控制应用程序日志的详细程度',

  aboutTagline: '让 Git 易于理解，而不是隐藏它',
  versionInfo: '版本信息', resources: '资源',
  githubRepo: 'GitHub 仓库', githubRepoDesc: '查看源代码',
  documentation: '文档', documentationDesc: '用户指南 & API 参考',
  reportIssue: '报告问题', reportIssueDesc: '提交错误报告',
  releaseNotes: '发行说明', releaseNotesDesc: '此版本的新功能',
  privacyPolicy: '隐私政策', privacyPolicyDesc: '我们如何处理您的数据',
  openSourceLicenses: '开源许可证', openSourceLicensesDesc: '第三方库',
  mitLicense: 'EasyGit 根据 MIT 许可证授权。',
};

// ── Map ───────────────────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<Language, Translations> = {
  English: en,
  Vietnamese: vi,
  Japanese: ja,
  Korean: ko,
  Chinese: zh,
};
