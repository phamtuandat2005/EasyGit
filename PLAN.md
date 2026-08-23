# EasyGit Development Plan

## 1. Mục tiêu sản phẩm

EasyGit là Git desktop client giúp người dùng thực hiện các workflow Git phổ biến bằng giao diện trực quan, nhưng vẫn cho thấy:

- Repository đang ở trạng thái nào.
- Thao tác tương đương với lệnh Git nào.
- Thao tác có thể gây mất dữ liệu hay không.
- Khi lỗi xảy ra, người dùng cần làm gì tiếp theo.

Mục tiêu của bản `1.0` là thay thế được Git CLI trong workflow hằng ngày của người dùng phổ thông và lập trình viên: mở repo, xem thay đổi, stage, commit, branch, merge, stash, fetch, pull và push.

Các thao tác nâng cao như rebase tương tác, worktree, submodule và Git LFS sẽ được triển khai sau khi nền tảng an toàn và ổn định.

## 2. Nguyên tắc phát triển

1. Không báo thành công nếu chưa xác nhận trạng thái Git sau thao tác.
2. Mọi thao tác destructive phải có cảnh báo, mô tả ảnh hưởng và khả năng hủy.
3. Lỗi Git phải giữ được `code`, `stderr`, lệnh đã chạy và ngữ cảnh repository.
4. Không để renderer tự thực thi lệnh hoặc nhận quyền Node.js không cần thiết.
5. Mỗi tính năng phải có ít nhất một test cho happy path và một test cho lỗi phổ biến.
6. UI phải hoạt động tốt khi repository rỗng, không có remote, detached HEAD, có conflict và có file chưa track.

## 3. Trạng thái hiện tại và tiêu chí thoát giai đoạn nền tảng

Hiện tại:

- Đã có kiến trúc Electron main/preload và React renderer.
- Đã có view cho Changes, History, Graph, Branches và Stash.
- Đã có nhiều IPC handler cho Git cơ bản, merge, stash và reset.
- `npm run build` đang lỗi TypeScript tại [src/components/layout/Sidebar/RepositorySwitcher.tsx](src/components/layout/Sidebar/RepositorySwitcher.tsx).
- `npm test` chưa có test file để chạy.
- Git Graph hiện mới là bản đơn giản, chưa tính lane theo topology thật của commit.

Giai đoạn nền tảng chỉ được coi là hoàn thành khi:

- `npm run build` chạy thành công.
- `npm test` có test thật và chạy thành công.
- Có E2E cho workflow mở repo → stage → commit → tạo branch → merge.
- Mọi thao tác chính đều có loading, success và error state.

## 4. Roadmap triển khai

### Phase 0 - Khôi phục baseline và chia lớp lỗi

**Mục tiêu:** Làm cho dự án build được, có quy trình kiểm tra và không che giấu lỗi.

**Công việc:**

- Sửa lỗi `path: string | null` trong `RepositorySwitcher`.
- Kiểm tra lại `npm run build`, `npm run dev:electron` và `npm run package`.
- Tạo cấu trúc test cho parser, Git service, store và IPC.
- Chuẩn hóa kết quả IPC:

  ```ts
  type GitResult<T = undefined> = {
    success: boolean;
    data?: T;
    stdout?: string;
    stderr?: string;
    code?: number | string;
    error?: string;
  };
  ```

- Tách lỗi kỹ thuật khỏi thông báo UI thân thiện.
- Không dùng `window.confirm` rải rác; dùng một confirmation modal thống nhất.
- Ghi command history với thời gian, action, repository, kết quả và duration.

**Tiêu chí hoàn thành:**

- Build pass.
- Có test chạy được bằng `npm test`.
- Một lỗi push/checkout giả lập hiển thị được nguyên nhân từ Git và hướng xử lý.

### Phase 1 - Git execution layer an toàn và đáng tin cậy

**Mục tiêu:** Củng cố lớp Electron chịu trách nhiệm chạy Git.

**Công việc:**

