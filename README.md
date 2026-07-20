# KKorea Hangul

A Korean (Hangul) learning app for Vietnamese speakers, built with **React Native** and **Expo**. The app UI is available in 7 languages and features an Apple‑style **Liquid Glass** interface (frosted‑glass surfaces over a pastel gradient) with automatic **light/dark** mode.

## Screenshots

Captured on the **iOS Simulator** (native React Native UI). Each feature shows **three states** in **light** and **dark** appearance (follows the system theme).

### Alphabet

Hangul letters with romanization and “group by sound” for batchim.

<p align="center"><strong>Light</strong></p>
<p align="center">
  <img src="screenshots/light/alphabet/1.png" alt="Alphabet (light) — basic consonants" width="32%" />
  <img src="screenshots/light/alphabet/2.png" alt="Alphabet (light) — basic vowels" width="32%" />
  <img src="screenshots/light/alphabet/3.png" alt="Alphabet (light) — batchim by sound" width="32%" />
</p>
<p align="center"><strong>Dark</strong></p>
<p align="center">
  <img src="screenshots/dark/alphabet/1.png" alt="Alphabet (dark) — basic consonants" width="32%" />
  <img src="screenshots/dark/alphabet/2.png" alt="Alphabet (dark) — basic vowels" width="32%" />
  <img src="screenshots/dark/alphabet/3.png" alt="Alphabet (dark) — batchim by sound" width="32%" />
</p>

### Reading

Syllable breakdown + reading‑practice mode (countdown → Vietnamese phonetics + TTS).

<p align="center"><strong>Light</strong></p>
<p align="center">
  <img src="screenshots/light/reading/1.png" alt="Reading (light) — syllable breakdown" width="32%" />
  <img src="screenshots/light/reading/2.png" alt="Reading (light) — decomposition result" width="32%" />
  <img src="screenshots/light/reading/3.png" alt="Reading (light) — practice with answer" width="32%" />
</p>
<p align="center"><strong>Dark</strong></p>
<p align="center">
  <img src="screenshots/dark/reading/1.png" alt="Reading (dark) — syllable breakdown" width="32%" />
  <img src="screenshots/dark/reading/2.png" alt="Reading (dark) — decomposition result" width="32%" />
  <img src="screenshots/dark/reading/3.png" alt="Reading (dark) — practice with answer" width="32%" />
</p>

### Grammar

TOPIK I/II grammar points with structure, Vietnamese explanation, and examples.

<p align="center"><strong>Light</strong></p>
<p align="center">
  <img src="screenshots/light/grammar/1.png" alt="Grammar (light) — TOPIK I list" width="32%" />
  <img src="screenshots/light/grammar/2.png" alt="Grammar (light) — TOPIK II list" width="32%" />
  <img src="screenshots/light/grammar/3.png" alt="Grammar (light) — detail screen" width="32%" />
</p>
<p align="center"><strong>Dark</strong></p>
<p align="center">
  <img src="screenshots/dark/grammar/1.png" alt="Grammar (dark) — TOPIK I list" width="32%" />
  <img src="screenshots/dark/grammar/2.png" alt="Grammar (dark) — TOPIK II list" width="32%" />
  <img src="screenshots/dark/grammar/3.png" alt="Grammar (dark) — detail screen" width="32%" />
</p>

### Vocabulary

TOPIK I/II word lists with Vietnamese meanings, TTS, syllable breakdown, add‑to‑review.

<p align="center"><strong>Light</strong></p>
<p align="center">
  <img src="screenshots/light/vocabulary/1.png" alt="Vocabulary (light) — word card" width="32%" />
  <img src="screenshots/light/vocabulary/2.png" alt="Vocabulary (light) — syllable breakdown" width="32%" />
  <img src="screenshots/light/vocabulary/3.png" alt="Vocabulary (light) — TOPIK II level" width="32%" />
</p>
<p align="center"><strong>Dark</strong></p>
<p align="center">
  <img src="screenshots/dark/vocabulary/1.png" alt="Vocabulary (dark) — word card" width="32%" />
  <img src="screenshots/dark/vocabulary/2.png" alt="Vocabulary (dark) — syllable breakdown" width="32%" />
  <img src="screenshots/dark/vocabulary/3.png" alt="Vocabulary (dark) — TOPIK II level" width="32%" />
</p>

### Review

Spaced‑repetition flashcards (SM‑2), stats, grade buttons, and word suggestions.

