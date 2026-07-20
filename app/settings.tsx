import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassButton } from '../src/components/glass/GlassButton';
import { GlassCard } from '../src/components/glass/GlassCard';
import { GlassScreen } from '../src/components/glass/GlassScreen';
import { useTheme } from '../src/constants/theme';
import { useLanguage, LOCALE_NATIVE_LABELS, LOCALE_FLAGS } from '../src/contexts/LanguageContext';
import type { Locale } from '../src/contexts/LanguageContext';
import { useSpeechConfig, RATE_OPTIONS, PITCH_OPTIONS, VOLUME_OPTIONS } from '../src/contexts/SpeechConfigContext';
import { useSrs } from '../src/contexts/SrsContext';
import { useGuidance } from '../src/contexts/GuidanceContext';
import { exportBackup, importBackup } from '../src/storage/backup';
import { loadJSON, saveJSON, StorageKeys } from '../src/storage/store';
import {
  scheduleDailyReminder,
  cancelReminder,
  isNotificationsAvailable,
  REMINDER_HOUR,
  REMINDER_MINUTE,
} from '../src/services/notifications';

type SettingsData = { reminderEnabled?: boolean };

export default function SettingsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { replayIntro, resetHints } = useGuidance();
  const {
    t,
    locale,
    setLocale,
    getRateLabel,
    getPitchLabel,
    getVolumeLabel,
    reloadFromStorage: reloadLanguage,
  } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const {
    rate,
    pitch,
    volume,
    voices,
    selectedVoiceId,
    setRate,
    setPitch,
    setVolume,
    setSelectedVoiceId,
    voicesLoaded,
    reloadFromStorage: reloadSpeech,
  } = useSpeechConfig();

  const { reloadFromStorage } = useSrs();

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [backupBusy, setBackupBusy] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: t('settingsTitle'), headerBackTitle: t('backToMain') });
  }, [navigation, t]);

  useEffect(() => {
    loadJSON<SettingsData>(StorageKeys.settings, {}).then((s) => setReminderEnabled(!!s.reminderEnabled));
  }, []);

  const toggleReminder = async (value: boolean) => {
    setReminderEnabled(value);
    if (value) {
      const ok = await scheduleDailyReminder(t('reminderTitle'), t('reminderBody'));
      if (!ok) {
        setReminderEnabled(false);
        await saveJSON(StorageKeys.settings, { reminderEnabled: false });
        Alert.alert(t('reminderSectionTitle'), t('reminderFailed'));
        return;
      }
    } else {
      await cancelReminder();
    }
    await saveJSON(StorageKeys.settings, { reminderEnabled: value });
  };

  const handleBackupExport = async () => {
    setBackupBusy(true);
    const result = await exportBackup();
    setBackupBusy(false);
    if (result === 'empty') {
      Alert.alert(t('backupSectionTitle'), t('backupEmpty'));
    } else if (result === 'unavailable' || result === 'error') {
      Alert.alert(t('backupSectionTitle'), t('backupError'));
    }
  };

  const handleBackupImport = () => {
    Alert.alert(t('backupConfirmTitle'), t('backupConfirmBody'), [
      { text: t('srsCancel'), style: 'cancel' },
      {
        text: t('backupImport'),
        style: 'destructive',
        onPress: async () => {
          setBackupBusy(true);
          const result = await importBackup();
          if (result.status === 'restored') {
            await reloadFromStorage();
            await reloadLanguage();
            await reloadSpeech();
            // Áp lại trạng thái nhắc ôn theo dữ liệu vừa khôi phục.
            const s = await loadJSON<SettingsData>(StorageKeys.settings, {});
            if (s.reminderEnabled) {
              const ok = await scheduleDailyReminder(t('reminderTitle'), t('reminderBody'));
              setReminderEnabled(ok);
              if (!ok) await saveJSON(StorageKeys.settings, { ...s, reminderEnabled: false });
            } else {
              setReminderEnabled(false);
              await cancelReminder();
            }
            setBackupBusy(false);
            Alert.alert(t('backupDoneTitle'), t('backupDoneBody'));
          } else {
            setBackupBusy(false);
            if (result.status === 'invalid') {
              Alert.alert(t('backupSectionTitle'), t('backupInvalidFile'));
            } else if (result.status === 'error') {
              Alert.alert(t('backupSectionTitle'), t('backupError'));
            }
            // Người dùng tự huỷ chọn file: không cần thông báo.
          }
        },
      },
    ]);
  };

  const reminderTimeLabel = `${String(REMINDER_HOUR).padStart(2, '0')}:${String(REMINDER_MINUTE).padStart(2, '0')}`;
  const langOptions: Locale[] = ['en', 'vi', 'zh', 'hi', 'es', 'fr', 'ja'];

  const optionBtn = (key: string, active: boolean, label: string, onPress: () => void) => (
    <Pressable
      key={key}
      style={[styles.optionBtn, { borderColor: active ? c.primary : c.hairline, backgroundColor: active ? c.primary + '22' : 'transparent' }]}
      onPress={onPress}
    >
      <Text style={[styles.optionBtnText, { color: active ? c.primary : c.textSecondary }]}>{label}</Text>
    </Pressable>
  );

  return (
    <GlassScreen>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('speechTitle')}</Text>
      <GlassCard style={styles.card}>
        {voicesLoaded && voices.length === 0 && (
          <View style={[styles.voiceWarn, { backgroundColor: c.warning + '22' }]}>
            <Ionicons name="warning-outline" size={18} color={c.warning} style={styles.voiceWarnIcon} />
            <Text style={[styles.voiceWarnText, { color: c.text }]}>{t('noKoreanVoice')}</Text>
          </View>
        )}
        <Text style={[styles.label, { color: c.textSecondary }]}>{t('rateLabel')}</Text>
        <View style={styles.optionRow}>
          {RATE_OPTIONS.map((opt) => optionBtn(String(opt.value), rate === opt.value, getRateLabel(opt.value), () => setRate(opt.value)))}
        </View>
        <Text style={[styles.label, { color: c.textSecondary }]}>{t('pitchLabel')}</Text>
        <View style={styles.optionRow}>
          {PITCH_OPTIONS.map((opt) => optionBtn(String(opt.value), pitch === opt.value, getPitchLabel(opt.value), () => setPitch(opt.value)))}
        </View>
        <Text style={[styles.label, { color: c.textSecondary }]}>{t('volumeLabel')}</Text>
        <View style={styles.optionRow}>
          {VOLUME_OPTIONS.map((opt) => optionBtn(String(opt.value), volume === opt.value, getVolumeLabel(opt.value), () => setVolume(opt.value)))}
        </View>

        {voices.length > 1 && (
          <>
            <Text style={[styles.label, { color: c.textSecondary }]}>{t('voiceLabel')}</Text>
            <View style={styles.voiceWrap}>
              {voices.map((v) => {
                const active = selectedVoiceId === v.identifier;
                return (
                  <Pressable
                    key={v.identifier}
                    style={[styles.voiceChip, { borderColor: active ? c.primary : c.hairline, backgroundColor: active ? c.primary + '22' : 'transparent' }]}
                    onPress={() => setSelectedVoiceId(v.identifier)}
                  >
                    <Text style={[styles.voiceChipText, { color: active ? c.primary : c.textSecondary }]} numberOfLines={1}>
                      {v.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </GlassCard>

      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('languageTitle')}</Text>
      <GlassCard style={styles.card} contentStyle={styles.langCard}>
        {langOptions.map((lv, i) => {
          const active = locale === lv;
          return (
            <Pressable
              key={lv}
              style={[
                styles.langRow,
                { borderBottomColor: c.hairline, borderBottomWidth: i === langOptions.length - 1 ? 0 : StyleSheet.hairlineWidth },
                active && { backgroundColor: c.primary + '1A', borderRadius: 10 },
              ]}
              onPress={() => setLocale(lv)}
            >
              <Text style={styles.langFlag}>{LOCALE_FLAGS[lv]}</Text>
              <Text style={[styles.langText, { color: active ? c.primary : c.text, fontWeight: active ? '700' : '400' }]}>
                {LOCALE_NATIVE_LABELS[lv]}
              </Text>
            </Pressable>
          );
        })}
      </GlassCard>

      {isNotificationsAvailable() && (
        <>
          <Text style={[styles.sectionTitle, { color: c.text }]}>{t('reminderSectionTitle')}</Text>
          <GlassCard style={styles.card}>
            <View style={styles.reminderRow}>
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderLabel, { color: c.text }]}>
                  {t('reminderEnable')} ({reminderTimeLabel})
                </Text>
                <Text style={[styles.reminderDesc, { color: c.textSecondary }]}>{t('reminderDesc')}</Text>
              </View>
              <Switch value={reminderEnabled} onValueChange={toggleReminder} trackColor={{ true: c.primary }} />
            </View>
          </GlassCard>
        </>
      )}

      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('backupSectionTitle')}</Text>
      <GlassCard style={styles.card}>
        <Text style={[styles.backupDesc, { color: c.textSecondary }]}>{t('backupDesc')}</Text>
        <View style={styles.backupRow}>
          <GlassButton
            compact
            label={t('backupExport')}
            onPress={handleBackupExport}
            disabled={backupBusy}
            style={styles.backupBtn}
          />
          <GlassButton
            compact
            variant="outline"
            label={t('backupImport')}
            onPress={handleBackupImport}
            disabled={backupBusy}
            style={styles.backupBtn}
          />
        </View>
      </GlassCard>

      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('guideSectionTitle')}</Text>
      <GlassCard style={styles.card} contentStyle={styles.guideCard}>
        {[
          {
            key: 'open',
            icon: 'book-outline' as const,
            label: t('guideOpenLabel'),
            onPress: () => router.push('/guide'),
          },
          {
            key: 'replay',
            icon: 'play-circle-outline' as const,
            label: t('guideReplayIntro'),
            onPress: replayIntro,
          },
          {
            key: 'resetHints',
            icon: 'information-circle-outline' as const,
            label: t('guideResetHints'),
            onPress: async () => {
              await resetHints();
              Alert.alert(t('guideSectionTitle'), t('guideResetHintsDone'));
            },
          },
        ].map((row, i, arr) => (
          <Pressable
            key={row.key}
            style={({ pressed }) => [
              styles.guideRow,
              {
                borderBottomColor: c.hairline,
                borderBottomWidth: i === arr.length - 1 ? 0 : StyleSheet.hairlineWidth,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
            onPress={row.onPress}
          >
            <Ionicons name={row.icon} size={20} color={c.primary} style={styles.guideIcon} />
            <Text style={[styles.guideLabel, { color: c.text }]}>{row.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
          </Pressable>
        ))}
      </GlassCard>

      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('aboutTitle')}</Text>
      <GlassCard style={styles.card}>
        <Text style={[styles.aboutApp, { color: c.text }]}>KKorea Hangul</Text>
        <Text style={[styles.aboutDescription, { color: c.textSecondary }]}>{t('aboutDescription')}</Text>
        <Text style={[styles.aboutAuthor, { color: c.primary }]}>{t('aboutAuthor')}</Text>
        <Pressable
          style={({ pressed }) => [styles.feedbackRow, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => Linking.openURL('mailto:kataro92@gmail.com?subject=KKorea%20Hangul%20-%20Feedback')}
        >
          <Text style={[styles.feedbackLabel, { color: c.textSecondary }]}>{t('feedbackLabel')} </Text>
          <Text style={[styles.feedbackEmail, { color: c.primary }]}>kataro92@gmail.com</Text>
        </Pressable>
      </GlassCard>
    </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingTop: 8, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  card: { marginBottom: 24 },
  langCard: { padding: 8 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 8 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  reminderInfo: { flex: 1 },
  reminderLabel: { fontSize: 15, fontWeight: '600' },
  reminderDesc: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  optionRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  optionBtn: { flex: 1, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, alignItems: 'center' },
  optionBtnText: { fontSize: 13, fontWeight: '600' },
  voiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  voiceWarn: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 10, padding: 10, marginBottom: 8 },
  voiceWarnIcon: { marginTop: 1 },
  voiceWarnText: { flex: 1, fontSize: 13, lineHeight: 18 },
  voiceChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1.5 },
  voiceChipText: { fontSize: 13, fontWeight: '500' },
  langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12 },
  langFlag: { fontSize: 22, marginRight: 12 },
  langText: { fontSize: 16, flex: 1 },
  guideCard: { padding: 8 },
  guideRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12 },
  guideIcon: { marginRight: 12 },
  guideLabel: { fontSize: 16, flex: 1 },
  backupDesc: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  backupRow: { flexDirection: 'row', gap: 10 },
  backupBtn: { flex: 1 },
  aboutApp: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  aboutDescription: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  aboutAuthor: { fontSize: 15, fontWeight: '600' },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 10 },
  feedbackLabel: { fontSize: 14 },
  feedbackEmail: { fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});
