import { rm } from 'fs/promises';
import { resolve } from 'path';

const releaseDir = resolve(process.cwd(), 'release');

try {
  await rm(releaseDir, { recursive: true, force: true });
  console.log(`Removed ${releaseDir}`);
} catch (error) {
  console.error(`Failed to remove ${releaseDir}`);
  throw error;
}