- Giữ việc chạy lệnh bằng `execFile` với mảng arguments, không nối command thành shell string.
- Chuẩn hóa xử lý `stdout`, `stderr`, exit code, timeout và cancellation.
- Thêm timeout riêng cho thao tác nhanh và thao tác mạng.
- Hỗ trợ progress cho clone, fetch, pull và push bằng `spawn` nếu cần đọc progress từ stderr.
- Cho phép hủy thao tác đang chạy.
- Validate repository path và canonicalize path trước khi truyền vào Git.
- Kiểm tra repository root, bare repository và subdirectory.
- Xử lý tên file có khoảng trắng, Unicode, newline, rename và conflict bằng format máy đọc được như `--porcelain=v2 -z`.
- Sửa clone để destination được chọn rõ ràng và không phụ thuộc vào current working directory.
- Audit Electron settings: `contextIsolation`, `sandbox`, `nodeIntegration`, preload API tối thiểu.

**Tiêu chí hoàn thành:**

- Test được path Windows, path có khoảng trắng và repository mở từ subdirectory.
- Clone/pull/push có progress, lỗi auth không làm treo UI và có thể cancel.
- Không có API IPC nhận command tùy ý từ renderer.

### Phase 2 - Changes và Diff hoàn chỉnh

**Mục tiêu:** Biến Changes View thành workflow staging thực tế.

**Công việc:**

- Phân biệt rõ staged diff và unstaged diff.
- Xử lý file untracked, deleted, renamed, copied, binary và conflict.
- Sửa parser diff để không đếm nhầm dòng metadata và xử lý dòng `\ No newline at end of file`.
- Hiển thị diff theo file với header, trạng thái và thống kê chính xác.
- Thêm stage/unstage từng hunk.
- Thêm stage selected lines.
- Thêm discard file và discard hunk với modal xác nhận.
- Thêm nút mở file trong editor mặc định.
- Cập nhật status sau mỗi thao tác, kể cả khi thao tác thất bại một phần.
- Tự refresh khi file trong repository thay đổi trên ổ đĩa.

**Tiêu chí hoàn thành:**

- Người dùng có thể stage một hunk nhưng giữ hunk khác ở working tree.
- Discard luôn cảnh báo dữ liệu sẽ mất.
- Diff của file untracked/binary/rename không làm UI crash.

### Phase 3 - Commit, History và Graph chính xác

**Mục tiêu:** Cung cấp lịch sử commit có thể dùng để điều hướng và thao tác.

**Công việc:**

- Thêm commit details: full message, author email, parents, files changed và stats.
- Thêm amend commit.
- History hỗ trợ pagination hoặc load more thay vì tải cố định 300 commit.
- Viết lại graph layout dựa trên parent hashes và active lanes, không dựa trên author.
- Xử lý merge commit, branch creation/deletion, tag và remote ref.
- Thêm context menu cho commit:
  - Create branch.
  - Checkout.
  - Cherry-pick.
  - Revert.
  - Reset với cảnh báo.
  - Copy hash.
- Virtualize list khi repository có lịch sử lớn.

**Tiêu chí hoàn thành:**

- Graph đúng với repository có branch diverge và merge nhiều nhánh.
- Click commit hiển thị đầy đủ details và diff.
- Không freeze UI với repository có hàng chục nghìn commit.

### Phase 4 - Branch, Remote và đồng bộ

**Mục tiêu:** Hoàn chỉnh workflow làm việc với branch và remote.

**Công việc:**

- Branch list phân nhóm local, remote, stale và current.
- Tạo branch từ HEAD hoặc một commit được chọn.
- Checkout branch có cảnh báo nếu working tree chưa sạch.
- Rename/delete branch với validation tên branch.
- Hiển thị upstream, ahead/behind và trạng thái chưa có upstream.
- Remote manager: list, add, edit, remove remote.
- Push branch mới và set upstream.
- Fetch, pull, push có progress và kết quả chi tiết.
- Force push chỉ cho phép sau confirmation riêng, ưu tiên `--force-with-lease`.
- Hỗ trợ publish branch và tracking branch.

**Tiêu chí hoàn thành:**

