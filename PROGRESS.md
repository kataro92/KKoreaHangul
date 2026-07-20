# Release-readiness work — progress tracker

> Context: A production-readiness review (2026-07-20) found 3 blocker bugs + store-listing gaps
> before Play Store release. This file tracks the fix work. **Update this file after every
> completed step** so any session (human or AI) can resume.

## Review findings (summary)

- 🔴 Daily reminder broken: `expo-notifications` SDK 55 requires `type: 'daily'` in trigger; current code throws → silently fails (src/services/notifications.ts)
- 🔴 UI language (LanguageContext) and speech settings (SpeechConfigContext) are NOT persisted — reset on every restart
- 🔴 No privacy policy; versions out of sync (app.json/package.json/build.gradle say 1.0.0/versionCode 1, but APK is named 1.1.0)
- 🟡 Due-card badge never refreshes over time (SrsContext dueCards useMemo deps miss the minute tick)
- 🟡 `npx tsc --noEmit` fails (~15 errors); `@expo/vector-icons` used but not a direct dependency; sm2.test.ts has no test runner
- 🟡 No Korean-TTS-missing hint; icon-only buttons lack accessibilityLabel
- 🟡 Only 47 reading-practice sentences; 6 vocab illust slugs have no image file; branding assets oversized (icon.png 756KB, splash-full.png 1.7MB)
- ⚪ README says 66 grammar points, actual is 99 (36 topik1 + 41 topik2 + 22 basics); .gitignore missing *.apk, build-apk.log, docs/*.pdf (copyrighted textbook PDFs — must never be committed/pushed)
- ⚪ No crash reporting (needs user's Sentry account — user action)

## Task list

| # | Task | Status |
|---|------|--------|
| 1 | Fix notification trigger (`type: 'daily'`) + show alert on failure | DONE |
| 2 | Persist locale + speech settings via new StorageKeys (auto-joins backup); reload them after backup restore | DONE |
| 3 | Privacy policy document (PRIVACY.md) + sync versions to 1.1.0 / versionCode 2 | DONE |
| 4 | Fix due-badge minute tick in SrsContext | DONE |
| 5 | Add @expo/vector-icons as direct dep; fix all tsc errors; add jest + run sm2 tests | DONE |
| 6 | Korean-TTS-missing hint in Settings; accessibilityLabel on icon-only buttons | DONE |
| 7 | Clean 6 broken illustration slugs from vocabulary.json | DONE |
| 8 | Expand reading sentences (47 → 120+) | DONE (120 total) |
| 9 | .gitignore: *.apk, build-apk.log, docs/*.pdf; README fixes (99 grammar points, backup covers language/speech now) | DONE |
| 10 | Compress branding assets (icon/splash PNGs) | DONE (~3.3 MB saved) |
| 11 | Crash reporting (Sentry) | BLOCKED — needs user to create Sentry account/DSN |
| 12 | Host privacy policy (GitHub Pages) + fill Play Data Safety form | BLOCKED — user action in Play Console |
| 13 | Rebuild release APK/AAB (`eas build -p android --profile production`) and smoke-test reminder + backup on a real Android device | TODO — next session |
| 14 | Commit all of the above (nothing committed yet) | TODO — ask user / commit on request |

## Log

- 2026-07-20: Review completed, tracker created. Starting task 1.
- 2026-07-20: Task 1 — notifications.ts uses `type: SchedulableTriggerInputTypes.DAILY`; settings.tsx alerts `reminderFailed` when scheduling fails. New i18n keys `reminderFailed`, `noKoreanVoice` added to all 7 locales.
- 2026-07-20: Task 2 — StorageKeys.locale + StorageKeys.speech added (auto-included in backup via KNOWN_KEYS). LanguageContext persists locale (saves in setLocale, loads on mount); SpeechConfigContext persists rate/pitch/volume/selectedVoiceId. Both expose reloadFromStorage(); settings.tsx restore flow calls them after import.
- 2026-07-20: Task 3 — versions synced to 1.1.0 (app.json, package.json) / versionCode 2 (android/app/build.gradle). PRIVACY.md created (EN + VI). Still needs hosting (task 12).
- 2026-07-20: Task 4 — SrsContext dueCards useMemo now depends on the minute tick.
- 2026-07-20: Task 5 — @expo/vector-icons@^15.1.1 added as direct dep. jest@29 + ts-jest + @types/jest (jest 30 clashes with hoisted jest-mock@29 from RN — keep jest at 29). `npm test` runs 9 SM-2 tests, all pass. `npm run typecheck` (tsc --noEmit) now exits 0. Fixes: StyleProp<ViewStyle> in GlassView/GlassCard, removed boolean compare in GlassTabBar badge, useTheme normalizes 'unspecified' scheme, review.tsx async cleanup wrapped.
- 2026-07-20: Task 6 — SpeechConfigContext exposes voicesLoaded; settings.tsx shows warning banner (t('noKoreanVoice')) when no Korean TTS voice. accessibilityLabel/Role added: settings gear, review speak/refresh/add-suggestion, grammar example speak, review-manage delete.
- 2026-07-20: Task 7 — vocabulary.json: removed dead illust slugs (가슴, 에이즈, 총), remapped 콧물→nose, fixed 분위기 meaning "#N/A"→"atmosphere, mood", cleaned 설사 meaning. 0 missing illustration files remain.
- 2026-07-20: Task 8 — sentences.json expanded 47 → 120 (t1-28..t1-65, t2-21..t2-55), matching the existing Vietnamese phonetic system (ŏ/ư/ê, x=ㅅ, đ=intervocalic ㄷ). New tag "sức khỏe" introduced. Validated: unique ids, no malformed entries.
- 2026-07-20: Task 9 — .gitignore now covers *.apk, *.aab, build-apk.log, docs/*.pdf (copyrighted textbooks), assets/.originals/. README: 99 grammar points, language/speech persistence noted, Privacy section → PRIVACY.md.
- 2026-07-20: Task 10 — branding PNGs recompressed with sharp (palette quantization, devDep): icon 755K→260K, splash-icon 661K→57K, splash-full 1737K→780K, android fg 646K→30K, android bg 622K→118K, favicon 209K→69K. Uncompressed originals in assets/.originals/ (gitignored). Visual QA of quantized icons on device still worth a glance.
- 2026-07-20: VERIFIED on expo-web (browser pane): app boots clean (no console/server errors); locale switch → kkh:locale saved → survives full reload (settings render in English); speech rate "Fast" → kkh:speech saved → still highlighted after reload; "No Korean voice" warning banner renders in Settings (pane has no ko voice). Native-only items NOT verifiable here: daily-reminder trigger fix (needs real device/emulator), backup share sheet/document picker. `npm test` 9/9 pass; `npm run typecheck` exit 0.
- 2026-07-20: .claude/skills/verify/SKILL.md updated (locale now persists; voice banner as test case).

## For the next session

1. Read this file first. Code state: all fixes uncommitted on branch `develop` — review with `git status` / `git diff`.
2. Task 13: rebuild the release artifact (versionCode 2 / 1.1.0) and smoke-test on a real Android device: (a) reminder toggle now schedules and fires, (b) backup export/import round-trip incl. locale+speech, (c) quantized app icon/splash look OK.
3. Task 11: user must create a Sentry (or similar) account; then wire `@sentry/react-native` (or sentry-expo) before store release.
4. Task 12: user hosts PRIVACY.md (GitHub Pages works) and fills the Play Data Safety form (answers: no data collected/shared, all local).
5. Optional backlog from the review: device-locale detection on first launch (expo-localization), Vietnamese-first store positioning, more sentences (120 → 150+), tablet layout pass.
