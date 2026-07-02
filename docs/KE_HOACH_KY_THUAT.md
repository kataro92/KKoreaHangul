# Kế hoạch kỹ thuật — 3 tính năng mới cho KKorea Hangul

> Tài liệu thiết kế trước khi code. Bao gồm: Ngữ pháp, Tập đọc (tự đọc → hiện phiên âm → nghe lại), và Từ vựng theo Spaced Repetition (kiểu Mochi Mochi).
> Quyết định đã chốt: kế hoạch chi tiết trước; Tập đọc **đơn giản hóa, không ghi âm** (hiện câu → chờ 30s → hiện phiên âm tiếng Việt + TTS đọc mẫu để người dùng tự đánh giá); nội dung Ngữ pháp **Claude tự soạn theo TOPIK**.

---

## 1. Hiện trạng dự án (điểm xuất phát)

| Khía cạnh | Hiện trạng |
|---|---|
| Framework | Expo SDK 55, Expo Router (file-based), React Native 0.83, React 19, TypeScript |
| Điều hướng | Tab layout ở `app/(tabs)/`: `index` (Chữ cái), `reading` (Đọc), `vocabulary` (Từ vựng). Nút bánh răng → `app/settings.tsx` |
| Âm thanh | `expo-speech` (chỉ TTS đọc ra, **không** có STT/ghi âm) |
| Dữ liệu | Tĩnh: `src/data/vocabulary.json` (TOPIK1: 73 từ, TOPIK2: 47 từ), `src/data/hangul.ts` |
| **Lưu trữ bền** | **Chưa có.** Toàn bộ state nằm trong RAM (useState/useRef), mất khi đóng app. Không có AsyncStorage / SQLite |
| i18n | `LanguageContext` với 7 ngôn ngữ, mặc định `vi`, hàm `t(key)` |
| Tiện ích | `decompose.ts` tách âm tiết Hangul → phụ âm đầu / nguyên âm / phụ âm cuối |

### 1.1 Nợ kỹ thuật cần xử lý trước

1. **Bug trùng key `vi`** trong `LanguageContext.tsx` (khai báo 2 lần, dòng ~148 và ~179). Bản đầu thiếu nhiều field. Cần **gộp làm một** để tránh nhầm lẫn và cảnh báo TypeScript.
2. **Chưa có lớp lưu trữ.** Cả 3 tính năng mới (đặc biệt SR và tiến độ học) **bắt buộc** cần lưu bền. Đây là hạng mục nền tảng, làm trước tiên.
3. **i18n phình to.** File `LanguageContext.tsx` đã ~690 dòng. Thêm 3 tính năng sẽ khiến nó khó bảo trì → nên tách `translations` ra `src/i18n/<locale>.ts`.

---

## 2. Hạ tầng nền tảng (làm trước mọi tính năng)

### 2.1 Lớp lưu trữ bền

Thêm thư viện:

```bash
npx expo install @react-native-async-storage/async-storage
```

- **AsyncStorage** đủ cho khối lượng dữ liệu của app (vài trăm → vài nghìn thẻ từ). Đơn giản, không cần schema.
- Nếu về sau dữ liệu lớn / cần truy vấn phức tạp (lọc thẻ đến hạn theo ngày với hàng chục nghìn thẻ) → cân nhắc `expo-sqlite`. **Giai đoạn này chọn AsyncStorage.**

Tạo `src/storage/store.ts` — lớp bọc mỏng:

```ts
// Đọc/ghi JSON có typed key, versioned để migrate về sau
export async function loadJSON<T>(key: string, fallback: T): Promise<T>
export async function saveJSON<T>(key: string, value: T): Promise<void>
```

Các khóa dùng chung (namespace `kkh:`):
- `kkh:srs:cards` — danh sách thẻ SR (xem mục 5)
- `kkh:srs:reviews` — nhật ký ôn tập (tuỳ chọn, để thống kê)
- `kkh:grammar:progress` — điểm ngữ pháp đã đọc/đánh dấu thuộc
- `kkh:reading:history` — lịch sử luyện đọc + điểm
- `kkh:settings:*` — mở rộng cấu hình hiện có

### 2.2 Tách i18n (khuyến nghị, không bắt buộc)

`src/i18n/index.ts` + `src/i18n/{en,vi,zh,hi,es,fr,ja}.ts`. `LanguageContext` chỉ còn logic provider. Giúp mỗi tính năng thêm key gọn gàng. Nếu muốn giữ nguyên cấu trúc, tối thiểu **gộp key `vi` trùng**.

