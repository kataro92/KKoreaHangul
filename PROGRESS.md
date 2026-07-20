# Release status — KKorea Hangul 1.1.0

> Living status doc so any session (human or AI) can resume. Update after each work step.

## Current state (2026-07-20)

Production-readiness review completed and all code fixes shipped on `develop`
(commits `6d85e1f`..`81fc795`, not yet pushed). `npm run typecheck` passes,
`npm test` 9/9, verified on expo-web.

**Shipped in 1.1.0 prep:**

- Daily reminder fixed (SDK 55 requires `type: 'daily'` trigger) + localized failure alert
- Language & speech settings persist (`kkh:locale` / `kkh:speech`, auto-included in backup); backup restore reloads them
- Review due-badge refreshes each minute
- All TypeScript errors fixed; `@expo/vector-icons` direct dep; jest@29 wired (`npm test`)
- "No Korean voice" warning in Settings; accessibility labels on icon-only buttons
- Reading sentences 47 → 120; vocabulary data cleaned (dead illust slugs, `#N/A` meaning)
- PRIVACY.md (EN+VI); versions synced to 1.1.0 / versionCode 2; branding PNGs compressed (~3.3 MB); `.gitignore` blocks APKs, logs, `docs/*.pdf`

## Remaining (user actions)

| Task | Status |
|------|--------|
| Host PRIVACY.md publicly (GitHub Pages) + fill Play Data Safety form ("no data collected/shared") | TODO |
| Build release (`eas build -p android --profile production`) and smoke-test on a real device: reminder fires, backup round-trip, quantized icons look OK | TODO |
| Push `develop` | TODO |

## Key decisions

- **100% offline, zero telemetry** — no server, no cloud SDK, and **no crash reporting** (declined 2026-07-20); use Play Console vitals for crash signals. Do not re-suggest.
- Backup = JSON export/import via share sheet; any new `StorageKeys` entry joins backups automatically.
- jest pinned to 29 (RN hoists `jest-mock@29`, clashes with jest 30).
- Uncompressed branding originals live in `assets/.originals/` (gitignored).

## Backlog (optional, post-release)

- Device-locale detection on first launch (expo-localization)
- More reading sentences (120 → 150+)
- Vietnamese-first store positioning/listing copy
- Tablet layout pass
