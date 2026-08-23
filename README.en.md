<div align="center">

<img src="asssets/easygitlogo.png" width="96" alt="EasyGit Logo" />

# EasyGit

**A professional Git desktop client that makes Git understandable without hiding Git.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Platform: Windows | macOS | Linux](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com)
[![Built with Electron](https://img.shields.io/badge/Built%20with-Electron%20%2B%20React-blueviolet)](https://electronjs.org)
[![Version](https://img.shields.io/badge/Version-1.0.0-green)](./package.json)

</div>

---

## About

EasyGit is a desktop Git client built with Electron, React, TypeScript, and Vite. It is designed to make Git easier to understand while still showing the important details.

## Highlights

- Open an existing repository or clone a new one
- View changes, history, branches, stashes, tags, and remotes
- Stage, unstage, discard, restore, commit, push, pull, fetch, merge, rebase, and reset
- Built-in command palette and Git operation terminal
- Settings for appearance, Git, diff, commit, notifications, shortcuts, plugins, and advanced options
- Windows installer can create a Desktop shortcut

## Download the packaged app

If you want to install the final app, do not clone the source code. Download the installer from GitHub Releases instead:

[Download the latest EasyGit release](https://github.com/phamtuandat2005/EasyGit/releases/latest)

That release contains the final packaged app, including:

- the Windows installer `.exe`
- the app icon
- Desktop shortcut support
- Start Menu shortcut support

## Build from source

```bash
npm install
npm run dev
```

Package the app:

```bash
npm run package
```

## Project Structure

```text
EasyGit/
├── electron/
├── src/
├── dist/
├── dist-electron/
├── asssets/
└── package.json
```

## License

MIT. See [LICENSE](./LICENSE).