### 2.3 LLM / backend — **không còn bắt buộc**

Sau khi đơn giản hóa Tập đọc (bỏ ghi âm/STT/LLM), **cả 3 tính năng cốt lõi chạy hoàn toàn offline**, không cần backend hay API key.

LLM chỉ còn là **tùy chọn nâng cao** cho phần "gợi ý thêm từ vựng theo chủ đề" (mục 5.5). Giai đoạn đầu làm **gợi ý rule-based** (không cần LLM). Nếu về sau muốn dùng LLM, tạo `src/services/ai.ts` qua backend proxy giữ API key — nhưng **không nằm trong phạm vi bắt buộc** của kế hoạch này.

---

## 3. Tính năng 1 — Ngữ pháp (dễ nhất, làm trước để lấy đà)

### 3.1 Mục tiêu
Danh sách điểm ngữ pháp TOPIK I/II. Mỗi điểm: cấu trúc, diễn giải tiếng Việt (và đa ngôn ngữ ở mức tiêu đề), ví dụ câu Hàn + dịch, ghi chú dùng khi nào. Có TTS đọc ví dụ (tái dùng `SpeechConfig`).

### 3.2 Data model — `src/data/grammar.json`

```jsonc
{
  "topik1": {
    "label": "TOPIK I",
    "items": [
      {
        "id": "n-eun-neun",           // khóa ổn định
        "title": "N은/는",             // tên điểm ngữ pháp
        "level": "topik1",
        "tags": ["trợ từ", "chủ đề"],
        "structure": "받침 O + 은 / 받침 X + 는",
        "explanation": "Trợ từ chủ đề, nêu bật chủ đề của câu…",  // tiếng Việt
        "usage": "Dùng khi giới thiệu chủ đề, so sánh…",
        "examples": [
          { "ko": "저는 학생이에요.", "vi": "Tôi là học sinh.", "note": "받침 X → 는" },
          { "ko": "이것은 책이에요.", "vi": "Cái này là sách.", "note": "받침 O → 은" }
        ]
      }
    ]
  },
  "topik2": { "label": "TOPIK II", "items": [ /* … */ ] }
}
```

> Nội dung do Claude soạn dần theo khung TOPIK (đề xuất: bắt đầu ~40–60 điểm TOPIK I, ~40–60 điểm TOPIK II). Trường `explanation`/`usage` tiếng Việt là chính; tiêu đề/label localize.

### 3.3 Màn hình & điều hướng
- Thêm tab **Ngữ pháp** vào `app/(tabs)/grammar.tsx` (icon ví dụ `school-outline`), cập nhật `_layout.tsx`.
  - Lưu ý: 4 tab đã khá nhiều; nếu thêm cả 3 tính năng thành 5–6 tab sẽ chật. Xem mục 7 về tổ chức điều hướng.
- **Danh sách**: lọc theo level (TOPIK I/II) + ô tìm kiếm + lọc theo tag. Component `GrammarListItem`.
- **Chi tiết**: `app/grammar/[id].tsx` — hiển thị structure, explanation, usage, danh sách ví dụ (mỗi ví dụ có nút 🔊 đọc câu Hàn, tái dùng `useSpeechConfig`).
- **Liên kết chéo**: ở màn chi tiết cho nút "Thêm ví dụ vào ôn tập" → đẩy câu vào hệ SR (mục 5) như một thẻ loại `sentence`.

### 3.4 i18n
Thêm key: `tabGrammar`, `grammarSearchPlaceholder`, `grammarStructure`, `grammarUsage`, `grammarExamples`, `grammarAddToReview`, `grammarLevelFilter`… cho cả 7 locale.

### 3.5 Các bước
1. Tạo `grammar.json` (nội dung mẫu 8–10 điểm để dựng UI).
2. Component list + detail, wire TTS.
3. Thêm tab + route detail.
4. Thêm i18n keys.
5. Soạn đầy đủ nội dung TOPIK I → II.

**Ước lượng:** UI + data model 1–1.5 ngày; soạn nội dung đầy đủ 1–2 ngày (song song).

---

## 4. Tính năng 2 — Tập đọc (tự đọc → hiện phiên âm → nghe lại, tự đánh giá)

> **Đã đơn giản hóa:** bỏ hoàn toàn ghi âm / STT / LLM / backend. Không phụ thuộc dịch vụ ngoài, không cần quyền micro, chạy offline (trừ giọng TTS tùy nền tảng). Đây là tính năng **nhẹ, ít rủi ro** — có thể làm sớm.