<p align="center"><strong>Light</strong></p>
<p align="center">
  <img src="screenshots/light/review/1.png" alt="Review (light) — suggestions" width="32%" />
  <img src="screenshots/light/review/2.png" alt="Review (light) — flashcard front" width="32%" />
  <img src="screenshots/light/review/3.png" alt="Review (light) — flashcard graded" width="32%" />
</p>
<p align="center"><strong>Dark</strong></p>
<p align="center">
  <img src="screenshots/dark/review/1.png" alt="Review (dark) — suggestions" width="32%" />
  <img src="screenshots/dark/review/2.png" alt="Review (dark) — flashcard front" width="32%" />
  <img src="screenshots/dark/review/3.png" alt="Review (dark) — flashcard graded" width="32%" />
</p>

### Settings

Speech, study reminder, language (7 locales with flags), About.

<p align="center"><strong>Light</strong></p>
<p align="center">
  <img src="screenshots/light/settings/1.png" alt="Settings (light) — speech" width="32%" />
  <img src="screenshots/light/settings/2.png" alt="Settings (light) — language" width="32%" />
  <img src="screenshots/light/settings/3.png" alt="Settings (light) — about" width="32%" />
</p>
<p align="center"><strong>Dark</strong></p>
<p align="center">
  <img src="screenshots/dark/settings/1.png" alt="Settings (dark) — speech" width="32%" />
  <img src="screenshots/dark/settings/2.png" alt="Settings (dark) — language" width="32%" />
  <img src="screenshots/dark/settings/3.png" alt="Settings (dark) — about" width="32%" />
</p>

## Features

- **Alphabet** — Browse the full Hangul alphabet by group: basic consonants, double consonants, basic vowels, compound vowels, and batchim (final consonants). Each character shows romanization. Optional “group by sound” view for batchim.
- **Reading** — Two modes via a toggle at the top:
  - **Syllable breakdown** — Type Korean text and see each syllable decomposed into initial consonant, vowel, and final consonant with pronunciation. **Speak** button for text-to-speech (TTS).
  - **Reading practice** — A Korean sentence is shown; read it aloud during a configurable countdown (15/30/45/60s). When the timer ends (or you tap **Show answer**), the Vietnamese phonetics, meaning, and a **Listen** model reading appear so you can self-assess. Rate yourself (Needs work / Okay / Good); a “Needs work” sentence is automatically suggested to your review deck.
- **Grammar** — 99 TOPIK I/II grammar points (22 basics + 36 beginner + 41 intermediate) with structure, Vietnamese explanation, when-to-use notes, and example sentences. Search and filter by level; each example has a TTS button.
- **Vocabulary** — Full TOPIK I + II word lists (1,671 + 2,662 = 4,333 words) with random word display, TTS, and syllable breakdown. All entries have Vietnamese meanings (the original English is kept as a fallback). **Add to review** button pushes a word into the spaced-repetition deck.
- **Review (spaced repetition)** — Flashcard review powered by the **SM-2** algorithm (like Anki/Mochi). Flip cards, grade with Again/Hard/Good/Easy, and a tab badge shows how many cards are due. Includes stats (total/due/learned), rule-based **word suggestions**, and a card manager to create custom cards or delete existing ones. Cards persist on device via AsyncStorage. Vocabulary/sentence cards **auto‑sync their Vietnamese meaning** from the source data on launch (older cards get updated), with a manual **Refresh meanings** button in the card manager.
- **Settings** (gear icon in header) — Single screen with:
  - **Speech settings** — Speed, pitch, volume, and Korean voice selection. Applies to Reading and Vocabulary.
  - **Study reminder** — Optional daily notification (8:00 PM) to review due cards (requires `expo-notifications`).
  - **Backup & Restore** — Export all flashcards, progress, and settings to a JSON file (save to Google Drive, iCloud/Files, email, etc.). Restore later by choosing the file again—no server needed.
  - **Language** — App UI in 7 languages (native names + flags): English, Tiếng Việt, 中文, हिंदी, Español, Français, 日本語. The chosen language, and all speech settings, persist across restarts and are included in backups.
  - **About** — App description and author (Phạm Huy Đức). Back button label is localized (e.g. “Màn hình chính” / “Main”).

- **Design** — Apple‑style **Liquid Glass** throughout: a pastel gradient backdrop with frosted‑glass cards, custom **`GlassTabBar`**, and header. Follows the system **light/dark** appearance automatically. All action buttons share a single `GlassButton` component (primary / outline / glass variants) for a consistent look. App icon, splash (`splash-full.png`), and favicon use matching lavender branding.

