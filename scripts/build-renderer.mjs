import { resolve, join } from 'path';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';

const sourceBinary = resolve(process.cwd(), 'node_modules/@esbuild/win32-x64/esbuild.exe');
const tempDir = join(tmpdir(), 'easygit-esbuild');
const tempBinary = join(tempDir, 'esbuild.exe');

if (existsSync(sourceBinary)) {
  mkdirSync(tempDir, { recursive: true });
  cpSync(sourceBinary, tempBinary, { force: true });
  process.env.ESBUILD_BINARY_PATH = tempBinary;
}

const { build } = await import('vite');
const { default: react } = await import('@vitejs/plugin-react');

await build({
  configFile: false,
  base: './',
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': resolve(process.cwd(), 'src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  server: {
    port: 5173,
  },
});