### 4.1 Luồng người dùng
1. App hiển thị **câu tiếng Hàn** (từ ngân hàng câu / ví dụ ngữ pháp / từ vựng). Phiên âm và nghĩa **ẩn** ban đầu.
2. Dòng **hướng dẫn**: "Hãy tự đọc to câu này. Sau 30 giây sẽ hiện phiên âm và cách đọc mẫu."
3. **Đồng hồ đếm ngược 30 giây** (có vòng tròn tiến độ). Người dùng tự đọc trong lúc chờ.
4. Hết 30s (hoặc bấm **"Hiện đáp án"** để bỏ qua chờ) → hiện:
   - **Phiên âm tiếng Việt** của câu (cách đọc từng âm tiết).
   - **Nghĩa tiếng Việt**.
   - Nút 🔊 **Nghe mẫu** (TTS đọc câu Hàn) để người dùng **tự so sánh và tự đánh giá**.
5. Người dùng **tự chấm**: 3 nút *Chưa tốt / Tạm ổn / Tốt* (không bắt buộc). Lựa chọn dùng để: lưu lịch sử `kkh:reading:history` và **gợi ý thêm câu "Chưa tốt" vào ôn tập SR**.
6. Nút **"Câu tiếp theo"** → câu mới, reset đồng hồ.

### 4.2 Ghi chú thiết kế
- **Thời gian chờ cấu hình được**: mặc định 30s, cho phép đổi (15/30/45/60s hoặc tắt auto-reveal → chỉ hiện khi bấm nút) trong Settings hoặc ngay trên màn.
- **Không ép chờ**: luôn có nút "Hiện đáp án" để bỏ qua đếm ngược.
- **Tự đánh giá** thay cho chấm máy: đơn giản, minh bạch với người học, không tạo kỳ vọng sai về "chấm điểm phát âm".
- Tận dụng sẵn `useSpeechConfig` cho TTS và `decomposeString` để sinh/hỗ trợ phiên âm nếu cần.

### 4.3 Ngân hàng câu — `src/data/sentences.json`
```jsonc
{
  "levels": {
    "topik1": [
      {
        "id": "s1",
        "ko": "안녕하세요.",
        "vi": "Xin chào.",
        "phonetic_vi": "an-nyông-ha-xê-yô",   // phiên âm tiếng Việt, hiện sau khi chờ
        "tags": ["chào hỏi"]
      }
    ],
    "topik2": [ /* … */ ]
  }
}
```
- `phonetic_vi` soạn thủ công theo cách đọc tiếng Việt (chính xác hơn tự sinh máy). Có thể bổ trợ bằng `decompose.ts` nhưng bản do người soạn ưu tiên.
- Nguồn câu: tái dùng ví dụ trong `grammar.json` + bổ sung câu theo chủ đề (chào hỏi, mua sắm, nhà hàng…).

### 4.4 Màn hình
- **Đề xuất: thêm chế độ "Luyện đọc" vào tab Đọc hiện có** (toggle giữa "Phân tích âm tiết" và "Luyện đọc"), tránh thêm tab. Hoặc `app/(tabs)/practice-reading.tsx` nếu muốn tách riêng.
- Thành phần:
  - Chọn level (TOPIK I/II) + chủ đề (theo tag).
  - Khối câu Hàn cỡ lớn.
  - Đồng hồ đếm ngược 30s (component `CountdownRing`) + nút "Hiện đáp án".
  - Khối đáp án (ẩn → hiện): phiên âm VN, nghĩa, nút 🔊 Nghe mẫu.
  - Hàng nút tự chấm (Chưa tốt / Tạm ổn / Tốt) + "Câu tiếp theo".
- Quản lý timer bằng `useEffect` + `setInterval`, dọn dẹp khi rời màn / chuyển câu.

### 4.5 Các bước
1. `sentences.json` (mẫu ~20 câu, có `phonetic_vi`).
2. Component `CountdownRing` (đếm ngược + vòng tiến độ).
3. UI luyện đọc: hiển thị câu → đếm ngược → reveal phiên âm/nghĩa + TTS.
4. Nút tự chấm → lưu lịch sử + móc nối SR ("Chưa tốt" → gợi ý thêm thẻ).
5. Cấu hình thời gian chờ.
6. i18n keys.

**Ước lượng:** ~1.5–2 ngày. Không backend, không quyền đặc biệt, rủi ro thấp.

