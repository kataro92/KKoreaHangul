import type { Locale } from '../localization/locale';
import type { SupportItem } from './catalog';

type SupportCopy = {
  title: string; intro: string; footnote: string; loading: string; unavailable: string; nativeOnly: string;
  retry: string; pending: string; processing: string; failed: string; history: string;
  items: Record<SupportItem, string>; thanks: Record<SupportItem, readonly string[]>;
};

export const SUPPORT_COPY: Record<Locale, SupportCopy> = {
  vi: {
    title: 'Góp nuôi mèo Hangmi',
    intro: 'Hangmi thích nằm cạnh bạn mỗi buổi học tiếng Hàn. Nếu muốn tiếp sức cho người làm KKorea Hangul, bạn có thể gửi mèo một bát hạt, phần pate hoặc món đồ chơi tượng trưng. Mỗi chút góp sức giúp chăm sóc và phát triển ứng dụng.',
    footnote: 'Hoàn toàn tự nguyện, thanh toán một lần qua Google Play, không tự gia hạn hay mở khóa tính năng. Ứng dụng vẫn miễn phí, không quảng cáo. Đây là hỗ trợ nhà phát triển; không giao thức ăn hay đồ chơi thật.',
    loading: 'Đang hỏi giá Google Play…', unavailable: 'Google Play chưa có các món này trên thiết bị của bạn. Bạn vẫn có thể học cùng Hangmi như bình thường.',
    nativeOnly: 'Các món quà tượng trưng hiện chỉ có trong ứng dụng Android cài từ Google Play.',
    retry: 'Thử tải lại', pending: 'Google Play đang chờ xác nhận thanh toán. Bạn chưa cần góp lại.',
    processing: 'Giao dịch đang được hoàn tất. App sẽ kiểm tra lại khi bạn mở ứng dụng; bạn chưa cần thanh toán thêm.',
    failed: 'Lần này chưa gửi được. Bạn có thể thử lại sau.', history: 'Các món đã gửi trên thiết bị này',
    items: { kibble: 'Bát hạt cho Hangmi', pate: 'Pate cho Hangmi', toy: 'Đồ chơi cho Hangmi' },
    thanks: {
      kibble: ['Hangmi có bát hạt đầy rồi. Cảm ơn bạn, meo!', 'Bụng no, mèo lại ngồi học cùng bạn. Cảm ơn nhé!', 'Hangmi cất dành vài hạt cho buổi học sau. Meo meo!'],
      pate: ['Mở pate là Hangmi chạy tới ngay. Cảm ơn bạn!', 'Bữa ngon quá! Hangmi gửi bạn một cái dụi đầu.', 'Hangmi liếm sạch bát rồi. Cảm ơn bạn đã tiếp sức!'],
      toy: ['Hangmi có đồ chơi mới rồi! Cảm ơn bạn.', 'Chơi một chút, rồi cùng bạn học tiếp nhé. Meo!', 'Hangmi ôm món đồ chơi và gửi bạn một lời cảm ơn.'],
    },
  },
  en: {
    title: 'Feed Hangmi the cat',
    intro: 'Hangmi loves keeping you company while you learn Korean. If you would like to support the maker of KKorea Hangul, send the cat a symbolic bowl of kibble, some pâté, or a toy. Your support helps care for and improve the app.',
    footnote: 'Entirely optional. One-time payment through Google Play; no renewal or feature unlocks. The app stays free and ad-free. This supports the developer; no real food or toys are delivered.',
    loading: 'Asking Google Play for prices…', unavailable: 'These gifts are not available through Google Play on this device yet. You can keep learning with Hangmi as usual.',
    nativeOnly: 'Symbolic gifts are currently available only in the Android app installed from Google Play.',
    retry: 'Try again', pending: 'Google Play is waiting for payment confirmation. There is no need to contribute again yet.',
    processing: 'Your transaction is being completed. The app will check again when you reopen it; there is no need to pay again yet.',
    failed: 'This gift could not be sent. You can try again later.', history: 'Gifts sent on this device',
    items: { kibble: 'A bowl of kibble for Hangmi', pate: 'Pâté for Hangmi', toy: 'A toy for Hangmi' },
    thanks: {
      kibble: ['Hangmi has a full bowl. Thank you, meow!', 'A full tummy and another study session together. Thank you!', 'Hangmi saved a few bites for the next lesson. Meow!'],
      pate: ['Open the pâté and Hangmi comes running. Thank you!', 'What a treat! Hangmi sends you a little head bump.', 'Hangmi licked the bowl clean. Thank you for your support!'],
      toy: ['A new toy for Hangmi! Thank you.', 'A little playtime, then back to studying with you. Meow!', 'Hangmi hugs the toy and sends you a thank-you.'],
    },
  },
  zh: {
    title: '一起养猫咪 Hangmi', intro: 'Hangmi 喜欢陪你学习韩语。如果你愿意支持 KKorea Hangul 的开发者，可以象征性地送猫咪一碗猫粮、猫罐头或玩具。你的支持有助于维护和改进应用。',
    footnote: '完全自愿，通过 Google Play 一次性付款，不自动续费，不解锁功能。应用仍免费且无广告。这是对开发者的支持，不会寄送真实食品或玩具。',
    loading: '正在向 Google Play 查询价格…', unavailable: '此设备的 Google Play 暂时没有这些礼物。你仍可照常和 Hangmi 学习。', nativeOnly: '象征性礼物目前仅在通过 Google Play 安装的 Android 应用中提供。',
    retry: '重试', pending: 'Google Play 正在等待付款确认，暂时无需再次支持。', processing: '交易正在完成。重新打开应用时会再次检查，暂时无需再次付款。', failed: '此次礼物未能送出，请稍后重试。', history: '此设备上已送出的礼物',
    items: { kibble: '送 Hangmi 一碗猫粮', pate: '送 Hangmi 猫罐头', toy: '送 Hangmi 一个玩具' },
    thanks: { kibble: ['Hangmi 的碗装满了。谢谢你，喵！', '吃饱了，继续陪你学习。谢谢！', 'Hangmi 为下节课留了几粒猫粮。喵！'], pate: ['罐头一开，Hangmi 就跑来了。谢谢！', '真好吃！Hangmi 蹭蹭你的头。', '碗舔干净啦。谢谢你的支持！'], toy: ['Hangmi 有新玩具啦！谢谢！', '玩一会儿，再陪你学习。喵！', 'Hangmi 抱着玩具向你道谢。'] },
  },
  hi: {
    title: 'Hangmi बिल्ली की देखभाल में साथ दें', intro: 'Hangmi को आपके साथ कोरियाई सीखना पसंद है। KKorea Hangul के निर्माता की मदद के लिए बिल्ली को प्रतीकात्मक रूप से भोजन का कटोरा, पैटे या खिलौना भेज सकते हैं। आपका सहयोग ऐप की देखभाल और सुधार में मदद करता है।',
    footnote: 'पूरी तरह वैकल्पिक। Google Play से एक बार भुगतान; कोई स्वतः नवीनीकरण या सुविधा अनलॉक नहीं। ऐप मुफ़्त और विज्ञापन रहित रहता है। यह डेवलपर का सहयोग है; असली भोजन या खिलौने नहीं भेजे जाते।',
    loading: 'Google Play से कीमतें पूछ रहे हैं…', unavailable: 'इस डिवाइस पर Google Play में ये उपहार अभी उपलब्ध नहीं हैं। Hangmi के साथ सीखना जारी रखें।', nativeOnly: 'प्रतीकात्मक उपहार अभी केवल Google Play से इंस्टॉल किए गए Android ऐप में उपलब्ध हैं।',
    retry: 'फिर कोशिश करें', pending: 'Google Play भुगतान की पुष्टि की प्रतीक्षा कर रहा है। अभी दोबारा सहयोग देने की ज़रूरत नहीं है।', processing: 'लेन-देन पूरा हो रहा है। ऐप दोबारा खुलने पर जाँच करेगा; अभी फिर भुगतान न करें।', failed: 'इस बार उपहार नहीं भेज पाए। बाद में कोशिश कर सकते हैं।', history: 'इस डिवाइस पर भेजे गए उपहार',
    items: { kibble: 'Hangmi के लिए भोजन का कटोरा', pate: 'Hangmi के लिए पैटे', toy: 'Hangmi के लिए खिलौना' },
    thanks: { kibble: ['Hangmi का कटोरा भर गया। शुक्रिया, म्याऊँ!', 'पेट भर गया, अब साथ पढ़ें। शुक्रिया!', 'Hangmi ने अगली पढ़ाई के लिए थोड़ा भोजन बचाया।'], pate: ['पैटे खुलते ही Hangmi आ गया। शुक्रिया!', 'बहुत स्वादिष्ट! Hangmi का प्यार भरा अभिवादन।', 'कटोरा साफ़ हो गया। सहयोग के लिए शुक्रिया!'], toy: ['Hangmi को नया खिलौना मिला! शुक्रिया।', 'थोड़ा खेलें, फिर साथ पढ़ें। म्याऊँ!', 'Hangmi खिलौना गले लगाकर आपको धन्यवाद देता है।'] },
  },
  es: {
    title: 'Ayuda a cuidar a Hangmi', intro: 'A Hangmi le encanta acompañarte mientras aprendes coreano. Si quieres apoyar a quien crea KKorea Hangul, puedes enviar al gato un cuenco de pienso, paté o un juguete simbólicos. Tu apoyo ayuda a mantener y mejorar la app.',
    footnote: 'Totalmente voluntario. Pago único por Google Play, sin renovación ni funciones de pago. La app sigue siendo gratuita y sin anuncios. Apoyas al desarrollador; no se entrega comida ni juguetes reales.',
    loading: 'Consultando precios en Google Play…', unavailable: 'Estos regalos aún no están disponibles en Google Play en este dispositivo. Puedes seguir aprendiendo con Hangmi.', nativeOnly: 'Los regalos simbólicos están disponibles solo en la app Android instalada desde Google Play.',
    retry: 'Reintentar', pending: 'Google Play espera la confirmación del pago. No necesitas volver a contribuir todavía.', processing: 'Se está completando la transacción. La app volverá a comprobarla al abrirse; no necesitas pagar otra vez.', failed: 'No se pudo enviar este regalo. Puedes intentarlo más tarde.', history: 'Regalos enviados en este dispositivo',
    items: { kibble: 'Un cuenco de pienso para Hangmi', pate: 'Paté para Hangmi', toy: 'Un juguete para Hangmi' },
    thanks: { kibble: ['¡Hangmi tiene el cuenco lleno! Gracias, miau.', 'Con la barriga llena, seguimos estudiando. ¡Gracias!', 'Hangmi guardó unos bocados para la próxima lección.'], pate: ['¡Abre el paté y Hangmi viene corriendo! Gracias.', '¡Qué rico! Hangmi te saluda con un cariñoso cabezazo.', '¡Hangmi dejó el cuenco limpio! Gracias por tu apoyo.'], toy: ['¡Un juguete nuevo para Hangmi! Gracias.', 'Un ratito de juego, luego seguimos estudiando. ¡Miau!', 'Hangmi abraza el juguete y te da las gracias.'] },
  },
  fr: {
    title: 'Prenez soin du chat Hangmi', intro: 'Hangmi aime vous tenir compagnie pendant vos leçons de coréen. Pour soutenir la personne qui crée KKorea Hangul, offrez-lui symboliquement un bol de croquettes, de la pâtée ou un jouet. Votre soutien aide à entretenir et améliorer l’application.',
    footnote: 'Entièrement facultatif. Paiement unique via Google Play, sans renouvellement ni fonctionnalité payante. L’application reste gratuite et sans publicité. Vous soutenez le développeur ; aucun aliment ou jouet réel n’est livré.',
    loading: 'Consultation des prix sur Google Play…', unavailable: 'Ces cadeaux ne sont pas encore disponibles via Google Play sur cet appareil. Continuez à apprendre avec Hangmi.', nativeOnly: 'Les cadeaux symboliques sont actuellement proposés uniquement dans l’application Android installée via Google Play.',
    retry: 'Réessayer', pending: 'Google Play attend la confirmation du paiement. Inutile de contribuer à nouveau pour le moment.', processing: 'La transaction est en cours de finalisation. L’application vérifiera à sa réouverture ; inutile de payer à nouveau.', failed: 'Ce cadeau n’a pas pu être envoyé. Vous pourrez réessayer plus tard.', history: 'Cadeaux envoyés sur cet appareil',
    items: { kibble: 'Un bol de croquettes pour Hangmi', pate: 'De la pâtée pour Hangmi', toy: 'Un jouet pour Hangmi' },
    thanks: { kibble: ['Le bol de Hangmi est plein. Merci, miaou !', 'Le ventre plein, on reprend les leçons. Merci !', 'Hangmi a gardé quelques croquettes pour la prochaine leçon.'], pate: ['La pâtée est ouverte, Hangmi accourt. Merci !', 'Quel délice ! Hangmi vous donne un petit coup de tête affectueux.', 'Hangmi a léché son bol. Merci pour votre soutien !'], toy: ['Un nouveau jouet pour Hangmi ! Merci.', 'On joue un peu, puis on reprend les leçons. Miaou !', 'Hangmi serre son jouet et vous remercie.'] },
  },
  ja: {
    title: '猫のHangmiを応援する', intro: 'Hangmiはあなたの韓国語学習に寄り添うのが大好きです。KKorea Hangulの開発者を応援したい方は、象徴的な猫ごはん、パテ、おもちゃを贈れます。応援はアプリの維持と改善に役立ちます。',
    footnote: 'すべて任意です。Google Playでの1回払いで、自動更新や機能の解放はありません。アプリは引き続き無料・広告なしです。開発者への応援であり、実際の食べ物やおもちゃは配送されません。',
    loading: 'Google Playで価格を確認中…', unavailable: 'この端末のGoogle Playでは、まだギフトを利用できません。Hangmiとの学習はいつもどおり続けられます。', nativeOnly: '象徴的なギフトは、現在Google PlayからインストールしたAndroidアプリでのみ利用できます。',
    retry: '再試行', pending: 'Google Playが支払いの確認を待っています。今はもう一度贈る必要はありません。', processing: '取引を完了しています。アプリを再度開いたときに確認するため、今は再び支払う必要はありません。', failed: '今回はギフトを送れませんでした。後でもう一度お試しください。', history: 'この端末で贈ったギフト',
    items: { kibble: 'Hangmiに猫ごはん', pate: 'Hangmiにパテ', toy: 'Hangmiにおもちゃ' },
    thanks: { kibble: ['Hangmiのお皿がいっぱい。ありがとう、にゃん！', 'お腹いっぱい。また一緒に勉強しよう。ありがとう！', '次のレッスン用に少し残しておいたよ。にゃん！'], pate: ['パテを開けるとHangmiが走ってきた。ありがとう！', 'おいしいね！Hangmiが頭をすりすり。', 'お皿まできれいに。応援ありがとう！'], toy: ['Hangmiに新しいおもちゃ！ありがとう。', '少し遊んだら、また一緒に勉強しよう。にゃん！', 'Hangmiがおもちゃを抱えてお礼を伝えます。'] },
  },
};
