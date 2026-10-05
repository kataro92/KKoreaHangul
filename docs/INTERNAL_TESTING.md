# KKorea Hangul — Internal testing

Phạm vi: chỉ Internal testing, dừng trước Closed testing và Production. Miễn phí, không quảng cáo. Cập nhật ngày 05/10/2026.

## Package hiện tại

- Android: `com.spacekatcompany.kkoreanhangul`, đúng ID được yêu cầu.
- Phiên bản: `1.1.2`, versionCode `4`.
- iOS giữ bundleIdentifier riêng trong `app.json`.
- Tài khoản Play: The Space Kat Company, developer ID `6660012349184224355`.
- App mới đã tạo ngày 05/10/2026 sau khi chủ tài khoản xác nhận hai khai báo: KKorea Hangul, English (United States) — `en-US`, App, Free. App ID `4975560487486352974`, Internal track ID `4699881387950463788`. Danh sách thử `KKorea Hangul - Thử nghiệm nội bộ` đã được chọn và lưu, gồm `spacekatcompany@gmail.com` và `kataro92@gmail.com`.
- [Internal testing trên Console](https://play.google.com/console/u/1/developers/6660012349184224355/app/4975560487486352974/tracks/4699881387950463788).
- Đã phát hành release ID `1`, tên `1.1.2 (4) - Internal`, ghi chú `en-US`, ngày 05/10/2026 lúc 13:53 (giờ hiển thị trên Console). Console xác nhận **Active — Available to internal testers**. Chưa bắt đầu Closed testing hoặc Production.
- [Tham gia Internal testing](https://play.google.com/apps/internaltest/4699881387950463788): đăng nhập bằng một trong hai email đã chọn, tham gia rồi cài từ Google Play. Danh sách email là điều kiện tham gia, không đồng nghĩa đã opt-in. Google thông báo thay đổi thường xuất hiện trong một giờ, đôi khi lâu hơn.
- Play tạm hiển thị `com.spacekatcompany.kkoreanhangul (unreviewed)` vì app chưa review. Dung lượng tải cài mới ước tính 57,2 MB. Có một cảnh báo không chặn về deobfuscation file; bản hiện tại chưa bật minify/R8, native debug symbols đã đính kèm.
- Bằng chứng: `release/com.spacekatcompany.kkoreanhangul-internal-published.jpg`.

## AAB đã chuẩn bị

`release/com.spacekatcompany.kkoreanhangul-1.1.2-4.aab`

SHA-256: `BB12DBEE4D661720DABFD297E6F840795AC68D1AE5786EFDD4714419EDB96402`.

Đã kiểm chứng package/version/code, target SDK 36, không debuggable; Gradle bundleRelease, bundletool validate, jarsigner verify và đối chiếu upload certificate đạt. Typecheck và 12 test đạt. 38 thư viện native 64-bit đạt ELF PT_LOAD alignment 16 KB; embedded JavaScript bundle có mặt. Chưa kiểm thử runtime trên thiết bị.

## Dọn bản cũ

Theo yêu cầu không giữ bản Internal cũ, track của package `com.kataro92.kkoreahangul` đã được Pause: Console xác nhận **Inactive**, **This track is paused**, người thử không nhận release này. AAB, log và ảnh phát hành cũ trên máy đã được xóa. Không sử dụng link tham gia cũ nữa.

App cũ `com.kataro92.kkoreahangul` (app ID `4972224140046970166`) đã được xóa trên Console ngày 05/10/2026, sau khi xác minh bằng mã giao dịch do chủ tài khoản cung cấp. Console xác nhận có thể khôi phục đến ngày 12/10/2026; sau hạn này không thể khôi phục. Bằng chứng: `release/old-app-deleted.jpg`. [Hướng dẫn Google](https://support.google.com/googleplay/android-developer/answer/16483176?hl=en).

## Build local

```powershell
.\scripts\build-play.ps1 -JavaHome 'C:\Program Files\Java\jdk-21.0.12.1' -BundletoolPath 'D:\Projects\Kalendar\release\audit-tools\bundletool-all-1.18.3.jar'
```

Script chạy typecheck, unit test, Expo prebuild Android, Gradle bundleRelease và kiểm artifact. Tên AAB/log có package để nhận diện bản đúng. Plugin prebuild làm mới cache autolinking nếu package thay đổi, tránh tham chiếu BuildConfig của package cũ.

Upload key và mật khẩu nằm trong `.secrets/play-upload.p12`, `.secrets/play-signing.properties`, ngoài Git. Sao lưu an toàn cả hai; không ghi đè hoặc tạo lại khi đã có key. Plugin dùng credentials local; EAS/cloud cần thiết lập credentials riêng. Gradle wrapper được ghim 8.14.3 cho RN 0.83.2/AGP 8.12 hiện tại.

Môi trường local: JDK 21, SDK/Build Tools 36, NDK 27.1.12297006, CMake 3.22.1. Cấu hình loại overlay, storage cũ, microphone và exact alarm khỏi manifest. `expo-font`/`expo-system-ui` dùng phiên bản SDK 55.

## Ghi chú phát hành

```text
<en-US>
First internal test release of KKorea Hangul.
Learn the Hangul alphabet, explore syllables, practice reading, and browse vocabulary and grammar.
Review with flashcards, listen to pronunciation, set study reminders, and back up or restore your data.
Free to use, with no ads.
</en-US>
```

## Kiểm tra sau khi cài từ Play

1. Mở app, hoàn tất hướng dẫn, vào đủ tab và chuyển light/dark.
2. Nghe chữ/từ/câu tiếng Hàn; thử thiết bị chưa tải giọng Hàn và chế độ máy bay.
3. Thêm thẻ, ôn, chấm điểm; đóng/mở lại để kiểm dữ liệu.
4. Xuất/khôi phục backup, thử hủy chọn và file không hợp lệ.
5. Bật/tắt nhắc học, cấp/từ chối quyền thông báo và kiểm lịch nhắc.

Package mới có dữ liệu riêng, không tự nhận dữ liệu package cũ. Xuất backup từ app cũ trước khi gỡ nếu muốn giữ tiến độ.

## Giai đoạn sau

Privacy URL và mục privacy trong app; mô tả Auto Backup; hồ sơ cửa hàng/ảnh Android; Data safety/App content; kiểm nội dung học, thiết bị cấu hình thấp và runtime 16 KB. Không tự bắt đầu Closed testing hoặc Production.

## Thay đổi ngôn ngữ đang ở source — chưa phát hành

Bản Internal `1.1.2 (4)` và AAB đã lưu ở trên vẫn dùng logic cũ: mặc định tiếng Việt khi chưa có lựa chọn đã lưu. Ngôn ngữ mặc định của store listing `en-US` không quyết định ngôn ngữ bên trong app.

Source mới ưu tiên lựa chọn ngôn ngữ đã lưu; nếu chưa có lựa chọn hợp lệ, Android đọc **quốc gia tài khoản Google Play** bằng `BillingClient.getBillingConfigAsync`. Đây không phải ngôn ngữ thiết bị, vị trí GPS, hay quốc gia suy ra từ SIM. Ví dụ Play Việt Nam + máy đặt tiếng Anh vẫn chọn tiếng Việt.

Ánh xạ sản phẩm: VN → vi; CN/TW/HK/MO → zh; IN → hi; JP → ja; FR → fr; ES và AR/BO/CL/CO/CR/CU/DO/EC/GT/HN/MX/NI/PA/PE/PY/SV/UY/VE → es. Các quốc gia còn lại → en. Quốc gia không xác định, lỗi dịch vụ, hoặc quá 2 giây → en. iOS/web và Expo Go không có module Android này → en. Người dùng luôn có thể chọn một trong bảy ngôn ngữ trong Cài đặt.

Module local `modules/play-country` được Expo tự liên kết khi build Android. Billing Client chỉ truy vấn cấu hình, không có luồng mua hàng, quảng cáo hoặc theo dõi. SDK bổ sung quyền thường `com.android.vending.BILLING` vào manifest; app vẫn miễn phí, không thêm sản phẩm mua hàng. Không lưu mã quốc gia hoặc tự ghi ngôn ngữ suy ra vào storage; chỉ lựa chọn thủ công được lưu. Lần mở sau khi chưa chọn thủ công sẽ truy vấn lại. [API và quy định sử dụng của Google](https://developer.android.com/google/play/billing/integrate#query-billing-config).

Splash/onboarding chờ đọc ngôn ngữ, và kết quả truy vấn cũ không ghi đè lựa chọn thủ công/khôi phục backup mới hơn. Cần build binary mới cho module native; cập nhật JavaScript riêng không bổ sung module cho binary đang phát hành.

Trước lần phát hành tiếp theo, kiểm trên thiết bị cài qua Play: (1) cài mới với Play VN và máy tiếng Anh → tiếng Việt; (2) Play JP → tiếng Nhật; (3) quốc gia chưa ánh xạ hoặc dịch vụ không phản hồi → tiếng Anh; (4) chọn tiếng Anh thủ công với Play VN, đóng/mở → giữ tiếng Anh; (5) khôi phục backup có locale hợp lệ → giữ locale backup. Android Auto Backup có thể phục hồi lựa chọn cũ khi cài lại; cần xóa dữ liệu/không phục hồi backup để kiểm đúng trạng thái cài mới.

Theo yêu cầu hiện tại, không tăng version, không tạo AAB mới và không upload/release.

Kiểm tra local: TypeScript đạt, 61 unit test đạt; Expo tự đăng ký `PlayCountryModule`; Android `compileReleaseKotlin`, gộp manifest và đóng gói JavaScript/Hermes đạt. Chưa xác nhận quốc gia Play trên thiết bị thật.
