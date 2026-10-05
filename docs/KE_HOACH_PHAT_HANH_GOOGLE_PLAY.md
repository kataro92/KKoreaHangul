# Kế hoạch phát hành KKorea Hangul trên Google Play

Ngày lập: 05/10/2026. Phạm vi: bản đầu tiên miễn phí, không quảng cáo, sử dụng tài khoản Play Console đã phát hành Kalendar. Đây là kế hoạch; chưa sửa cấu hình ứng dụng, tạo bản phát hành hoặc gửi Google xét duyệt.

Cập nhật sau khi thực hiện: package cũ `com.kataro92.kkoreahangul` đã phát hành Internal 1.1.2 (4). Theo yêu cầu mới ngày 05/10/2026, cấu hình Android chuyển sang `com.spacekatcompany.kkoreanhangul`. Package mới cần app riêng trên Console; trạng thái và hướng dẫn hiện tại nằm trong [INTERNAL_TESTING.md](./INTERNAL_TESTING.md). Bảng hiện trạng dưới đây giữ nguyên làm hồ sơ lúc lập kế hoạch.

## 1. Mục tiêu và phạm vi

- Giữ các tính năng hiện có: bảng chữ Hangul, phân tích âm tiết, luyện đọc, từ vựng, ngữ pháp, ôn tập SRS, nhắc học, sao lưu/khôi phục.
- Ưu tiên người Việt mới học tiếng Hàn; đề xuất phát hành tại Việt Nam trước, trang cửa hàng tiếng Việt và tiếng Anh.
- Không thêm đăng nhập, backend, quảng cáo hoặc thanh toán trong đợt này.
- Chỉ phát hành khi bản cài từ Google Play chạy ổn định và các khai báo khớp hành vi thực tế.

## 2. Hiện trạng đã kiểm tra

| Hạng mục | Bằng chứng | Việc cần làm |
|---|---|---|
| Nền tảng | Expo 55, React Native 0.83.2 | Giữ nền tảng; xác minh cấu hình trong AAB thực tế |
| Package Android | `com.kataro92.kkoreahangul` | Chốt và giữ nguyên trước lần upload đầu |
| AAB | `eas.json` có production / app-bundle | Cấu hình credentials và build AAB production |
| Ký bản native local | `android/app/build.gradle` dùng `signingConfigs.debug` cho release | Thay bằng upload key hợp lệ; dùng Play App Signing |
| Phiên bản | `app.json` và `package.json`: 1.1.0; native Android: 1.1.1 / versionCode 3 | Chốt một nguồn quản lý; tăng versionCode cho mỗi upload |
| Quyền riêng tư | Có `PRIVACY.md`; tìm kiếm mã app chưa thấy mục privacy | Đăng URL công khai và thêm mục trong Cài đặt/Giới thiệu |
| Quyền Android | Manifest nguồn có storage, overlay, internet, vibrate | Kiểm tra merged manifest bản release và bỏ quyền không cần |
| Backup hệ thống | Manifest có `android:allowBackup="true"` | Chốt hành vi Auto Backup; đồng bộ mô tả privacy |
| Ảnh cửa hàng | README ghi ảnh từ iOS Simulator | Chụp lại Android, chuẩn bị icon và feature graphic |
| Dung lượng | APK local 1.1.1 khoảng 113 MB | Đo dung lượng tải thực tế từ AAB; tối ưu ảnh nếu cần |

Thư mục `android/` đang được gitignore. Các thay đổi cần tái tạo được từ cấu hình Expo/config plugin hoặc được quản lý bằng quy trình native rõ ràng; chỉ sửa file native bị bỏ qua sẽ khó tái lập trên máy build khác.

