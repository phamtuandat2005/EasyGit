/**
 * Format a date string to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format a date string to a full readable date
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate a hash to the given length
 */
export function shortHash(hash: string, length = 7): string {
  return hash.slice(0, length);
}

/**
 * Get initials from a name (e.g., "Sarah Chen" → "SC")
 */
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a consistent color from a string
 */
export function stringToColor(str: string): string {
  const colors = [
    '#58a6ff', '#3fb950', '#f85149', '#bc8cff',
    '#d29922', '#39d2c0', '#e3b341', '#f778ba',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Format file size in bytes to human-readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format a file path to show only the last N segments
 */
export function shortenPath(path: string, maxSegments = 3): string {
  if (!path) return '';
  const segments = path.split('/');
  if (segments.length <= maxSegments) return path;
  return '…/' + segments.slice(-maxSegments).join('/');
}

/**
 * Get file extension from a path
 */
export function getFileExtension(path: string): string {
  if (!path) return '';
  const parts = path.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Get the file status label
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    added: 'Added',
    modified: 'Modified',
    deleted: 'Deleted',
    renamed: 'Renamed',
    copied: 'Copied',
    untracked: 'Untracked',
    conflict: 'Conflict',
  };
  return labels[status] || status;
}

/**
 * Get the file status letter (Git style)
 */
export function getStatusLetter(status: string): string {
  const letters: Record<string, string> = {
    added: 'A',
    modified: 'M',
    deleted: 'D',
    renamed: 'R',
    copied: 'C',
    untracked: 'U',
    conflict: '!',
  };
  return letters[status] || '?';
}
