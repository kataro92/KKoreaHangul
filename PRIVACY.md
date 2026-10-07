# Privacy Policy — KKorea Hangul

## About this policy

KKorea Hangul is a Korean-language learning app published by The Space Kat Company / Phạm Huy Đức. This policy applies to the app, including Android package com.spacekatcompany.kkoreanhangul. Last updated: 7 October 2026.

## Learning data on your device

The app does not require an app account and has no advertising, developer-operated usage analytics, or developer-operated server for learning data. Hangul, vocabulary, grammar, and practice content are packaged with the app and can be studied offline.

Your custom flashcards, review progress and statistics, practice preferences, language and speech settings, reminder settings, and onboarding state are stored in the app's private storage. The app does not send these learning records to the developer. Text entered for syllable analysis is processed on your device; choosing pronunciation sends that text to your device's text-to-speech engine as explained below.

## Google Play country and default language

On Android, if you have not saved a valid language choice, the app asks the Google Play service for the country associated with your Play account to choose an initial interface language. Unsupported countries, unavailable services, or a timeout use English. Your saved language choice takes priority.

The country code is used temporarily for this request and is not saved, sent to a developer server, or used for analytics, advertising, or profiling. It is not GPS location. The country query does not access your Google email address, payment details, purchase history, or precise location. The Google Play service handles its own account and service information under Google’s policies. Optional support purchases are described separately below.

## Google Play library diagnostics

The Google Play Billing library used for the country query and optional support purchases includes its own diagnostic logging transport. When the app initializes or uses that library, it may queue and send technical events to Google over HTTPS, including connection or API results, errors, timing information, app package and version, Billing library and Android versions, device manufacturer/model/build and memory information, network type, system language/country, time-zone offset, SIM operator code when available, and a randomly generated Billing-client session identifier. This session identifier is not the advertising identifier.

This technical data supports operation, troubleshooting and reliability measurement of the Google Play service. It is separate from your learning records: the app does not pass flashcards, review history, entered learning text, or the returned Play country code to this logger. Google receives the SDK diagnostics; the developer does not receive them. Diagnostic events can be stored in a local transport queue before transmission, so they are not treated as ephemeral. Google controls server-side retention and deletion under its policies; clearing app storage removes the local queue but does not erase data already sent to Google.

The country query is automatic when there is no saved valid language. There is no separate in-app switch to disable the library diagnostics during that query. With a saved language, subsequent app launches skip the country query. Core lessons remain usable without the Play service or a successful query. Opening the support section also initializes the library. After a checkout has been attempted, the app reconnects on launch or foreground to finish pending purchases, even when a language choice is saved. Lessons do not depend on these requests.

## Optional support for Hangmi

On Android, you can voluntarily support the developer with symbolic gifts for Hangmi through Google Play. These are one-time repeatable purchases, not subscriptions, charitable donations, or delivery of physical food/toys. They do not unlock lessons or change access to app features. Google handles checkout, payment information, orders and refunds under its policies; the app and developer do not receive your payment card or bank details.

The app queries available product IDs and store-localized prices, and receives purchase product IDs, state, quantity and a purchase token from Play. It sends the token back to Play to consume/acknowledge the purchase. The token is used in memory and is not stored as raw text or sent to a developer server. A SHA-256 transaction fingerprint and per-gift totals are saved together in private Android storage to avoid counting a purchase twice. A flag records that checkout has been used, to recover pending transactions on later launches. This device-local history is not an accounting record and does not automatically adjust for refunds.

Android operating-system backup/transfer may restore these totals and fingerprints with the relevant backup snapshot. They are not included in the app’s exported learning-data JSON backup, do not continuously synchronize, and cannot be reconstructed from Play after consumable purchases have finished. Clearing storage removes local totals; older OS backups may still contain them. Google retains its transaction records separately. No developer-operated purchase database or independent server-side token verification is configured.

## Manual backup and restore

Export Backup creates a JSON file containing saved app data and opens the system share sheet. You choose the destination and recipient. Restore reads a backup file you select through the system document picker. The developer does not receive these files.

An exported backup is a readable JSON file and is not encrypted by the app. Share and store it only where you intend. External storage, cloud, email, and file services handle the file according to their own policies.

## Operating-system backup

Android Auto Backup or device-to-device transfer may copy and restore app data according to your device, Google account, and backup settings. iOS device backup may also include app data. The operating-system provider manages these backups; the developer cannot access them. This is restore functionality, not continuous synchronization by the app.