Expo 55 mặc định target/compile SDK 36 theo [tài liệu Expo](https://docs.expo.dev/versions/v55.0.0/). Cần kiểm tra AAB cuối cùng, không suy ra khả năng đạt yêu cầu chỉ từ phiên bản Expo.

Kiểm tra nền ngày 05/10/2026: `npm run typecheck` đạt; `npm test -- --runInBand` đạt 2 bộ test / 12 test (Hangul và SM-2). Chưa kiểm chứng AAB production, chữ ký artifact, quyền merged manifest, hành vi trên thiết bị hoặc trạng thái Play Console.

## 3. Lộ trình thực hiện

| Giai đoạn | Ước lượng công việc | Kết quả cần có |
|---|---|---|
| 1. Chốt Console và build | Ngày 1–2 | App mới trong Console, package/version thống nhất, upload key, AAB ký đúng |
| 2. Privacy và kiểm tra chất lượng | Ngày 2–4 | URL privacy, mục privacy trong app, quyền tối thiểu, sửa lỗi chính |
| 3. Nội dung cửa hàng | Ngày 3–5, làm song song | Mô tả VI/EN, icon, banner, 6 ảnh Android, khai báo App content |
| 4. Internal testing | Ngày 5–7 | Người thử cài từ Play, báo cáo lỗi, pre-launch report được xử lý |
| 5. Closed testing nếu Console yêu cầu | Ít nhất 14 ngày đủ điều kiện | Đủ người thử, phản hồi thực tế, hồ sơ xin production access |
| 6. Production | Sau khi đạt các điều kiện trên | Gửi review, xử lý phản hồi, phát hành tại thị trường đã chọn |
| 7. Theo dõi sau phát hành | 7 ngày đầu | Theo dõi crash/ANR, lỗi TTS, mất dữ liệu, bản sửa nếu cần |

Dự trù 7–10 ngày làm việc để chuẩn bị và thử nội bộ, cộng thời gian Google xét duyệt. Nếu phải closed testing, dự trù khoảng 3–4 tuần hoặc hơn. Đây là ước lượng, không phải ngày phát hành được bảo đảm.

### Giai đoạn 1: Console và bản build

- Dùng tài khoản đã phát hành Kalendar; kiểm tra xác minh tài khoản và thông báo cần xử lý.
- Tạo app riêng: KKorea Hangul, loại App, miễn phí, danh mục đề xuất Education.
- Xem Console của app mới có yêu cầu closed testing/production access hay không. Việc Kalendar đã được phát hành chưa đủ để kết luận KKorea Hangul được miễn.
- Chốt package hiện có và version phát hành; đồng bộ app config/native config, versionCode lớn hơn mọi bản đã upload của chính app này.
- Đề xuất EAS production để build AAB theo cấu hình sẵn có; quản lý upload key an toàn, bật Play App Signing, ghi lại quy trình cập nhật. Nếu build local, sửa signing release trước.
- Xác minh target API 36 hoặc cao hơn trong artifact: yêu cầu cho app mới từ 31/08/2026 theo [Google Play](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en).
- Kiểm tra thư viện native và chạy trên môi trường 16 KB theo [hướng dẫn Android](https://developer.android.com/guide/practices/page-sizes); kiểm tra ABI 64-bit và cảnh báo compatibility trong Console.
- Kiểm tra merged manifest: overlay/storage có cần thiết không; xác nhận quyền thông báo chỉ được xin khi bật nhắc học. Plugin local notifications hiện thấy chỉ xử lý entitlement iOS, không chứng minh quyền Android đã tối giản.

### Giai đoạn 2: Quyền riêng tư và chất lượng

- Dùng `PRIVACY.md` làm bản nháp; đăng trang HTML công khai, không cần đăng nhập, truy cập được toàn cầu, có tên ứng dụng và email hỗ trợ.
- Thêm mục Chính sách quyền riêng tư trong Cài đặt/Giới thiệu. Google yêu cầu privacy cả trong app và Console theo [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en).
- Rà soát SDK, TTS engine, xuất file qua share sheet và Android Auto Backup. Policy hiện nói dữ liệu chỉ ở thiết bị, nhưng `allowBackup=true`; cần xác định dữ liệu nào được hệ thống backup và chọn tắt/giới hạn hoặc giải thích chính xác.
- Data safety: dự kiến không thu thập/chia sẻ bởi nhà phát triển theo mã hiện tại; chỉ chốt sau khi kiểm tra artifact, SDK và luồng dữ liệu. Khai báo phải phản ánh cả SDK theo [hướng dẫn Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).
- Rà soát nguồn và quyền sử dụng từ vựng, ví dụ, hình minh họa; kiểm chứng nghĩa/phát âm. Tránh mô tả bộ từ/ngữ pháp là tài liệu chính thức hoặc đầy đủ TOPIK khi chưa có căn cứ.
- Làm rõ phát âm phụ thuộc giọng tiếng Hàn trên thiết bị; xử lý thiếu giọng và hướng dẫn tải giọng. Chỉ hứa nghe offline sau khi kiểm tra giọng offline.

Các luồng thử bắt buộc:

1. Cài mới, onboarding, từng tab chính, back gesture, khởi động lại và bật/tắt dark mode.
2. Phát âm Hangul/từ/câu: giọng Hàn có sẵn, thiếu giọng, chế độ máy bay, bấm nghe liên tiếp.
3. SRS: thêm thẻ, chấm điểm, đóng/mở app, đổi ngày; kiểm tra lịch ôn và dữ liệu.
4. Sao lưu/khôi phục: file hợp lệ, file sai, file hỏng, hủy chọn; khôi phục rồi mở lại app. Không được gây mất dữ liệu ngoài hành vi đã giải thích.
5. Thông báo: cấp/từ chối quyền, bật/tắt, đổi múi giờ, thiết bị hạn chế pin; kiểm tra channel và lịch nhắc.
6. Nâng cấp bản thử từ Play giữ nguyên dữ liệu; tách thử nghiệm khỏi APK local ký debug vì có thể khác chữ ký.
7. Máy Android cấu hình thấp, Android 13/14 và 15/16 nếu có; chữ lớn, màn hình nhỏ, hiệu năng danh sách/ảnh/glass, môi trường 16 KB.

Điều kiện qua: không crash ở luồng chính, không mất dữ liệu, backup round-trip đúng, TTS có phương án khi thiếu giọng, thông báo xử lý được từ chối quyền, không có lỗi nghiêm trọng chưa xử lý trong pre-launch report. Typecheck và unit test hiện có phải đạt; chúng không thay thế kiểm thử trên thiết bị.

### Giai đoạn 3: Hồ sơ cửa hàng

- Tên dự kiến: **KKorea Hangul**. Mô tả ngắn: **Học Hangul, luyện đọc tiếng Hàn và ôn từ vựng bằng flashcard.**
- Mô tả đầy đủ VI/EN: đối tượng học, các tính năng thực tế, cách nghe phát âm, lưu dữ liệu và backup; không cam kết điểm thi hoặc tốc độ học.
- Giới hạn tên/mô tả ngắn/mô tả đầy đủ: 30/80/4.000 ký tự theo [Google Play](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en).
- Icon 512 × 512, feature graphic 1024 × 500. Chuẩn bị 6 ảnh chụp Android: bảng chữ, luyện đọc, từ vựng, ngữ pháp, SRS, sao lưu/cài đặt. Tuân thủ [quy cách preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en).
- Điền App content: Data safety, Ads = No, App access không bị hạn chế nếu bản cuối không cần đăng nhập, Content rating, Target audience đúng đối tượng thực tế, các declaration còn lại Console yêu cầu.
- Chọn nhóm tuổi theo sản phẩm và cách giới thiệu. Nếu thực sự hướng tới trẻ em, rà soát Families; không chọn nhóm tuổi chỉ để tránh yêu cầu.
- Email hỗ trợ, URL privacy, ghi chú phát hành, thị trường ban đầu đề xuất Việt Nam.

### Giai đoạn 4–6: Thử nghiệm và phát hành

- Internal testing với khoảng 5–10 người dùng Android, có người mới học tiếng Hàn; cài bản từ Play và thu phản hồi về lỗi lẫn độ dễ sử dụng.
- Nếu thuộc diện tài khoản cá nhân tạo sau 13/11/2023: tối thiểu 12 người đã opt-in liên tục 14 ngày trước khi xin production access. Tuyển 15–20 người để có dự phòng; thu phản hồi và ghi lỗi đã sửa theo [yêu cầu Google](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en).
- Sau khi đủ điều kiện, gửi production access nếu cần; sửa mọi lỗi còn lại và gửi bản production review.
- Lần phát hành production đầu không hỗ trợ rollout theo phần trăm; Google phát hành tới toàn bộ người dùng ở các quốc gia đã chọn. Có thể giới hạn thị trường ban đầu rồi mở rộng sau theo [hướng dẫn rollout](https://support.google.com/googleplay/android-developer/answer/6346149?hl=en).
- Chuẩn bị bản sửa với versionCode mới khi có lỗi; không dựa vào khả năng hạ về binary cũ.

## 4. Phân công và chi phí

| Người thực hiện | Công việc |
|---|---|
| Kỹ thuật | Cấu hình build/signing/version/quyền, privacy trong app, kiểm tra SDK, sửa lỗi, AAB, ảnh Android |
| Chủ tài khoản | Quyết định nhóm tuổi/thị trường, thao tác Console và credentials riêng tư, xác nhận quyền nội dung, tuyển người thử, gửi xét duyệt/phát hành |
| Người thử | Cài từ Play, dùng các luồng thử, gửi lỗi kèm thiết bị và phiên bản Android |

Không cần tạo tài khoản Play mới; không có phí đăng ký riêng cho app thứ hai. Ngân sách build phụ thuộc quota/gói EAS đang dùng; có thể build local. Dùng trang tĩnh cho privacy và chưa cần chi phí backend/quảng cáo trong phạm vi này.

## 5. Checklist trước khi gửi review

- [ ] Chốt package, phiên bản và versionCode.
- [ ] AAB ký bằng upload key hợp lệ, Play App Signing được thiết lập.
- [ ] Xác nhận target API, 64-bit, tương thích 16 KB và quyền merged manifest.
- [ ] Typecheck/unit test đạt; các luồng thử trên bản Play đạt.
- [ ] Privacy công khai và trong app; Auto Backup/TTS/SDK được giải thích chính xác.
- [ ] Nguồn nội dung và quyền sử dụng được rà soát.
- [ ] Mô tả VI/EN, icon, banner, ảnh Android, support email hoàn tất.
- [ ] App content được điền và nhất quán với bản cài.
- [ ] Production access/closed testing hoàn tất nếu Console yêu cầu.
- [ ] Pre-launch report được kiểm tra; không còn lỗi nghiêm trọng.
- [ ] Chủ tài khoản chốt thị trường và gửi production review.
