# Góp nuôi mèo Hangmi

Đã tham khảo `D:\Projects\Kalendar\docs\app-community.vi.md` cùng plugin Billing, ledger và kiểm thử của Kalendar. Chủ ứng dụng đã chọn ba món và mức giá dưới đây ngày 07/10/2026. Đã cấu hình ba sản phẩm và phát hành AAB `1.1.4 (6)` riêng trên Internal testing ngày 07/10/2026; Console xác nhận **Active — Available to internal testers**, release ID `3`.

## Nội dung và mức hỗ trợ

Phần **Góp nuôi mèo Hangmi** nằm cuối Cài đặt, đóng mặc định. Chỉ tải sản phẩm/giá khi người dùng mở; không popup, không lời nhắc trên bài học, không ép mua. Dùng lại mascot Hangmi, có tên món và lời cảm ơn luân phiên ở cả bảy ngôn ngữ UI. Đây là món quà tượng trưng để hỗ trợ nhà phát triển; không nhận quyên góp từ thiện, không giao đồ ăn/đồ chơi vật lý.

| Product ID | Món tượng trưng | Giá Việt Nam đã chọn | Mô tả Console đề xuất |
| --- | --- | --- | --- |
| `hangmi_kibble` | Bát hạt cho Hangmi | 29.000 ₫ | Một bát hạt tượng trưng để hỗ trợ nhà phát triển KKorea Hangul. Tự nguyện, thanh toán một lần, có thể góp lại. Không mở khóa tính năng và không giao thức ăn thật. |
| `hangmi_pate` | Pate cho Hangmi | 59.000 ₫ | Một phần pate tượng trưng để hỗ trợ nhà phát triển KKorea Hangul. Tự nguyện, thanh toán một lần, có thể góp lại. Không mở khóa tính năng và không giao thức ăn thật. |
| `hangmi_toy` | Đồ chơi cho Hangmi | 99.000 ₫ | Một món đồ chơi tượng trưng để hỗ trợ nhà phát triển KKorea Hangul. Tự nguyện, thanh toán một lần, có thể góp lại. Không mở khóa tính năng và không giao đồ chơi thật. |

Ba sản phẩm Google Play **one-time consumable**, mỗi sản phẩm đúng một purchase option **Buy**, không offer/pre-order/rental/multi-quantity. Giá trên UI và màn thanh toán lấy từ Play, không hiển thị giá gợi ý như giá thực. Native từ chối sản phẩm thiếu option, nhiều option, giá không dương hoặc giá VND sai bảng; các tiền tệ khác do cửa hàng cung cấp. Sản phẩm chưa cấu hình sẽ không có nút trả tiền. iOS/web/Expo Go không có luồng thanh toán này, chỉ có thông báo phạm vi hỗ trợ. Không tái sử dụng Product ID Kalendar hoặc StoreKit ID khác app.

