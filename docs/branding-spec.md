# Branding Spec — Bộ icon & splash KKorea Hangul

Tài liệu này mô tả **đầy đủ các file ảnh cần tạo**, quy tắc kỹ thuật của từng file,
và **prompt sẵn để copy** vào công cụ tạo ảnh AI (Midjourney, DALL-E, Gemini, Ideogram…).
Sau khi có ảnh, chỉ cần ghi đè vào thư mục `assets/` (giữ nguyên tên file) rồi chạy prebuild — mọi wiring trong `app.json` đã làm sẵn.

## Định hướng thương hiệu (dùng chung cho MỌI prompt)

- **Motif:** một chữ Hangul **ㅎ** cách điệu — hình tròn + nét ngang + nét mũ, đối xứng, dễ nhận diện là "tiếng Hàn". Vẽ dạng vector flat, nét dày bo tròn, thân thiện. **Không** chữ Latin, **không** tên app trong icon.
- **Bảng màu (nêu rõ hex trong prompt):**
  - Tím nhạt pastel nền splash: `#E7DFF6`
  - Xanh tím nhạt nền adaptive: `#EEF2FF`
  - Màu chính của glyph (primary): `#4A6CF7`
  - Có thể thêm gradient phụ hồng pastel `#FFE1F0` / xanh ngọc `#E4F8FF` (trùng gradient nền app)
- **Phong cách:** flat vector, gradient mềm kiểu "liquid glass", ánh sáng nhẹ bên trong, KHÔNG 3D, KHÔNG đổ bóng ra ngoài hình, KHÔNG photorealism. Bố cục căn giữa, nhiều khoảng trống.

## Danh sách asset cần tạo

| File (ghi đè vào `assets/`) | Kích thước | Nền | Ghi chú |
|---|---|---|---|
| `icon.png` | 1024×1024 | Đục (không alpha) | Icon chính iOS/store |
| `android-icon-foreground.png` | 1024×1024 | Trong suốt | Lớp trước adaptive icon |
| `android-icon-background.png` | 1024×1024 | Đục | Lớp nền adaptive icon (file cũ 512px — cần tạo lại) |
| `android-icon-monochrome.png` | 1024×1024 | Trong suốt | Themed icon Android 13+ (file cũ 432px — cần tạo lại) |
| `splash-icon.png` | 1024×1024 | Trong suốt | Logo splash (plugin native + overlay AppSplash) |
| `favicon.png` | 512×512 | Tuỳ ý | Thu nhỏ từ `icon.png`, không cần prompt riêng |
| ~~`splash-full.png`~~ | — | — | **Đã khai tử** — không cần tạo lại (Android 12+ không dùng splash full-image) |

## Quy tắc kỹ thuật từng file

### 1. `icon.png` — icon chính
- **KHÔNG bo góc sẵn** (iOS/Android tự bo). Artwork tràn full hình vuông.
- **KHÔNG có kênh alpha** (iOS từ chối icon trong suốt).
- Glyph ㅎ chiếm ~60-70% giữa hình; tránh chi tiết quan trọng ở 10% rìa ngoài.
- Kiểm tra icon khi thu nhỏ còn 48px — glyph vẫn phải rõ.

**Prompt (copy):**
> Flat vector app icon, a single stylized Korean Hangul letter "ㅎ" (hieut): a circle with a horizontal stroke and a small cap above it, drawn with thick rounded strokes in vivid indigo blue #4A6CF7, centered on a soft pastel gradient background blending lavender #E7DFF6, periwinkle #EEF2FF and a hint of pastel pink #FFE1F0. Soft inner glow, subtle glassmorphism feel. Modern, friendly, minimal, generous negative space. Full-bleed square, NO rounded corners, no text, no letters other than the Hangul glyph, no 3D, no drop shadow, no photorealism. 1024x1024.

