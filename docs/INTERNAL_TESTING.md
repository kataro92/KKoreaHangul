# KKorea Hangul — Internal testing

Phạm vi: chỉ Internal testing, dừng trước Closed testing và Production. Miễn phí, không quảng cáo. Cập nhật ngày 07/10/2026.

## Package hiện tại

- Android: `com.spacekatcompany.kkoreanhangul`, đúng ID được yêu cầu.
- Phiên bản Internal hiện tại: `1.1.5`, versionCode `7`.
- iOS giữ bundleIdentifier riêng trong `app.json`.
- Tài khoản Play: The Space Kat Company, developer ID `6660012349184224355`.
- App mới đã tạo ngày 05/10/2026 sau khi chủ tài khoản xác nhận hai khai báo: KKorea Hangul, English (United States) — `en-US`, App, Free. App ID `4975560487486352974`, Internal track ID `4699881387950463788`. Danh sách thử `KKorea Hangul - Thử nghiệm nội bộ` đã được chọn và lưu, gồm `spacekatcompany@gmail.com` và `kataro92@gmail.com`.
- [Internal testing trên Console](https://play.google.com/console/u/1/developers/6660012349184224355/app/4975560487486352974/tracks/4699881387950463788).
- Đã phát hành release ID `4`, tên `1.1.5 (7) - Learning languages - Internal`, ghi chú `en-US` và `vi`, ngày 07/10/2026 lúc 6:22 PM (giờ hiển thị trên Console). Console xác nhận **Active — Available to internal testers — Not reviewed**. Chưa bắt đầu Closed testing hoặc Production. Bản trước `1.1.4 (6) - Hangmi support - Internal`, release ID `3`, phát hành ngày 07/10/2026 lúc 12:09 PM. Bản `1.1.3 (5) - Internal`, release ID `2`, ngày 05/10/2026 lúc 18:05. Release đầu tiên `1.1.2 (4) - Internal`, release ID `1`, ngày 05/10/2026 lúc 13:53. Không đưa bundle cũ vào release mới.
- [Tham gia Internal testing](https://play.google.com/apps/internaltest/4699881387950463788): đăng nhập bằng một trong hai email đã chọn, tham gia rồi cài từ Google Play. Danh sách email là điều kiện tham gia, không đồng nghĩa đã opt-in. Google thông báo thay đổi thường xuất hiện trong một giờ, đôi khi lâu hơn.
- Play tạm hiển thị `com.spacekatcompany.kkoreanhangul (unreviewed)` vì app chưa review. Bản `1.1.5 (7)` có dung lượng tải cài mới ước tính 57,9 MB, cập nhật 4,78 MB. Không giảm thiết bị hỗ trợ. Có một cảnh báo không chặn về deobfuscation file; bản hiện tại chưa bật minify/R8, native debug symbols đã đính kèm.
- Bằng chứng bản hiện tại: `release/internal-1.1.5-active.png`. Bằng chứng các bản trước: `release/hangmi-internal-1.1.4-active.png`, `release/com.spacekatcompany.kkoreanhangul-1.1.3-5-internal-published.png`, `release/com.spacekatcompany.kkoreanhangul-internal-published.jpg`.

## AAB đã phát hành

### Bản 1.1.5 hiện tại

Ngày 07/10/2026, chủ ứng dụng yêu cầu phát hành các thay đổi nội dung học đa ngôn ngữ. Đã tăng source lên `1.1.5 (7)`, build thành công và phát hành riêng trên Internal testing. Source phát hành nằm trong commit `69e5f45` trên `develop`.

- AAB: `release/com.spacekatcompany.kkoreanhangul-1.1.5-7.aab`.
- SHA-256: `2B9DE0AB99437D098185024933B11212AD87D37F754309E8CBF9D68E5BBBE261`.
- TypeScript và 97 Jest test trong 9 suite đạt. Gradle bundleRelease thành công; bundletool validate, jarsigner verify, package/version/target SDK 36 và upload certificate cũ khớp. 38 thư viện ELF 64-bit đạt alignment 16 KB; JavaScript/Hermes được đóng gói.
- Nội dung: dịch ngữ pháp/từ vựng/nghĩa câu/privacy theo ngôn ngữ chọn, phiên âm câu offline, thẻ ôn tập theo locale và nhắc học khi đổi ngôn ngữ/khôi phục backup. Các catalog là bản dịch máy, cần rà soát ngôn ngữ trên thiết bị; kiểm thử coverage không chứng minh chất lượng bản dịch.
- Console nhận AAB code `7`, preview không có lỗi chặn, đã Save and publish release ID `4` với ghi chú EN/VI. Track xác nhận Available to internal testers lúc 6:22 PM; code `6` không được đưa vào release mới.
- Chưa smoke test bản này trên thiết bị Android hoặc kiểm runtime 16 KB; kiểm ngôn ngữ, reminder và checkout qua Play vẫn cần thiết bị thực.

### Bản 1.1.4 đã phát hành

Thiết lập App content và chính sách riêng tư: xem [PLAY_APP_SETUP.md](PLAY_APP_SETUP.md). Binary `1.1.4 (6)` chứa trang chính sách trong app và phần góp nuôi Hangmi.

`release/com.spacekatcompany.kkoreanhangul-1.1.4-6.aab`

SHA-256: `E53230988A2F0A4FF8BDCED0EE681B618A3C16059B856E6BD9A1E791AB5F769C`.

Build release, TypeScript và 70 Jest test đạt; 7 native JUnit test đã đạt trong bước kiểm module. Bundletool validate, jarsigner verify, đối chiếu upload certificate được giữ nguyên, package/version/target SDK 36 và kiểm 38 thư viện ELF 64-bit alignment 16 KB đạt. JavaScript/Hermes và native `HangmiSupportModule` được đóng gói. Chưa kiểm checkout trên thiết bị cài qua Play hoặc runtime trên thiết bị 16 KB.

### AAB 1.1.3 trước đó

`release/com.spacekatcompany.kkoreanhangul-1.1.3-5.aab`

SHA-256: `475AA135E528F95FA9D3500368B256260486B95E08D9EE4BD4EA9E2FCFA0205D`.

Build release, TypeScript và 61 unit test đạt. Bundletool validate, jarsigner verify, đối chiếu upload certificate, package/version/target SDK 36 và kiểm 38 thư viện ELF 64-bit alignment 16 KB đạt. JavaScript/Hermes bundle và module native `PlayCountry` được đóng gói. Google Play nhận đúng code `5`, không có lỗi chặn và không làm mất thiết bị được hỗ trợ so với bản trước.

Smoke test Android 14 trên AVD riêng `KKoreaStore34`: cập nhật từ APK thử nghiệm code `4` giữ lựa chọn tiếng Anh; xóa dữ liệu thử nghiệm rồi mở mới (không có Play service) hiển thị onboarding và giao diện tiếng Anh; chọn tiếng Việt thủ công rồi force-stop/mở lại vẫn giữ tiếng Việt; mở tab Đọc thành công, crash log trống trong các bước kiểm tra. APK emulator được tạo từ AAB mới và ký bằng debug key để kiểm thử local; AAB upload vẫn ký bằng upload key được giữ nguyên. Chưa xác nhận truy vấn quốc gia trên tài khoản Play thật hoặc runtime trên thiết bị 16 KB. Bằng chứng local: `release/smoke-1.1.3-5-default-en.png`, `release/smoke-1.1.3-5-saved-vi.png`.

### AAB bản đầu

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

Bản `1.1.4 (6)` có **Góp nuôi mèo Hangmi** và màn hình privacy đã phát hành trên Internal. Ba sản phẩm Active, giá VN 29.000 / 59.000 / 99.000 ₫, license testing đã lưu danh sách KKorea. Policy công khai và Data safety/listing mua hàng đã đồng bộ. IARC mới Completed ngày 07/10/2026, digital goods Yes, random purchases No; các mức tuổi giữ nguyên, thêm In-App Purchases. Chưa chạy checkout trên thiết bị cài qua Play; dùng phương thức Google Play test để kiểm success/cancel/decline/pending, phục hồi và mua lặp trước khi mở rộng phát hành. Xem [Hangmi support](HANGMI_SUPPORT.md).

Privacy URL, chính sách mô tả Auto Backup, Data safety và App content đã hoàn tất và cập nhật cho Hangmi ngày 07/10/2026; xem [Google Play app setup](PLAY_APP_SETUP.md). Binary Internal `1.1.5 (7)` chứa màn hình privacy theo ngôn ngữ đã chọn và phần góp nuôi Hangmi. Cần tiếp tục kiểm thiết bị cấu hình thấp và runtime 16 KB. Không tự bắt đầu Closed testing hoặc Production.

Hồ sơ cửa hàng đã lưu trên Console với English (United States) `en-US` mặc định và Vietnamese `vi` bổ sung: tên, mô tả ngắn/đầy đủ, icon Hangmi hiện có, banner mới và 6 screenshot Android cho mỗi ngôn ngữ. Tệp nguồn nằm trong [store-assets](../store-assets/README.md). Publishing overview xác nhận đủ thông tin listing cho cả hai ngôn ngữ. App setup đã hoàn tất và Content rating có trạng thái IARC Completed; App content không còn khai báo cần xử lý. Hồ sơ và khai báo đang lưu chờ gửi review, chưa hiển thị như một trang Store đã được review; việc này không chặn Internal release. Bằng chứng: `release/store-listing-completed.png`, `release/play-app-content-complete.png`, `release/play-content-ratings-complete.png`.

## Ngôn ngữ mặc định từ 1.1.3 (5)

Bản cũ `1.1.2 (4)` dùng logic mặc định tiếng Việt khi chưa có lựa chọn đã lưu. Bản `1.1.3 (5)` đã phát hành logic mới bên dưới. Ngôn ngữ mặc định của store listing `en-US` không quyết định ngôn ngữ bên trong app.

Source mới ưu tiên lựa chọn ngôn ngữ đã lưu; nếu chưa có lựa chọn hợp lệ, Android đọc **quốc gia tài khoản Google Play** bằng `BillingClient.getBillingConfigAsync`. Đây không phải ngôn ngữ thiết bị, vị trí GPS, hay quốc gia suy ra từ SIM. Ví dụ Play Việt Nam + máy đặt tiếng Anh vẫn chọn tiếng Việt.

Ánh xạ sản phẩm: VN → vi; CN/TW/HK/MO → zh; IN → hi; JP → ja; FR → fr; ES và AR/BO/CL/CO/CR/CU/DO/EC/GT/HN/MX/NI/PA/PE/PY/SV/UY/VE → es. Các quốc gia còn lại → en. Quốc gia không xác định, lỗi dịch vụ, hoặc quá 2 giây → en. iOS/web và Expo Go không có module Android này → en. Người dùng luôn có thể chọn một trong bảy ngôn ngữ trong Cài đặt.

Module local `modules/play-country` được Expo tự liên kết khi build Android. Trong binary `1.1.3 (5)`, Billing Client chỉ truy vấn cấu hình; bản `1.1.4 (6)` thêm luồng hỗ trợ riêng. Không có quảng cáo hoặc theo dõi hành vi học do developer triển khai. Billing SDK có gửi dữ liệu chẩn đoán kỹ thuật tới Google; thông tin này đã được khai báo trong Data safety và privacy policy, xem [cơ sở kiểm tra SDK](PLAY_APP_SETUP.md#data-safety-basis). SDK bổ sung quyền thường `com.android.vending.BILLING` vào manifest; app vẫn miễn phí. Bản `1.1.3 (5)` chưa có sản phẩm mua hàng; bản `1.1.4 (6)` có ba món hỗ trợ tự nguyện. Không lưu mã quốc gia hoặc tự ghi ngôn ngữ suy ra vào storage; chỉ lựa chọn thủ công được lưu. Lần mở sau khi chưa chọn thủ công sẽ truy vấn lại. [API và quy định sử dụng của Google](https://developer.android.com/google/play/billing/integrate#query-billing-config).

Splash/onboarding chờ đọc ngôn ngữ, và kết quả truy vấn cũ không ghi đè lựa chọn thủ công/khôi phục backup mới hơn. Cần build binary mới cho module native; cập nhật JavaScript riêng không bổ sung module cho binary đang phát hành.

Trước lần phát hành tiếp theo, kiểm trên thiết bị cài qua Play: (1) cài mới với Play VN và máy tiếng Anh → tiếng Việt; (2) Play JP → tiếng Nhật; (3) quốc gia chưa ánh xạ hoặc dịch vụ không phản hồi → tiếng Anh; (4) chọn tiếng Anh thủ công với Play VN, đóng/mở → giữ tiếng Anh; (5) khôi phục backup có locale hợp lệ → giữ locale backup. Android Auto Backup có thể phục hồi lựa chọn cũ khi cài lại; cần xóa dữ liệu/không phục hồi backup để kiểm đúng trạng thái cài mới.

Ngày 05/10/2026, chủ tài khoản yêu cầu phát hành phiên bản mới rồi commit/push. Phiên bản đã tăng lên `1.1.3 (5)`, build và phát hành riêng trên Internal testing.

Kiểm tra local: TypeScript đạt, 61 unit test đạt; Expo tự đăng ký `PlayCountryModule`; Android `compileReleaseKotlin`, gộp manifest và đóng gói JavaScript/Hermes đạt. Chưa xác nhận quốc gia Play trên thiết bị thật.