Deleting app data or uninstalling does not automatically delete exported files or older operating-system backups. Restoring a backup may restore the data it contains. Manage cloud backups through the relevant provider's settings.

## Pronunciation and notifications

Pronunciation uses the text-to-speech engine and Korean voice installed on your device. When you tap to listen, the selected Korean text is passed to that engine. Depending on the engine, voice, and device settings, it may process text online or download voice files. Those services are governed by their provider's policies. The app does not record microphone audio.

If you enable the study reminder, the app requests notification permission and schedules a local daily notification at 20:00. It does not register a remote push token or send your reminder data to a push server. Turn the reminder off in Settings or revoke notification permission to stop notifications.

## Permissions and external services

Notification, vibration, wake and boot permissions support optional local reminders. Internet and network-state permissions support platform services. Google Play Billing permission is included for the Play-country query and optional one-time support purchases; no subscriptions are offered. Backup files are selected through system pickers and shared only on your action.

The app does not request location, contacts, camera, microphone, calendar, or broad storage access, and does not use an advertising identifier. The existence of a platform permission does not mean the app sends your learning data to the developer.

Opening the public policy page uses your browser and GitHub Pages hosting, which may process normal connection information such as IP addresses under their policies. If you choose to email support, your email provider sends your email address, message, and any attachments you include to the developer. Do not include private learning records unless you intend to share them.

## Retention, deletion, and security

Local data remains until you remove it, clear the app's storage, or uninstall the app. Individual review cards can be deleted in the app. For all Android app data, use the system's Clear storage option. There is no app account or developer learning-data database to delete. Exported files and operating-system backups must be managed separately.

App data is stored in operating-system-protected app storage. Use your device's security and backup controls to protect it. The app does not provide its own encryption for exported backups. You control when data is exported, restored, or passed to pronunciation services.

## Changes and contact

We update this policy when app data practices change and identify the update date. For privacy questions or support, contact spacekatcompany@gmail.com. The existing feedback address kataro92@gmail.com is also operated by the developer.

---

# Chính sách quyền riêng tư — KKorea Hangul

## Phạm vi

KKorea Hangul là ứng dụng học tiếng Hàn do The Space Kat Company / Phạm Huy Đức phát hành. Chính sách áp dụng cho ứng dụng, gồm package Android com.spacekatcompany.kkoreanhangul. Cập nhật ngày 07/10/2026.

## Dữ liệu học trên thiết bị

Ứng dụng không yêu cầu tài khoản riêng, không có quảng cáo, analytics hành vi học do nhà phát triển vận hành hoặc máy chủ của nhà phát triển để lưu dữ liệu học. Bảng chữ, từ vựng, ngữ pháp và nội dung luyện tập được đóng gói để học ngoại tuyến.

Thẻ tự tạo, tiến độ và thống kê ôn tập, tùy chọn luyện đọc, ngôn ngữ, giọng đọc, nhắc học và trạng thái hướng dẫn được lưu trong bộ nhớ riêng của app. App không gửi các dữ liệu học này cho nhà phát triển. Văn bản nhập để phân tích âm tiết được xử lý trên thiết bị; khi chọn nghe, văn bản được chuyển cho công cụ đọc của thiết bị như mô tả bên dưới.

## Quốc gia Google Play và ngôn ngữ mặc định

Trên Android, khi chưa lưu lựa chọn ngôn ngữ hợp lệ, app hỏi dịch vụ Google Play về quốc gia tài khoản Play để chọn ngôn ngữ giao diện ban đầu. Quốc gia chưa hỗ trợ, dịch vụ không khả dụng hoặc hết thời gian chờ dùng tiếng Anh. Lựa chọn ngôn ngữ đã lưu được ưu tiên.

Mã quốc gia chỉ được sử dụng tạm thời cho yêu cầu đó; không lưu, không gửi cho máy chủ nhà phát triển, không dùng cho analytics, quảng cáo hoặc lập hồ sơ. Đây không phải vị trí GPS. Truy vấn quốc gia không đọc email Google, thông tin thanh toán, lịch sử mua hàng hoặc vị trí chính xác. Dịch vụ Google Play xử lý thông tin tài khoản và dịch vụ của họ theo chính sách Google. Khoản hỗ trợ tự nguyện được mô tả riêng bên dưới.

## Chẩn đoán của thư viện Google Play