All on-screen labels (tabs, buttons, hints, level names, part-of-speech, decomposition labels) are localized.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/go) on your device, or iOS Simulator / Android Emulator

## Installation

```bash
git clone https://github.com/kataro92/KKoreaHangul.git
cd KKoreaHangul
npm install
```

The Liquid Glass UI uses `expo-blur` and `expo-linear-gradient`, and the daily study reminder uses `expo-notifications`. They're listed in `package.json`; to pin SDK‑compatible versions run:

```bash
npx expo install expo-blur expo-linear-gradient expo-notifications
```

The app degrades gracefully if any are missing — glass surfaces fall back to solid translucent panels, the gradient falls back to a solid backdrop, and the reminder section is simply hidden.

## Usage

### Quick start

Start the development server:

```bash
npm start
```

Then:

- Scan the QR code with **Expo Go** (Android/iOS), or
- Press **i** for iOS Simulator, **a** for Android emulator, or **w** for web.

### Run on iOS

**iOS Simulator (requires Xcode):**

```bash
npm run ios
```

Or with a custom simulator:

```bash
npx expo run:ios --simulator="iPhone 17 Pro"
```

**Physical iOS device:**

1. Build a development client:
   ```bash
   npx eas build --platform ios --profile preview
   ```
2. Scan the QR code with Camera app or use Expo Go to run the development build.

### Scripts

| Command           | Description           |
|-------------------|-----------------------|
| `npm start`       | Start Expo dev server |
| `npm run ios`     | Run on iOS Simulator  |
| `npm run android` | Run on Android        |
| `npm run web`     | Run in the browser    |

### Refresh README screenshots

**Native (recommended)** — real iOS blur/glass via Maestro; captures **light and dark** (36 PNGs):

```bash
# First time (builds Release on simulator, then captures):
npm run screenshots:native:build

# Later runs (app already installed):
npm run screenshots:native
```

Optional: `SIMULATOR="iPhone 17 Pro" npm run screenshots:native`

Requires [Maestro](https://maestro.mobile.dev/) (auto-installed on first run) and Xcode Simulator.

**Web (legacy)** — Playwright at iPhone XR dimensions (light appearance only):

```bash
npx expo start --web --port 8083
APP_URL=http://localhost:8083 node scripts/capture-screenshots.mjs
```

## Project structure

```
├── app/
│   ├── _layout.tsx          # Root layout: Language / SpeechConfig / Srs providers
│   ├── settings.tsx         # Settings (speech, reminder, language, about)
│   ├── review-manage.tsx    # Manage SRS cards + create custom cards
│   ├── grammar/[id].tsx     # Grammar detail screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator (+ Review badge) + gear → Settings
│       ├── index.tsx        # Alphabet screen
│       ├── reading.tsx      # Reading screen (syllable breakdown + practice mode)
│       ├── grammar.tsx      # Grammar list (search + level filter)
│       ├── vocabulary.tsx   # Vocabulary screen (+ add to review)
│       └── review.tsx       # Spaced-repetition review + suggestions
├── src/
│   ├── components/         # CharacterCard, CategorySection, DecomposedResult,
│   │                       #   CountdownRing, ReadingPractice
│   │   └── glass/          # Liquid Glass: ScreenBackground, GlassScreen,
│   │                       #   GlassView, GlassCard, GlassButton, GlassTabBar, BlurFill
│   ├── constants/          # colors, theme.ts (Liquid Glass light/dark tokens)
│   ├── contexts/           # LanguageContext, SpeechConfigContext, SrsContext
│   ├── data/               # hangul.ts, vocabulary.json, grammar.json/.ts,
│   │                       #   sentences.json/.ts
│   ├── srs/                # sm2.ts (+ test), types.ts, suggest.ts, refresh.ts
│   ├── services/           # notifications.ts (daily reminder)
│   ├── storage/            # store.ts (AsyncStorage wrapper)
│   └── utils/              # decompose.ts (Hangul syllable decomposition)
├── assets/                  # icon.png, splash-full.png, favicon, Android adaptive icon
├── screenshots/             # README screenshots (screenshots/{light,dark}/<feature>/1-3.png)
├── .maestro/                # Maestro flows for native screenshots
└── scripts/                 # capture-screenshots*.mjs/sh, parse-topik-vocab.js
```

## Privacy

The app is fully offline and collects no personal data — see [PRIVACY.md](PRIVACY.md).

## Author

**Phạm Huy Đức**

## License

[MIT](LICENSE) — see [LICENSE](LICENSE) for details.
