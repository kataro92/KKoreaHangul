# Google Play app setup

Live Console checked on 7 October 2026. App: KKorea Hangul, package `com.spacekatcompany.kkoreanhangul`, developer `6660012349184224355`, app ID `4975560487486352974`.

All **11 setup tasks are completed**: after Content ratings was saved, Dashboard stopped showing the outstanding “Finish setting up your app” section. App content → Need attention now says **“You're all caught up”**, and Actioned lists ten completed policy declarations, including the additional Advertising ID declaration. Completing setup is separate from Google review or release approval.

## Saved declarations

- Privacy policy: https://kataro92.github.io/spacekat-privacy-policies/kkorea-hangul/
- App access/sign-in: no restricted access, no login, no account creation.
- Ads: none.
- Advertising ID: not used. The released `1.1.4 (6)` merged manifest has no `com.google.android.gms.permission.AD_ID`, and the app has no ads/Advertising ID integration. This additional declaration was saved on 6 October.
- Content rating: IARC **Completed**, submitted 7 October 2026 at 12:09 PM (Console display); regional ratings below, with **In-App Purchases**.
- Target audience: 13–15, 16–17, 18 and over. This is the intended audience, not an IARC rating.
- Government apps: no.
- Financial features: none. Optional one-time support is purchased through Google Play; this is not a wallet, money-transfer, lending, investment or financial-advice service. See [Google financial feature categories](https://support.google.com/googleplay/android-developer/answer/13849271?hl=en).
- Health features: none.
- Category: App / Education.
- Tags: Education, Grammar, Language education, Pronunciation, Test preparation.
- Public support email: `spacekatcompany@gmail.com`, same business contact as Kalendar. Optional phone and website left empty.
- Store listing: default English (United States) and Vietnamese, descriptions, icon, feature graphic, six phone screenshots per language already provided.

Privacy, audience and app-content declarations are saved in Publishing overview, ready for review. The support-email change is published immediately. Closed testing and Production have not been started; Internal `1.1.4 (6)` is the active release, available to internal testers and not reviewed.

## Data safety basis

The app's learning records, settings, flashcards and SRS progress stay in local app storage. No developer backend, advertisements, app usage analytics service, remote push-token registration or app account is configured. OS backup/device transfer, user-directed JSON export/import, system TTS and optional support email are described separately in the policy. Firebase components included by expo-notifications have no Google app ID/API configuration and no remote registration calls.

**Do not declare blanket “no data collected” while the current Billing library is included.** The exact cached official Billing `8.3.0` AAR was inspected with `javap`:

- `BillingClientImpl` creates `zzdl`, which creates `zzdn`.
- `zzdn` initializes Google DataTransport, obtains CCT transport `PLAY_BILLING_LIBRARY`, and sends diagnostic protobuf events.
- The Billing client records SDK/package/Android versions, model/manufacturer/build and memory metadata, connection/API results and errors, timing, and a random `Random.nextLong()` identifier per Billing-client instance.
- CCT adds device/build, network, locale/country, time-zone, SIM operator and app-version metadata; its default destination uses HTTPS. Events can queue before upload, so they are not ephemeral.
- The app calls the library automatically if no valid language is saved; no independent diagnostics opt-out is exposed during that request. Later launches with a valid saved language skip the request.

Saved Data safety: **Diagnostics** and **Device or other IDs**, collected and shared with Google, required, not ephemeral; purposes **App functionality** and **Analytics** (SDK troubleshooting/reliability, not learning-behavior analytics). Encrypted in transit: yes. No app accounts or external-account login. No developer-controlled deletion request for Google's SDK data; policy explains local deletion and separate Google retention. No independent security or UPI certification claimed.

Audit text is in ignored `release/audit-billing/`. Reassess these declarations whenever SDKs, billing, backup, TTS, notifications or networking change. [Google Data safety definitions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en), [Android data-use guidance](https://developer.android.com/privacy-and-security/declare-data-use), [Play country query](https://developer.android.com/google/play/billing/integrate#query_billing_config).

## Completed content rating

Category **All Other App Types**, email `spacekatcompany@gmail.com`. The owner personally accepted the initial IARC terms on 6 October, then explicitly confirmed accepting them again for the Hangmi update on 7 October. The new questionnaire and final Summary were saved on 7 October; Console confirms IARC status **Completed**, submitted at 12:09 PM. The certificate ID currently displays `-`.

The answers account for bundled vocabulary and illustrations:

- Human violence is referred to in vocabulary such as murder/suicide, without depicting injury or gore. `murder.webp` shows a detective investigating a scene; `suicide.webp` shows people offering support. The style is childlike, with no realistic suffering, historical war setting, or sinister violence.
- Non-human fantasy violence is referred to and rarely depicted from a distant perspective (`to-kill.webp`, pillow-character fight). Reactions are unrealistic and there is no associated blood/gore. A separate cute blood-droplet illustration is small and infrequent.
- Rare scary elements include ghost/hell/scary illustrations, without horrifying images.
- The lottery vocabulary illustration contains gambling themes; gambling is not a focus and no gambling games are playable.
- Rare minor potentially offensive language includes the vocabulary meaning “idiot, stupid”; no discriminatory language or sexual expletives were identified.
- Illegal/recreational drugs are referenced by `마약` / “ma túy”; the illustration itself is pharmacy supplies, with no illegal-drug use or instructions. Medical drugs are referenced rarely. Alcohol and tobacco are referenced and depicted in use rarely (drinking-party illustrations, a lit cigarette), with no first-person use, encouragement, or instructions.
- Sexual content, crude humor, native user-to-user sharing, featured online content, age-restricted sales, precise-location sharing, cash/crypto/NFT rewards and browser/search functionality: no. Export through the system share sheet is not native user interaction.
- Digital purchases: **yes**, for optional one-time symbolic Hangmi gifts through Google Play Billing. Random items/loot boxes/chance-based purchases: **no**. The generated ratings include **In-App Purchases** as an interactive element in every listed region.
- Primarily a news or **educational product**: yes, because this is a Korean-language learning app. This is reflected in the generated ratings.

| Region | Rating |
| --- | --- |
| Brazil (ClassInd) | All ages |
| North America (ESRB) | Everyone 10+ |
| Europe (PEGI) | PEGI 3 |
| Germany (USK) | Ages 6+; Contents for Different Age Groups |
| Rest of world (IARC Generic) | Rated for 3+ |
| Russia / South Korea (Google Play) | Rated for 3+ |

These are the ratings shown by Console, not a claim of Google review approval. Reassess the questionnaire when educational content, images or app features change. The intended audience remains 13 and over.

## Privacy source and released binary

`src/legal/privacy-policy.json` is the bilingual source used by the new offline `/privacy` screen and the public webpage. Settings → About links to the screen; other UI languages default to the English policy with English/Vietnamese switches. Run `node scripts/export-privacy.mjs` to regenerate `PRIVACY.md` and `store-assets/privacy.html`. Publish the HTML to `kkorea-hangul/index.html` in `D:\Projects\spacekat-privacy-policies` (GitHub Pages).

Public policy commits: `0d80606` (initial), `772113c` (Billing diagnostics), `30254ad` (optional Hangmi support). Pages deployment succeeded and live EN/VI support text was verified on 7 October.

The current Internal binary **1.1.4 (6) includes the in-app policy screen** and optional Hangmi support. Release ID `3`, `1.1.4 (6) - Hangmi support - Internal`, was published on 7 October at 12:09 PM (Console display). Console confirms **Active — Available to internal testers — Not reviewed**. No Closed/Production release or broader review was started.

Update on 7 October: three Hangmi support products are Active with one Buy option each; EN/VI store descriptions now explain optional support and no longer claim no in-app purchases. Data safety now also includes **Purchase history**, collected/shared, optional, non-ephemeral, purpose App functionality; other types and security answers are unchanged. Public privacy policy is deployed. These Console declarations/listing changes are saved, not reviewed. IARC was updated to digital goods Yes, random purchases No; age ratings are unchanged. License testing includes the KKorea tester list. AAB `1.1.4 (6)` is released on Internal; device checkout tests remain outstanding. See [Hangmi support](HANGMI_SUPPORT.md).

Current proof: ignored `release/hangmi-internal-1.1.4-active.png`, `release/hangmi-iarc-completed.png`, `release/hangmi-products-active.png`, `release/hangmi-license-testing-saved.png`. App content was rechecked after the new IARC submission and says “You're all caught up.” Earlier setup/consent/draft snapshots are historical.