Thư viện Google Play Billing dùng để hỏi quốc gia và hỗ trợ tự nguyện có cơ chế ghi và gửi chẩn đoán riêng. Khi app khởi tạo hoặc dùng thư viện, thư viện có thể xếp hàng và gửi sự kiện kỹ thuật tới Google qua HTTPS: kết quả kết nối/API, lỗi, thời gian xử lý, package và phiên bản app, phiên bản Billing/Android, hãng/mẫu/bản dựng thiết bị và thông tin bộ nhớ, loại mạng, ngôn ngữ/quốc gia hệ thống, múi giờ, mã nhà mạng SIM nếu có và một mã phiên Billing-client sinh ngẫu nhiên. Mã phiên này không phải mã quảng cáo.

Dữ liệu kỹ thuật phục vụ vận hành, xử lý lỗi và đo độ tin cậy của dịch vụ Google Play. App không chuyển thẻ học, lịch sử ôn tập, văn bản học đã nhập hoặc mã quốc gia Play trả về vào bộ ghi chẩn đoán này. Google nhận chẩn đoán SDK; nhà phát triển không nhận chúng. Sự kiện có thể lưu trong hàng đợi trên máy trước khi truyền nên không được xem là xử lý tạm thời trong bộ nhớ. Google quyết định thời gian giữ và xóa dữ liệu trên máy chủ theo chính sách của Google; xóa bộ nhớ app chỉ xóa hàng đợi cục bộ, không xóa dữ liệu đã gửi.

Truy vấn quốc gia chạy tự động khi chưa có lựa chọn ngôn ngữ hợp lệ đã lưu. App không có công tắc riêng tắt chẩn đoán thư viện trong lần truy vấn đó. Khi đã lưu ngôn ngữ, những lần mở app sau sẽ bỏ qua truy vấn quốc gia. Bài học chính vẫn dùng được khi thiếu dịch vụ Play hoặc truy vấn thất bại. Mở phần hỗ trợ cũng khởi tạo thư viện. Sau khi đã mở một lượt thanh toán, app kết nối lại khi khởi động hoặc vào tiền cảnh để hoàn tất giao dịch còn chờ, kể cả khi đã lưu ngôn ngữ. Bài học không phụ thuộc các yêu cầu này.

## Góp nuôi mèo Hangmi

Trên Android, bạn có thể hỗ trợ nhà phát triển tự nguyện qua các món quà tượng trưng cho Hangmi bằng Google Play. Đây là thanh toán một lần có thể góp lại, không phải đăng ký, quyên góp từ thiện hay giao thức ăn/đồ chơi thật. Không mở khóa bài học hoặc thay đổi quyền dùng tính năng. Google xử lý thanh toán, thông tin trả tiền, đơn hàng và hoàn tiền theo chính sách của họ; app và nhà phát triển không nhận thông tin thẻ hay tài khoản ngân hàng của bạn.

App hỏi Play về mã sản phẩm, giá theo cửa hàng và nhận mã sản phẩm đã mua, trạng thái, số lượng và purchase token. Token được gửi lại Play để consume/xác nhận giao dịch, chỉ dùng trong bộ nhớ, không lưu dạng thô hoặc gửi tới máy chủ nhà phát triển. Fingerprint SHA-256 của giao dịch và bộ đếm từng món được lưu cùng nhau trong bộ nhớ Android riêng để tránh đếm trùng. Một cờ ghi nhận đã mở thanh toán giúp khôi phục giao dịch còn chờ khi mở app sau này. Thống kê trên thiết bị này không phải sổ kế toán và không tự điều chỉnh theo hoàn tiền.

Sao lưu/chuyển máy của Android có thể phục hồi bộ đếm và fingerprint theo snapshot tương ứng. Chúng không nằm trong tệp JSON sao lưu dữ liệu học do app xuất, không đồng bộ liên tục và không thể tái dựng từ Play sau khi consumable đã hoàn tất. Xóa dữ liệu sẽ xóa số lượng cục bộ; bản sao lưu hệ điều hành cũ có thể vẫn chứa chúng. Google giữ hồ sơ giao dịch riêng. Không có cơ sở dữ liệu mua hàng hoặc xác minh token độc lập trên máy chủ nhà phát triển.

## Xuất và khôi phục sao lưu

Xuất sao lưu tạo tệp JSON chứa dữ liệu app đã lưu và mở bảng chia sẻ hệ thống. Bạn chọn nơi lưu và người nhận. Khôi phục đọc tệp do bạn chọn qua bộ chọn tài liệu hệ thống. Nhà phát triển không nhận các tệp này.