### 2. `android-icon-foreground.png` — lớp trước adaptive icon
- Chỉ chứa glyph, **nền phải xoá thành trong suốt**.
- **Vùng an toàn:** toàn bộ glyph nằm trong vòng tròn đường kính ~66% canvas (~676px trên 1024). Phần ngoài vòng này sẽ bị launcher cắt/mask (tròn, squircle…) và dịch chuyển parallax.
- Mẹo: AI không xuất được nền trong suốt thật → yêu cầu nền màu đặc dễ tách (xanh lá #00FF00) rồi dùng công cụ remove background.

**Prompt (copy):**
> Flat vector icon glyph only: a single stylized Korean Hangul letter "ㅎ" (hieut) — circle, horizontal stroke, small cap — thick rounded strokes, vivid indigo blue #4A6CF7 with a subtle lighter blue gradient. The glyph is centered and occupies only the central 60% of the canvas, with large empty margin around it. Solid pure green #00FF00 background for easy background removal. No text, no shadow, no 3D. 1024x1024.
>
> *(Sau khi tạo: remove background → xuất PNG trong suốt.)*

### 3. `android-icon-background.png` — lớp nền adaptive icon
- Không chứa glyph, chỉ nền. Đục hoàn toàn.
- Không đặt chi tiết gần rìa (bị parallax + crop).

**Prompt (copy):**
> Abstract soft pastel gradient background, blending light periwinkle #EEF2FF, lavender #E7DFF6 and a faint pastel pink #FFE1F0, very subtle diagonal light sweep, completely smooth, no shapes, no text, no pattern detail near the edges. Flat minimal wallpaper style. 1024x1024.

### 4. `android-icon-monochrome.png` — themed icon Android 13+
- **Silhouette TRẮNG thuần** (một màu duy nhất) của đúng glyph ㅎ, nền trong suốt.
- Cùng vùng an toàn 66% như foreground. Không gradient, không viền mảnh hơn ~30px (3% canvas).
- Có thể tự làm từ foreground: đổ trắng toàn bộ glyph. Nếu dùng AI:

**Prompt (copy):**
> Pure white flat silhouette of a single stylized Korean Hangul letter "ㅎ" (hieut) — circle, horizontal stroke, small cap — thick rounded strokes, one solid white color only, no gradient, no outline. Centered, occupying only the central 60% of the canvas. Solid black background for easy background removal. 1024x1024.
>
> *(Sau khi tạo: remove nền đen → PNG trong suốt.)*

### 5. `splash-icon.png` — logo splash
- **Cùng glyph** với icon để chuyển tiếp icon→splash→app liền mạch.
- Logo chiếm ~60% giữa canvas, phần còn lại trong suốt (plugin hiển thị ở 200dp trên nền màu `#E7DFF6` / dark `#141634`; overlay AppSplash hiển thị 176×176).
- Nên thêm phiên bản glyph có gradient đẹp hơn một chút so với monochrome.

**Prompt (copy):**
> Flat vector logo mark: a single stylized Korean Hangul letter "ㅎ" (hieut) with thick rounded strokes, vivid indigo blue #4A6CF7 flowing into a soft violet gradient, subtle inner glow, floating centered on a solid pure green #00FF00 background for easy removal, glyph occupies the central 60% with generous empty margin. Friendly, modern, minimal, no text, no shadow, no 3D. 1024x1024.
>
> *(Sau khi tạo: remove background → PNG trong suốt. Lưu ý: logo này phải trông ổn trên cả nền sáng #E7DFF6 lẫn nền tối #141634.)*

### 6. `favicon.png`
Không cần prompt — downscale `icon.png` xuống 512×512 (hoặc 196×196 như file cũ).

## Checklist sau khi có ảnh

1. Ghi đè 5-6 file vào `assets/` (đúng tên file như bảng trên).
2. Kiểm tra: `icon.png` KHÔNG có alpha; 3 file foreground/monochrome/splash-icon CÓ nền trong suốt.
3. Commit trước, rồi chạy: `npx expo prebuild --platform android --clean`
   - Lệnh này **ghi lại toàn bộ** thư mục `android/` (mipmap, colors.xml, drawable splash) — review diff sau khi chạy.
4. Chạy thử trên emulator/thiết bị Android:
   - Icon launcher hiển thị đúng, không bị crop glyph trên mask tròn.
   - Android 13+: bật themed icon để kiểm tra bản monochrome.
   - Splash native (sáng + tối) → chuyển sang AppSplash overlay không lộ seam.
   - Thu nhỏ icon 48px vẫn nhận ra glyph.
5. Nếu đổi tông màu nền splash: cập nhật `backgroundColor`/`dark.backgroundColor` trong `app.json` (plugin `expo-splash-screen`) cho khớp đầu gradient của `ScreenBackground`.
6. Follow-up (tuỳ chọn): chạy lại Maestro capture để cập nhật screenshot README.

## Wiring đã làm sẵn (không cần đụng lại)

- `app.json`: đã bỏ key `splash` legacy, đăng ký plugin `expo-splash-screen` (image 200dp, nền sáng `#E7DFF6`, nền tối `#141634`), adaptive icon đã trỏ đủ `foregroundImage` + `backgroundImage` + `monochromeImage`.
- Splash runtime 2 lớp trong `app/_layout.tsx` + `src/components/glass/AppSplash.tsx` giữ nguyên, không phụ thuộc ảnh mới.
