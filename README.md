<div align="center">

<img src="public/logo.svg" width="80" alt="EasyGit Logo" />

# EasyGit

**A professional Git desktop client that makes Git understandable without hiding Git.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Platform: Windows | macOS | Linux](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com)
[![Built with Electron](https://img.shields.io/badge/Built%20with-Electron%20%2B%20React-blueviolet)](https://electronjs.org)
[![Version](https://img.shields.io/badge/Version-1.0.0-green)](./package.json)

</div>

---

## ✨ Giới thiệu

**EasyGit** là ứng dụng Git client dành cho máy tính để bàn, được xây dựng với triết lý đơn giản:

> *"Make Git understandable without hiding Git."*

Thay vì che đi sự phức tạp của Git, EasyGit hiển thị đầy đủ thông tin nhưng trình bày theo cách trực quan, thân thiện và dễ hiểu — phù hợp cho cả người mới bắt đầu lẫn lập trình viên có kinh nghiệm.

---

## 🚀 Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 📂 **Open & Clone** | Mở repository có sẵn hoặc clone từ GitHub, GitLab, Bitbucket |
| 🌱 **New Repository** | Khởi tạo repository mới với `git init` chỉ bằng 1 cú click |
| 📋 **Changes View** | Xem toàn bộ file đã sửa, Stage/Unstage từng file hoặc tất cả cùng lúc |
| ✅ **Commit & Push** | Viết commit message và đẩy code lên remote trong cùng một bước |
| ↩️ **Undo Commit** | Hoàn tác commit cuối cùng, giữ nguyên code trong working directory |
| 🌿 **Branch Management** | Tạo nhánh mới, xem danh sách nhánh, checkout chuyển nhánh nhanh |
| 📜 **History** | Xem lịch sử commit với thông tin tác giả, ngày giờ, message đầy đủ |
| 🔀 **Commit Graph** | Biểu đồ cây commit trực quan thể hiện cấu trúc nhánh và merge |
| 📦 **Stash** | Lưu tạm thay đổi đang làm dở để chuyển sang việc khác |
| 🔄 **Fetch / Pull** | Đồng bộ code với remote một cách nhanh chóng |
| 🌍 **Đa ngôn ngữ** | Hỗ trợ Tiếng Việt, English, 日本語, 한국어, 中文 |
| 🎨 **Dark Mode** | Giao diện tối hiện đại, dễ nhìn, phù hợp làm việc lâu dài |

---

## 📸 Giao diện

> *Screenshots sẽ được cập nhật sau khi phiên bản ổn định được phát hành.*

---

## 🛠️ Công nghệ sử dụng

- **[Electron](https://electronjs.org)** — Nền tảng desktop cross-platform
- **[React 18](https://react.dev)** — UI framework
- **[TypeScript](https://typescriptlang.org)** — Type safety
- **[Zustand](https://zustand-demo.pmnd.rs)** — State management
- **[Vite](https://vitejs.dev)** — Build tool

---

## 💻 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- **Node.js** >= 18.x
- **npm** >= 9.x
- **Git** được cài đặt và có trong PATH

### Bắt đầu nhanh

```bash
# 1. Clone dự án về máy
git clone https://github.com/your-username/EasyGit.git
cd EasyGit

# 2. Cài đặt dependencies
npm install

# 3. Chạy ở chế độ phát triển (Development)
npm run dev
```

### Build phiên bản phân phối

```bash
# Build production bundle
npm run build

# Đóng gói thành file cài đặt (.exe / .dmg / .AppImage)
npm run package
```

---

## 📂 Cấu trúc dự án

```
EasyGit/
├── electron/          # Main process & Preload scripts
│   ├── main.ts        # Electron main process + Git IPC handlers
│   └── preload.ts     # Context bridge (expose API to Renderer)
├── src/
│   ├── components/    # UI Components (Toolbar, Sidebar, CommitComposer...)
│   ├── views/         # Các màn hình chính (Changes, History, Branches...)
│   ├── store/         # Zustand state management
│   ├── services/      # Git output parser
│   ├── types/         # TypeScript type definitions
│   └── i18n/          # Đa ngôn ngữ
├── public/            # Static assets
└── package.json
```

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork dự án
2. Tạo nhánh mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m 'Add: mô tả tính năng'`
4. Push lên nhánh: `git push origin feature/ten-tinh-nang`
5. Mở Pull Request

---

## 📄 Bản quyền

Dự án được phân phối theo giấy phép **MIT License**. Xem file [LICENSE](./LICENSE) để biết thêm chi tiết.

---

<div align="center">
Made with ❤️ by the EasyGit Team
</div>