Tệp sao lưu là JSON có thể đọc được, app không mã hóa tệp. Chỉ lưu và chia sẻ tới nơi bạn chủ định. Dịch vụ lưu trữ, cloud, email và quản lý tệp xử lý tệp theo chính sách riêng của họ.

## Sao lưu của hệ điều hành

Android Auto Backup hoặc chuyển máy có thể sao chép, khôi phục dữ liệu app theo thiết bị, tài khoản Google và cài đặt sao lưu của bạn. Sao lưu thiết bị iOS cũng có thể chứa dữ liệu app. Nhà cung cấp hệ điều hành quản lý các bản sao này; nhà phát triển không truy cập được. Đây là khôi phục dữ liệu, không phải đồng bộ liên tục do app thực hiện.

Xóa dữ liệu hoặc gỡ app không tự xóa tệp đã xuất hay các bản sao lưu hệ điều hành cũ. Khôi phục có thể đưa lại dữ liệu trong bản sao đó. Quản lý sao lưu cloud trong cài đặt của nhà cung cấp tương ứng.

## Phát âm và thông báo

Phát âm dùng công cụ chuyển văn bản thành giọng nói và giọng tiếng Hàn trên thiết bị. Khi bạn chạm nghe, văn bản tiếng Hàn được chuyển cho công cụ đó. Tùy công cụ, giọng và cài đặt, dịch vụ có thể xử lý trực tuyến hoặc tải tệp giọng đọc, theo chính sách nhà cung cấp. App không thu âm micro.

Nếu bật nhắc học, app xin quyền thông báo và lên lịch thông báo cục bộ lúc 20:00 hằng ngày. App không đăng ký token push từ xa hoặc gửi dữ liệu nhắc học tới máy chủ push. Tắt nhắc trong Cài đặt hoặc thu hồi quyền thông báo để ngừng nhận.

## Quyền và dịch vụ bên ngoài

Quyền thông báo, rung, đánh thức và khởi động hỗ trợ lời nhắc cục bộ tùy chọn. Quyền Internet và trạng thái mạng hỗ trợ dịch vụ nền tảng. Quyền Google Play Billing dùng cho truy vấn quốc gia Play và khoản hỗ trợ một lần tùy chọn; không có đăng ký trả phí. Tệp sao lưu chỉ được chọn qua bộ chọn hệ thống và chia sẻ khi bạn thao tác.

App không xin quyền vị trí, danh bạ, camera, micro, lịch hoặc truy cập toàn bộ bộ nhớ, và không dùng mã định danh quảng cáo. Có quyền nền tảng không đồng nghĩa app gửi dữ liệu học cho nhà phát triển.

Mở trang chính sách công khai dùng trình duyệt và GitHub Pages; các dịch vụ này có thể xử lý thông tin kết nối thông thường như địa chỉ IP theo chính sách của họ. Khi bạn gửi email hỗ trợ, dịch vụ email chuyển địa chỉ email, nội dung và tệp bạn đính kèm cho nhà phát triển. Chỉ gửi dữ liệu học riêng tư nếu bạn muốn chia sẻ.

## Lưu giữ, xóa và bảo vệ dữ liệu

Dữ liệu cục bộ còn trên máy đến khi bạn xóa, xóa bộ nhớ app hoặc gỡ app. Có thể xóa từng thẻ ôn tập trong app. Để xóa toàn bộ dữ liệu Android, dùng Xóa dữ liệu/Xóa bộ nhớ trong cài đặt hệ thống. Không có tài khoản app hoặc cơ sở dữ liệu học trên máy chủ nhà phát triển để xóa. Tệp xuất và sao lưu hệ điều hành cần quản lý riêng.

Dữ liệu app nằm trong bộ nhớ riêng được hệ điều hành bảo vệ. Dùng các kiểm soát bảo mật và sao lưu của thiết bị để bảo vệ dữ liệu. App không tự mã hóa tệp sao lưu đã xuất. Bạn quyết định khi nào xuất, khôi phục hoặc chuyển văn bản cho dịch vụ phát âm.

## Cập nhật và liên hệ

Chính sách sẽ được cập nhật khi cách xử lý dữ liệu thay đổi và ghi ngày cập nhật. Liên hệ về quyền riêng tư hoặc hỗ trợ: spacekatcompany@gmail.com. Địa chỉ góp ý hiện có kataro92@gmail.com cũng do nhà phát triển quản lý.

Public policy: https://kataro92.github.io/spacekat-privacy-policies/kkorea-hangul/