---

## 5. Tính năng 3 — Từ vựng + Spaced Repetition (kiểu Mochi Mochi)

### 5.1 Mục tiêu
- **Auto add**: tự thêm từ vào bộ ôn khi người dùng tương tác (xem từ mới ở màn Từ vựng, hoặc thêm từ ví dụ ngữ pháp / câu luyện đọc).
- **Gợi ý add**: đề xuất từ nên học (từ hay gặp, từ trong câu vừa luyện) — có thể dùng LLM để gợi ý bộ từ theo chủ đề.
- **Custom**: người dùng tự tạo thẻ (mặt trước/mặt sau tự nhập).
- **Ôn theo SR**: nhắc học đúng lịch theo thuật toán lặp lại ngắt quãng.

### 5.2 Thuật toán SR — SM-2 (giống Anki/Mochi)
Mỗi thẻ giữ: `easeFactor` (mặc định 2.5), `interval` (ngày), `repetitions`, `due` (ngày đến hạn). Sau mỗi lần ôn, người dùng chấm mức nhớ (Again / Hard / Good / Easy → quality 0–5):

```
if quality < 3:        // quên
    repetitions = 0; interval = 1
else:
    if repetitions == 0: interval = 1
    elif repetitions == 1: interval = 6
    else: interval = round(interval * easeFactor)
    repetitions += 1
easeFactor = max(1.3, easeFactor + (0.1 - (5-q)*(0.08 + (5-q)*0.02)))
due = today + interval days
```
Đặt trong `src/srs/sm2.ts` thuần hàm, **có unit test** (đây là phần dễ sai, cần test).

### 5.3 Data model — lưu trong AsyncStorage (`kkh:srs:cards`)
```ts
type SrsCard = {
  id: string;
  type: 'vocab' | 'sentence' | 'grammar' | 'custom';
  front: string;            // vd từ Hàn / câu
  back: string;             // nghĩa
  extra?: { pos?: string; romaja?: string; sourceId?: string };
  // trạng thái SR
  easeFactor: number; interval: number; repetitions: number;
  due: string;              // ISO date
  createdAt: string; lastReviewedAt?: string;
  suspended?: boolean;
};
```

### 5.4 Context & logic
- `src/contexts/SrsContext.tsx`: nạp thẻ từ storage khi mở app, cung cấp: `dueCards`, `addCard`, `addCardsBulk`, `reviewCard(id, quality)`, `removeCard`, `stats`.
- **Auto add**: ở màn Từ vựng, khi bấm "Từ tiếp theo" hoặc nút "Thêm vào ôn tập", gọi `addCard` (chống trùng theo `front`+`type`). Tuỳ chọn bật/tắt auto trong Settings.
- **Nhắc học**: badge số thẻ đến hạn trên tab/màn Ôn tập. (Nâng cao: `expo-notifications` để nhắc hằng ngày — tùy chọn giai đoạn sau.)

### 5.5 Màn hình
- **Ôn tập** (`app/review.tsx` hoặc chế độ trong tab Từ vựng): hiển thị thẻ đến hạn, lật thẻ, 4 nút chấm (Again/Hard/Good/Easy), tiến độ phiên ôn.
- **Quản lý thẻ**: danh sách, tìm kiếm, sửa/xóa, tạo thẻ custom.
- **Thống kê** (tùy chọn): số thẻ đến hạn, chuỗi ngày học, số đã thuộc.
- **Gợi ý add**: khối "Từ gợi ý hôm nay" — nguồn: từ chưa có trong bộ ôn thuộc TOPIK level đang học, hoặc LLM gợi ý theo chủ đề.

### 5.6 i18n keys
`tabReview`, `srsAgain`, `srsHard`, `srsGood`, `srsEasy`, `srsDueCount`, `srsAddToReview`, `srsNoDue`, `srsCreateCard`, `srsFront`, `srsBack`, `srsSuggested`… (7 locale).

### 5.7 Các bước
1. AsyncStorage store (mục 2.1) + `SrsContext`.
2. `sm2.ts` + unit test.
3. Màn Ôn tập (lật thẻ + chấm).
4. Auto add + nút thêm ở Từ vựng/Ngữ pháp/Tập đọc.
5. Quản lý thẻ + tạo custom.
6. Gợi ý add (rule-based trước, LLM sau).
7. (Tùy chọn) `expo-notifications` nhắc hằng ngày.
8. i18n keys.