- Người dùng hiểu branch đang ahead/behind bao nhiêu commit.
- Push branch mới có thể thiết lập upstream bằng UI.
- Push bị reject có nút dẫn tới pull/rebase phù hợp.

### Phase 5 - Merge và Conflict Resolution

**Mục tiêu:** Không để người dùng bị mắc kẹt khi merge conflict.

**Công việc:**

- Hiển thị rõ trạng thái merge đang diễn ra trong toàn app.
- Liệt kê conflict theo file và trạng thái resolved/unresolved.
- Cho phép mở file bằng VS Code/editor mặc định.
- Hỗ trợ chọn ours/theirs, nhưng không coi đó là cách giải quyết duy nhất.
- Thêm action mark resolved sau khi người dùng chỉnh sửa tay.
- Thêm continue merge và abort merge.
- Hiển thị merge commit message.
- Phân biệt merge conflict, cherry-pick conflict và rebase conflict.
- Kiểm tra conflict status sau mỗi lần refresh hoặc mở lại app.

**Tiêu chí hoàn thành:**

- Có thể tạo conflict trong test repository, giải quyết, continue và hoàn tất merge.
- Có thể abort mà không làm mất thay đổi ngoài merge.
- App khôi phục đúng trạng thái nếu bị đóng giữa lúc conflict.

### Phase 6 - Stash và Git nâng cao có kiểm soát

**Mục tiêu:** Mở rộng khả năng nhưng vẫn bảo vệ người dùng khỏi thao tác nguy hiểm.

**Công việc:**

- Tạo stash với message và tùy chọn include untracked.
- Apply, pop, drop và tạo branch từ stash.
- Hiển thị diff của stash.
- Revert commit từ History và Graph.
- Cherry-pick commit với conflict workflow dùng chung.
- Reset soft/mixed/hard với preview và confirmation nhiều bước.
- Tag lightweight và annotated.
- Rebase thường trước; interactive rebase chỉ triển khai sau khi có mô hình operation rõ ràng.
- Đánh dấu các tính năng chưa hỗ trợ như submodule, LFS, worktree thay vì hiển thị nút không hoạt động.

**Tiêu chí hoàn thành:**

- Mọi thao tác destructive đều mô tả phạm vi ảnh hưởng.
- Hard reset yêu cầu nhập lại target hoặc xác nhận rõ ràng.
- Conflict từ cherry-pick/rebase không bị xử lý nhầm như merge.

### Phase 7 - UX, hiểu Git và khả năng tiếp cận

**Mục tiêu:** Giúp người mới hiểu thao tác mà không làm chậm người dùng có kinh nghiệm.

**Công việc:**

- Command palette cho toàn bộ action khả dụng theo context.
- Command preview: hiển thị lệnh Git tương đương trước khi chạy.
- Command inspector: xem command, output, stderr và thời gian chạy.
- Explain operation và Explain error bằng nội dung giải thích cố định, có kiểm chứng; không phụ thuộc bắt buộc vào AI.
- Toast có trạng thái đang chạy, thành công, thất bại và retry.
- Empty/loading/error state nhất quán cho mọi view.
- Recent repositories, favorite repositories và reopen repository gần nhất.
- Keyboard shortcuts có màn hình cấu hình và tránh xung đột với hệ điều hành.
- Accessibility: keyboard navigation, focus trap trong modal, aria-label, màu không chỉ dựa vào màu sắc.
- Hoàn thiện i18n: không hard-code text tiếng Anh/Việt trong component.

**Tiêu chí hoàn thành:**

- Người dùng mới hoàn tất workflow commit đầu tiên mà không cần mở terminal.
- Người dùng có kinh nghiệm vẫn xem được command và output thật.
- Có thể sử dụng các workflow chính chỉ bằng bàn phím.

### Phase 8 - Performance, packaging và release

**Mục tiêu:** Đưa ứng dụng từ prototype thành bản phát hành ổn định.

**Công việc:**

