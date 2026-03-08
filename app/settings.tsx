import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../src/constants/colors';
import { useLanguage, LOCALE_NATIVE_LABELS, LOCALE_FLAGS } from '../src/contexts/LanguageContext';
import type { Locale } from '../src/contexts/LanguageContext';
import {
  useSpeechConfig,
  RATE_OPTIONS,
  PITCH_OPTIONS,
  VOLUME_OPTIONS,
} from '../src/contexts/SpeechConfigContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { t, locale, setLocale, getRateLabel, getPitchLabel, getVolumeLabel } = useLanguage();
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
  } = useSpeechConfig();

  useEffect(() => {
    navigation.setOptions({
      title: t('settingsTitle'),
      headerBackTitle: t('backToMain'),
    });
  }, [navigation, t]);

  const langOptions: { value: Locale }[] = [
    { value: 'en' },
    { value: 'vi' },
    { value: 'zh' },
    { value: 'hi' },
    { value: 'es' },
    { value: 'fr' },
    { value: 'ja' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>{t('speechTitle')}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>{t('rateLabel')}</Text>
        <View style={styles.optionRow}>
          {RATE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.optionBtn, rate === opt.value && styles.optionBtnActive]}
              onPress={() => setRate(opt.value)}
            >
              <Text style={[styles.optionBtnText, rate === opt.value && styles.optionBtnTextActive]}>
                {getRateLabel(opt.value)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>{t('pitchLabel')}</Text>
        <View style={styles.optionRow}>
          {PITCH_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.optionBtn, pitch === opt.value && styles.optionBtnActive]}
              onPress={() => setPitch(opt.value)}
            >
              <Text style={[styles.optionBtnText, pitch === opt.value && styles.optionBtnTextActive]}>
                {getPitchLabel(opt.value)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>{t('volumeLabel')}</Text>
        <View style={styles.optionRow}>
          {VOLUME_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.optionBtn, volume === opt.value && styles.optionBtnActive]}
              onPress={() => setVolume(opt.value)}
            >
              <Text style={[styles.optionBtnText, volume === opt.value && styles.optionBtnTextActive]}>
                {getVolumeLabel(opt.value)}
              </Text>
            </Pressable>
          ))}
        </View>

        {voices.length > 1 && (
          <>
            <Text style={styles.label}>{t('voiceLabel')}</Text>
            <View style={styles.voiceWrap}>
              {voices.map((v) => (
                <Pressable
                  key={v.identifier}
                  style={[
                    styles.voiceChip,
                    selectedVoiceId === v.identifier && styles.voiceChipActive,
                  ]}
                  onPress={() => setSelectedVoiceId(v.identifier)}
                >
                  <Text
                    style={[
                      styles.voiceChipText,
                      selectedVoiceId === v.identifier && styles.voiceChipTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {v.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>{t('languageTitle')}</Text>
      <View style={styles.card}>
        {langOptions.map((opt) => (
          <Pressable
            key={opt.value}
            style={[styles.langRow, locale === opt.value && styles.langRowActive]}
            onPress={() => setLocale(opt.value)}
          >
            <Text style={styles.langFlag}>{LOCALE_FLAGS[opt.value]}</Text>
            <Text style={[styles.langText, locale === opt.value && styles.langTextActive]}>
              {LOCALE_NATIVE_LABELS[opt.value]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('aboutTitle')}</Text>
      <View style={styles.card}>
        <Text style={styles.aboutApp}>KKorea Hangul</Text>
        <Text style={styles.aboutDescription}>{t('aboutDescription')}</Text>
        <Text style={styles.aboutAuthor}>{t('aboutAuthor')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  optionBtnActive: {
    borderColor: colors.primary,
    backgroundColor: '#4A90D920',
  },
  optionBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionBtnTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  voiceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  voiceChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  voiceChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#4A90D920',
  },
  voiceChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  voiceChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  langRowActive: {
    backgroundColor: '#4A90D920',
    borderBottomColor: 'transparent',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  langFlag: {
    fontSize: 22,
    marginRight: 12,
  },
  langText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  langTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  aboutApp: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  aboutAuthor: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
