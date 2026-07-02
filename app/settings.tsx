import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { GlassCard } from '../src/components/glass/GlassCard';
import { GlassScreen } from '../src/components/glass/GlassScreen';
import { useTheme } from '../src/constants/theme';
import { useLanguage, LOCALE_NATIVE_LABELS, LOCALE_FLAGS } from '../src/contexts/LanguageContext';
import type { Locale } from '../src/contexts/LanguageContext';
import { useSpeechConfig, RATE_OPTIONS, PITCH_OPTIONS, VOLUME_OPTIONS } from '../src/contexts/SpeechConfigContext';
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
  const { t, locale, setLocale, getRateLabel, getPitchLabel, getVolumeLabel } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const { rate, pitch, volume, voices, selectedVoiceId, setRate, setPitch, setVolume, setSelectedVoiceId } =
    useSpeechConfig();

  const [reminderEnabled, setReminderEnabled] = useState(false);

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
        return;
      }
    } else {
      await cancelReminder();
    }
    await saveJSON(StorageKeys.settings, { reminderEnabled: value });
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

      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('aboutTitle')}</Text>
      <GlassCard style={styles.card}>
        <Text style={[styles.aboutApp, { color: c.text }]}>KKorea Hangul</Text>
        <Text style={[styles.aboutDescription, { color: c.textSecondary }]}>{t('aboutDescription')}</Text>
        <Text style={[styles.aboutAuthor, { color: c.primary }]}>{t('aboutAuthor')}</Text>
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
  voiceChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1.5 },
  voiceChipText: { fontSize: 13, fontWeight: '500' },
  langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12 },
  langFlag: { fontSize: 22, marginRight: 12 },
  langText: { fontSize: 16, flex: 1 },
  aboutApp: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  aboutDescription: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  aboutAuthor: { fontSize: 15, fontWeight: '600' },
});