Cam kết: tự nguyện, thanh toán một lần, không gia hạn, không mở khóa tính năng; ứng dụng miễn phí và không quảng cáo. Google xử lý phí, đơn hàng, checkout và hoàn tiền. Không nói 100% tiền tới developer. Với các khoản tip trực tiếp 100% tới creator và không có nội dung/quyền lợi, Google mô tả ngoại lệ P2P; mô hình quà tượng trưng trong app ở đây giữ cách triển khai Google Play Billing của Kalendar. Đối chiếu [Payments policy](https://support.google.com/googleplay/android-developer/answer/10281818) khi cấu hình và review; tên món không biến khoản hỗ trợ thành một sản phẩm vật lý.

## Xử lý giao dịch và dữ liệu

Module Expo local `modules/hangmi-support`, Billing `8.3.0` cùng phiên bản đang dùng để đọc Play country; không đổi thư viện hoặc thêm SDK quảng cáo. Chỉ `PURCHASED` được ghi/consume (consume đồng thời acknowledge); `PENDING` không đếm, không cảm ơn. Chặn bấm kép, ngăn góp lại mức đang pending/processing, không coi hủy là lỗi. Mỗi checkout hỏi ProductDetails mới. Lỗi hoặc kết quả không rõ yêu cầu đợi, không khuyên trả tiền lần nữa. Khôi phục giao dịch còn tồn tại khi mở app/tiền cảnh; tự khôi phục chỉ sau khi người dùng đã mở checkout, không tự mở giao diện hỗ trợ.

Ledger native sao chép cơ chế từ Kalendar, đổi sang SharedPreferences **HangmiSupport**: ghi nguyên tử fingerprint SHA-256 + tổng số từng món trước consume. Nếu ghi thất bại, không consume; giao dịch trùng không đếm lại cả sau restart. Raw token chỉ dùng trong bộ nhớ và gửi lại Play, không đưa vào JS/log/file hoặc server developer. Checkout đang mở chỉ được hoàn tất bởi token tương ứng; callback khôi phục cũ không kết thúc nhầm lượt mới. Promise/event cùng giao dịch chỉ cảm ơn một lần, snapshot cũ không giảm số lượng. UI chỉ đọc tổng native, không tự cộng tiền hay món. Không phát lại lời cảm ơn từ lịch sử khi mở Cài đặt.

OS backup/transfer Android có thể giữ ledger theo snapshot (manifest hiện cho phép Auto Backup, không có allowlist hạn chế SharedPreferences). **JSON backup học tập không chứa ledger**; import không thay đổi bộ đếm hỗ trợ. Consumable đã consume không thể tái dựng từ Play; không đồng bộ liên tục/xuyên nền tảng, không tự điều chỉnh hoàn tiền, bộ đếm không phải sổ kế toán. Không có backend xác minh token độc lập/RTDN; kết quả Android dựa vào BillingClient. Nếu sau này thêm quyền lợi hoặc dữ liệu mua hàng đồng bộ thì phải thiết kế xác minh server và xử lý refund/revoke trước.

Policy source EN/VI và `PRIVACY.md`/`store-assets/privacy.html` đã bổ sung luồng hỗ trợ, purchase token, fingerprint, bộ đếm và giới hạn backup. Trang policy công khai đã triển khai từ commit `30254ad` của repo privacy-policies; GitHub Pages thành công và nội dung EN/VI đã kiểm trực tiếp. Data safety đã lưu thêm Purchase history: collected/shared, optional, không ephemeral, App functionality; đang chờ gửi review.

## Cấu hình phát hành và kiểm tra trên thiết bị

1. Tăng version code cao hơn 5, giữ upload key, build/release chỉ Internal theo hướng dẫn dự án. Code 6 đã được phát hành lên Internal.
2. Tạo/kích hoạt ba sản phẩm trong **đúng app KKorea**, option Buy, giá Việt Nam đúng bảng, EN/VI mô tả tương ứng; kiểm ProductDetails/checkout và tiền tệ khác. Sản phẩm Kalendar Active không có nghĩa KKorea đã có sản phẩm.
3. Đồng bộ policy công khai. Rà soát Data safety để thêm **Purchase history**, optional, collected/shared với Google, purpose App functionality; fingerprint/lịch sử trên máy và Play purchase processing phải được khai báo theo thực tế. Diagnostics/Device IDs hiện có vẫn giữ và diễn giải cả hoạt động Billing hỗ trợ. Không khai báo app không có mua hàng nữa.
4. Cập nhật IARC mục digital goods thành Yes và kiểm lại rating; rà soát mô tả listing/nhãn in-app purchases, Financial features nếu Console hỏi thêm. Không tự bắt đầu Closed/Production.
5. Chọn license tester của KKorea, dùng phương thức Google Play test (không dùng tiền thật để chạy test). Kiểm success/cancel/decline/pending-approve/pending-decline, offline sau trả tiền, kill giữa record/consume, mở lại/foreground, callback trùng, mua lặp, ITEM_ALREADY_OWNED, backup/restore và refund. Các lần Kalendar chạy tốt không chứng minh checkout KKorea đã được kiểm.

Tài liệu API: [Billing integration](https://developer.android.com/google/play/billing/integrate).

## Kiểm local ngày 07/10/2026

- TypeScript đạt; 70 kiểm thử JavaScript đạt, gồm sản phẩm/giá thiếu, trạng thái chờ/hủy/kết quả chưa rõ, receipt sai, event trùng và snapshot cũ.
- Native Debug/Release Kotlin compile đạt; 7 JUnit kiểm pending/unknown, consume trùng/lỗi/retry, giá VND, ledger qua restart/backup và lỗi ghi dữ liệu đạt. Expo tự liên kết `HangmiSupportModule` trong package list.
- App `compileReleaseKotlin`, gộp manifest và đóng gói JavaScript/Hermes đạt. Manifest vẫn cho phép Auto Backup, không có AD_ID. Kết quả này là kiểm build local; trạng thái phát hành Console được ghi riêng bên dưới.
- Đã kiểm giao diện thật qua web local, tiếng Việt/Anh và khung 390/320 px: đóng mặc định, mở hiện đúng món/copy/mascot, không tràn ngang, không có nút trả tiền trên web. Bằng chứng local: `release/hangmi-support-vi.png`. Đây không phải kiểm UI checkout native hoặc thanh toán Play thật.
- Metro loại `release/` và `.secrets/` khỏi theo dõi: socket Gradle trên Windows từng gây EACCES và dừng dev server; source/assets bình thường vẫn được theo dõi.

Chưa kiểm trên thiết bị cài qua Play và chưa chạy license-test thanh toán cho KKorea. Cấu hình cửa hàng thực hiện sau các kiểm local được ghi bên dưới; chỉ coi checkout đã đạt khi có kiểm trên thiết bị.

## Cấu hình Console ngày 07/10/2026

- `hangmi_kibble`, `hangmi_pate`, `hangmi_toy`: option `buy` loại Buy, Active, 174 countries/regions; giá Việt Nam đúng 29.000 / 59.000 / 99.000 ₫. Các vùng khác dùng giá Google Play chuyển đổi. EN-US mặc định, thêm bản dịch vi; tax category Digital app sales. Không tạo offers hoặc subscriptions.
- License testing đã lưu thêm danh sách KKorea Hangul - Thử nghiệm nội bộ (2 người), giữ danh sách Nhật Nguyệt được chọn; response RESPOND_NORMALLY. Đây là cấu hình developer-wide, không phải bằng chứng checkout trên thiết bị.
- Bản build: TypeScript và 70 Jest test đạt; bundleRelease thành công, bundletool validate/chữ ký/upload certificate đúng, 38 thư viện 64-bit đạt ELF 16 KB. SHA-256: `E53230988A2F0A4FF8BDCED0EE681B618A3C16059B856E6BD9A1E791AB5F769C`.
- Sau khi chủ tài khoản xác nhận, đã chấp nhận lại IARC Terms of Use và hoàn tất bảng mới: digital goods Yes, random/chance-based purchases No. Console xác nhận **Completed**, submitted 07/10/2026 lúc 12:09 PM; các mức tuổi giữ nguyên, thêm interactive element **In-App Purchases**. App content không còn mục cần xử lý. Khai báo và listing được lưu chờ gửi review.
- Release `1.1.4 (6) - Hangmi support - Internal`, ID `3`, được phát hành 07/10/2026 lúc 12:09 PM (giờ hiển thị trên Console), **Available to internal testers — Not reviewed**. Không bắt đầu Closed/Production. Bằng chứng: `release/hangmi-internal-1.1.4-active.png`, `release/hangmi-iarc-completed.png`.