**Ước lượng:** store + SR + context + test 1.5–2 ngày; UI ôn tập + quản lý 2 ngày; gợi ý/thông báo 1 ngày.

---

## 6. Phụ thuộc mới (tổng hợp)

| Thư viện | Dùng cho | Ghi chú |
|---|---|---|
| `@react-native-async-storage/async-storage` | Lưu bền (SR, tiến độ) | Nền tảng, bắt buộc |
| `expo-notifications` *(tùy chọn)* | Nhắc ôn hằng ngày | Giai đoạn sau |
| Backend/proxy + LLM *(tùy chọn)* | Gợi ý từ vựng theo chủ đề | Không bắt buộc; giai đoạn đầu dùng rule-based |

**Không còn cần** `expo-audio`, quyền micro, hay dịch vụ STT — do Tập đọc đã đơn giản hóa. `app.json` chỉ cần chỉnh nếu dùng `expo-notifications`.

---

## 7. Tổ chức điều hướng (quan trọng)

Hiện có 3 tab. Thêm 3 tính năng → nếu mỗi cái 1 tab sẽ thành 6 tab, chật trên mobile. Đề xuất:

- **Ngữ pháp**: 1 tab mới (nội dung độc lập, xứng đáng có tab).
- **Tập đọc**: **chế độ trong tab Đọc** hiện có (toggle "Phân tích âm tiết / Luyện đọc"), không thêm tab.
- **Ôn tập (SR)**: 1 tab mới có **badge số thẻ đến hạn** (đây là điểm chạm hằng ngày, nên nổi bật).
- Kết quả: 5 tab (Chữ cái, Đọc, Ngữ pháp, Từ vựng, Ôn tập). Nếu muốn gọn hơn nữa, gộp Từ vựng + Ôn tập thành một tab "Từ vựng" có 2 chế độ.

---

## 8. Thứ tự triển khai đề xuất (roadmap)

**Giai đoạn 0 — Nền tảng (1–1.5 ngày)**
Gộp key `vi` trùng · thêm AsyncStorage store · (tùy chọn) tách i18n.

**Giai đoạn 1 — Ngữ pháp (2–3 ngày)**
Ít rủi ro, không cần backend. Dựng data model + UI, soạn nội dung. Tạo trước móc "Thêm vào ôn tập" (chờ SR ở GĐ2).

**Giai đoạn 2 — Tập đọc (1.5–2 ngày)**
Đã đơn giản hóa (không backend/micro). Ngân hàng câu + đồng hồ đếm ngược + reveal phiên âm + TTS + tự chấm. Có thể làm ngay sau/song song Ngữ pháp.

**Giai đoạn 3 — Từ vựng SR (3–4 ngày)**
Store + SM-2 + test + context + màn Ôn tập + auto/custom add. Giá trị giữ chân cao nhất, không phụ thuộc dịch vụ ngoài. Đặt cuối vì các tính năng trước cùng móc nối "thêm vào ôn tập" vào đây.

**Tổng thô:** ~8–11 ngày công cho bản đầy đủ (chưa gồm soạn toàn bộ nội dung ngữ pháp/câu, chạy song song được).

---

## 9. Rủi ro & lưu ý

- **Di trú dữ liệu:** đặt `version` trong store ngay từ đầu để nâng cấp schema SR về sau không mất dữ liệu người dùng.
- **Kiểm thử:** SM-2 là nơi dễ sai → viết unit test.
- **Chất lượng phiên âm VN (Tập đọc):** `phonetic_vi` nên soạn/duyệt thủ công cho tự nhiên, tránh phụ thuộc hoàn toàn vào sinh máy.
- **TTS đa nền tảng:** giọng tiếng Hàn của `expo-speech` phụ thuộc thiết bị/OS; trên web/emulator có thể thiếu giọng `ko`. Kiểm tra fallback.
- **(Tùy chọn) LLM gợi ý từ:** nếu bật, cần backend giữ API key + theo dõi chi phí. Giai đoạn đầu dùng rule-based nên không phát sinh rủi ro này.

---

## 10. Việc làm ngay khi được duyệt

1. Sửa bug trùng key `vi` trong `LanguageContext.tsx`.
2. Thêm `@react-native-async-storage/async-storage` + `src/storage/store.ts`.
3. Dựng `src/data/grammar.json` (8–10 điểm mẫu) + màn Ngữ pháp để chốt UX.
4. Dựng `src/data/sentences.json` + màn Luyện đọc (đếm ngược 30s → reveal phiên âm + TTS).
