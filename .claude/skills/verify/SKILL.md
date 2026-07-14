---
name: verify
description: Cách chạy và xác minh KKorea Hangul (Expo app) trong môi trường Claude Code.
---

# Verify KKorea Hangul

## Bề mặt khả dụng

- **Web (react-native-web)** — bề mặt duy nhất chạy được trong môi trường này.
  Máy không có Android emulator (SDK thiếu gói `emulator`, không có AVD); chỉ
  verify được trên thiết bị thật qua `adb` khi người dùng cắm máy.
- Launch: dùng preview server `expo-web` trong `.claude/launch.json`
  (`npx expo start --web --port 8081`). Bundle web lần đầu mất ~30–60s;
  đợi tới khi title tab đổi thành "KKorea Hangul".

## Gotchas trên web/browser pane

- **AppSplash che toàn màn hình và nuốt mọi click**: fade-out dựa vào
  `requestAnimationFrame`, browser pane throttle rAF nên splash không bao giờ
  unmount. Workaround: tìm overlay qua
  `document.elementFromPoint(...)` (textContent "KKorea Hangul") và set
  `style.display='none'` bằng javascript_tool trước khi tương tác.
- **`computer{action:"screenshot"}` timeout** trên app này (hiệu ứng
  blur/animation) — dùng `read_page` / `get_page_text` thay thế.
- Tọa độ ref của `read_page` có thể sai sau khi scroll — xác minh điểm click
  bằng `document.elementFromPoint` khi click "không ăn".
- **`Alert.alert` là no-op trên react-native-web**: mọi flow có confirm dialog
  (vd Khôi phục backup) không đi tiếp được trên web — chỉ verify được tới đó.
- expo-sharing: `navigator.share` không tồn tại trong pane → nhánh
  'unavailable'. Share sheet / document picker chỉ verify được trên native.
- AsyncStorage trên web = `localStorage` với key nguyên gốc (`kkh:*`);
  seed/inspect dữ liệu trực tiếp qua localStorage. Có thể spy
  `Storage.prototype.getItem` để chứng minh code path đã chạy.

## Flow đáng lái

- `/settings`: đổi ngôn ngữ (7 locale — kiểm tra key i18n mới ở ≥2 locale),
  section Sao lưu & Khôi phục, toggle nhắc ôn.
- Locale không persist (in-memory) — reload là về 'vi'.
