# Google Play store assets

Package: `com.spacekatcompany.kkoreanhangul`. English (United States), `en-US`, is the default listing; Vietnamese is the additional translation. Google Play uses the language code `vi`; the local asset files use `vi-VN` to identify the screenshot locale.

- `listing.en-US.json`: English app name and descriptions. Short description: 72 characters; full description: 1,993.
- `listing.vi-VN.json`: Vietnamese app name and descriptions. Short description: 61 characters; full description: 1,890.
- `icon-512.png`: existing Hangmi icon exported at 512 × 512, PNG RGBA, under 1 MB. Original app icon unchanged.
- `feature-graphic.png`: new Hangmi feature graphic, 1024 × 500, opaque PNG. Generated with imagegen using `assets/mascot/hangmi-read.webp` as a character reference. The graphic uses the app's pastel palette and the text “KKorea Hangul” / “Learn • Read • Review”.
- `screenshots/en-US/`: six Android screenshots with English interface labels.
- `screenshots/vi-VN/`: six Android screenshots with Vietnamese interface labels.

Screenshots are direct captures from Android 14 on a separate `KKoreaStore34` emulator, 1080 × 1920, 9:16, opaque PNG, under 8 MB each. The installed app was generated from the existing Internal AAB `com.spacekatcompany.kkoreanhangul-1.1.2-4.aab`; it was signed locally with the development key solely for emulator installation. No app UI or learning content was generated, repainted, or substituted in the screenshots. PNG alpha was removed without changing visible content. README iOS screenshots remain unchanged.

Order: alphabet, reading practice, grammar example, vocabulary card, flashcard review, language settings. A word was added to review through the app on the empty emulator to demonstrate the existing flashcard feature. Interface localization does not translate all learning content: Vietnamese meanings and explanations remain visible in the English screenshots and are stated in the descriptions.

No video, tablet, desktop, or XR assets were added; those optional device-specific assets require captures from their corresponding devices.

Both languages were saved in Google Play Console on 2026-10-05, with the existing icon, new feature graphic, descriptions, and six ordered phone screenshots per language. The store listing is ready to send for review; saving it does not publish the listing. Internal testing remains separate from the listing review and the remaining app setup requirements. No Closed testing or Production release was started.

Publishing overview confirms that both languages contain all required listing information. **Send app for review** is disabled until the required app dashboard setup steps are complete. Therefore, these assets are saved on Console but are not yet approved or visible as a reviewed public store listing. Local evidence: `release/store-listing-completed.png` and `release/store-listing-review-pending.png` (ignored build artifacts).

Sources: [Google preview asset requirements](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en), app README, and the actual Internal app UI.

On 2026-10-07, both full descriptions were updated and saved to explain optional, one-time symbolic Hangmi support purchases. All learning features remain free with no ads. Data safety includes optional Purchase history and the revised public policy is deployed. Assets and declarations are still saved pending review; no Closed or Production track was started. The old disabled-review-button snapshot above is historical, before the initial setup was completed.
