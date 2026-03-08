# KKorea Hangul

A Korean (Hangul) learning app for Vietnamese speakers, built with **React Native** and **Expo**.

## Features

- **Alphabet** — Browse the full Hangul alphabet by group: basic consonants, double consonants, basic vowels, compound vowels, and batchim (final consonants). Each character shows Vietnamese romanization.
- **Reading** — Type Korean text and see each syllable decomposed into initial, medial, and final components with pronunciation.
- **Vocabulary** — Study TOPIK I and II vocabulary with random word display, pronunciation (TTS), and syllable breakdown.
- **Speech settings** — Shared config for TTS: speed, pitch, volume, and voice selection (when available). Settings apply to both Reading and Vocabulary screens.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/go) on your device, or iOS Simulator / Android Emulator

## Installation

```bash
git clone https://github.com/kataro92/KKoreaHangul.git
cd KKoreaHangul
npm install
```

## Usage

Start the development server:

```bash
npm start
```

Then:

- Scan the QR code with **Expo Go** (Android/iOS), or
- Press **i** for iOS Simulator, **a** for Android emulator, or **w** for web.

### Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm start`    | Start Expo dev server      |
| `npm run ios`  | Run on iOS                 |
| `npm run android` | Run on Android          |
| `npm run web`  | Run in the browser         |

## Project structure

```
├── app/
│   ├── _layout.tsx          # Root layout, SpeechConfigProvider
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator (Alphabet, Reading, Vocabulary)
│       ├── index.tsx        # Alphabet screen
│       ├── reading.tsx      # Reading + TTS config UI
│       └── vocabulary.tsx   # Vocabulary screen
├── src/
│   ├── components/         # CharacterCard, CategorySection, DecomposedResult
│   ├── constants/          # colors
│   ├── contexts/           # SpeechConfigContext (shared TTS settings)
│   ├── data/               # hangul.ts, vocabulary.json
│   └── utils/              # decompose.ts (Hangul syllable decomposition)
└── scripts/                # parse-topik-vocab.js (vocabulary from PDF)
```

## License

[MIT](LICENSE) — see [LICENSE](LICENSE) for details.
