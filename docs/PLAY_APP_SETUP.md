# Google Play app setup

Live Console checked on 6 October 2026. App: KKorea Hangul, package `com.spacekatcompany.kkoreanhangul`, developer `6660012349184224355`, app ID `4975560487486352974`.

All **11 setup tasks are completed**: after Content ratings was saved, Dashboard stopped showing the outstanding “Finish setting up your app” section. App content → Need attention now says **“You're all caught up”**, and Actioned lists ten completed policy declarations, including the additional Advertising ID declaration. Completing setup is separate from Google review or release approval.

## Saved declarations

- Privacy policy: https://kataro92.github.io/spacekat-privacy-policies/kkorea-hangul/
- App access/sign-in: no restricted access, no login, no account creation.
- Ads: none.
- Advertising ID: not used. The released `1.1.3 (5)` merged manifest has no `com.google.android.gms.permission.AD_ID`, and the app has no ads/Advertising ID integration. This additional declaration was saved on 6 October.
- Content rating: IARC **Completed**, submitted 6 October 2026; regional ratings below.
- Target audience: 13–15, 16–17, 18 and over. This is the intended audience, not an IARC rating.
- Government apps: no.
- Financial features: none; no purchases/subscriptions despite the Billing SDK used to obtain Play country.
- Health features: none.
- Category: App / Education.
- Tags: Education, Grammar, Language education, Pronunciation, Test preparation.
- Public support email: `spacekatcompany@gmail.com`, same business contact as Kalendar. Optional phone and website left empty.
- Store listing: default English (United States) and Vietnamese, descriptions, icon, feature graphic, six phone screenshots per language already provided.

Privacy, audience and app-content declarations are saved in Publishing overview, ready for review. The support-email change is published immediately. Closed testing and Production have not been started; Internal `1.1.3 (5)` remains the active release.

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

Category **All Other App Types**, email `spacekatcompany@gmail.com`. The owner personally accepted the IARC terms and advanced to the questionnaire. The questionnaire and its final Summary were saved on 6 October; Console confirms IARC status **Completed**. The certificate ID currently displays `-`.

The answers account for bundled vocabulary and illustrations:

- Human violence is referred to in vocabulary such as murder/suicide, without depicting injury or gore. `murder.webp` shows a detective investigating a scene; `suicide.webp` shows people offering support. The style is childlike, with no realistic suffering, historical war setting, or sinister violence.
- Non-human fantasy violence is referred to and rarely depicted from a distant perspective (`to-kill.webp`, pillow-character fight). Reactions are unrealistic and there is no associated blood/gore. A separate cute blood-droplet illustration is small and infrequent.
- Rare scary elements include ghost/hell/scary illustrations, without horrifying images.
- The lottery vocabulary illustration contains gambling themes; gambling is not a focus and no gambling games are playable.
- Rare minor potentially offensive language includes the vocabulary meaning “idiot, stupid”; no discriminatory language or sexual expletives were identified.
- Illegal/recreational drugs are referenced by `마약` / “ma túy”; the illustration itself is pharmacy supplies, with no illegal-drug use or instructions. Medical drugs are referenced rarely. Alcohol and tobacco are referenced and depicted in use rarely (drinking-party illustrations, a lit cigarette), with no first-person use, encouragement, or instructions.
- Sexual content, crude humor, native user-to-user sharing, featured online content, age-restricted sales, precise-location sharing, digital purchases, cash/crypto/NFT rewards and browser/search functionality: no. Export through the system share sheet is not native user interaction.
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

## Privacy source and next binary

`src/legal/privacy-policy.json` is the bilingual source used by the new offline `/privacy` screen and the public webpage. Settings → About links to the screen; other UI languages default to the English policy with English/Vietnamese switches. Run `node scripts/export-privacy.mjs` to regenerate `PRIVACY.md` and `store-assets/privacy.html`. Publish the HTML to `kkorea-hangul/index.html` in `D:\Projects\spacekat-privacy-policies` (GitHub Pages).

Public policy commits: `0d80606` (initial policy) and `772113c` (Billing diagnostics); Pages deployment succeeded and live text was verified. TypeScript and all 61 existing tests pass after these source changes.

The current Play binary **1.1.3 (5) predates the in-app policy screen**. Before submitting a binary for a broader review/release, build and verify a higher version code containing the screen. This setup task has not uploaded another binary or sent changes for review.

Current proof: ignored `release/play-app-content-complete.png` (nothing requiring attention) and `release/play-content-ratings-complete.png` (IARC Completed). Earlier `release/iarc-consent-pending.png` and `release/play-app-setup-10-of-11.png` are historical, superseded snapshots.