- Background queue cho Git operation và khóa thao tác xung đột cùng repository.
- Cache có invalidation cho log, branch và status.
- Virtualization cho file list, history và graph.
- Test repository nhỏ, vừa, rất lớn và repository có nhiều binary file.
- Crash handling và log rotation.
- Windows installer trước; sau đó macOS và Linux.
- Code signing và kiểm tra quyền file.
- Auto update sau khi có kênh phát hành ổn định.
- CI chạy build, unit test, E2E và package trên từng nền tảng mục tiêu.
- Cập nhật README và REPORT theo trạng thái thực tế, không đánh dấu tính năng chỉ có UI là đã hoàn thiện.

**Tiêu chí hoàn thành:**

- Có artifact cài đặt reproducible.
- CI pass trên Windows, macOS và Linux nếu các nền tảng đó được hỗ trợ.
- Có release checklist và hướng dẫn rollback.

## 5. Bộ test bắt buộc

### Unit tests

- `parseStatus`: modified, added, deleted, untracked, rename, conflict, path có khoảng trắng.
- `parseLog`: root commit, merge commit, tag, local ref, remote ref, message có ký tự phân cách.
- `parseDiff`: add/delete/context, binary, nhiều hunk, no-newline marker.
- Graph layout: branch diverge, merge commit, branch/tag refs.

### Integration tests

- Open repository hợp lệ và đường dẫn không hợp lệ.
- Stage/unstage file và hunk.
- Commit không message, commit không staged file, commit thành công.
- Checkout khi working tree sạch và bẩn.
- Push/pull/fetch không có remote, không có upstream và bị reject.
- Stash apply/pop/drop.
- Merge fast-forward, merge commit, conflict và abort.
- Reset/revert/cherry-pick với lỗi.

### E2E tests

Mỗi test tạo một temporary Git repository riêng, không sử dụng repository thật của developer:

1. Mở app và open repository.
2. Tạo file, xem file trong Changes.
3. Stage file và kiểm tra staged state.
4. Commit và kiểm tra History.
5. Tạo branch, checkout và kiểm tra current branch.
6. Tạo hai thay đổi gây conflict, resolve và hoàn tất merge.
7. Đóng/mở lại app và kiểm tra repository state được khôi phục.

## 6. Definition of Done cho một tính năng

Một tính năng chỉ được coi là hoàn thành khi có đủ:

- IPC/main handler hoặc service tương ứng.
- Preload API typed.
- Store action và state rõ ràng.
- UI success/loading/error/empty state.
- Confirmation nếu có rủi ro mất dữ liệu.
- Unit hoặc integration test.
- E2E nếu là workflow người dùng.
- Translation cho toàn bộ text UI.
- Cập nhật README/REPORT nếu thay đổi phạm vi hỗ trợ.

## 7. Sprint đề xuất

### Sprint 1 - Baseline

- Sửa build.
- Tạo test harness.
- Chuẩn hóa GitResult và error display.
- Audit Electron security cơ bản.

### Sprint 2 - Changes

- Sửa status/diff parser.
- Stage/unstage/discard.
- Stage hunk.
- Test Changes workflow.

### Sprint 3 - History và Graph

- Commit details.
- Graph topology thật.
- Context menu commit.
- Test graph với merge repository.

### Sprint 4 - Branch và Remote

- Upstream/ahead/behind.
- Remote manager.
- Push/pull/fetch progress.
- Test network error và branch publish.

### Sprint 5 - Conflict

- Merge state toàn app.
- Open editor, mark resolved, continue/abort.
- E2E merge conflict.

### Sprint 6 - Release candidate

- Performance.
- Accessibility/i18n.
- Installer.
- CI, crash logging và release checklist.

## 8. Ưu tiên nếu nguồn lực hạn chế

Ưu tiên bắt buộc:

1. Build pass và test thật.
2. Error handling và operation state.
3. Status/diff/stage chính xác.
4. Commit, branch, push/pull/fetch đáng tin cậy.
5. Merge conflict có thể hoàn tất hoặc abort.
6. Graph đúng topology.
7. Security Electron và destructive-operation warning.

Tạm hoãn:

- AI giải thích Git.
- Interactive rebase.
- Worktree.
- Submodule.
- Git LFS.
- Auto update.

Không nên phát hành bản production trước khi hoàn thành sáu mục bắt buộc đầu tiên.