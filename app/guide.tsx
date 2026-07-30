import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { GlassCard } from '../src/components/glass/GlassCard';
import { GlassScreen } from '../src/components/glass/GlassScreen';
import { HangmiFigure } from '../src/components/mascot/HangmiFigure';
import { HangmiSpeechBubble } from '../src/components/mascot/HangmiSpeechBubble';
import { useTheme } from '../src/constants/theme';
import { useLanguage } from '../src/contexts/LanguageContext';

/**
 * Màn hướng dẫn sử dụng: Hangmi giải thích từng tab + mẹo chung.
 * Mở từ Cài đặt → Hướng dẫn → Hướng dẫn sử dụng.
 */
export default function GuideScreen() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;

  useEffect(() => {
    navigation.setOptions({ title: t('guideTitle'), headerBackTitle: t('settingsTitle') });
  }, [navigation, t]);

  const sections = [
    { title: t('tabAlphabet'), body: t('guideAlphabetBody') },
    { title: t('tabReading'), body: t('guideReadingBody') },
    { title: t('tabGrammar'), body: t('guideGrammarBody') },
    { title: t('tabVocabulary'), body: t('guideVocabularyBody') },
    { title: t('tabReview'), body: t('guideReviewBody') },
    { title: t('guideTipsTitle'), body: t('guideTipsBody') },
  ];

  return (
    <GlassScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HangmiFigure pose="speak" size={120} style={styles.guideMascot} />
        <Text style={[styles.intro, { color: c.textSecondary }]}>{t('guideIntro')}</Text>
        {sections.map((s) => (
          <GlassCard key={s.title} style={styles.card} contentStyle={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: c.text }]}>{s.title}</Text>
            <HangmiSpeechBubble text={s.body} avatarSize={76} />
          </GlassCard>
        ))}
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingTop: 8, paddingBottom: 40 },
  guideMascot: { marginBottom: 4 },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: 16, textAlign: 'center' },
  card: { marginBottom: 14 },
  cardContent: { padding: 16, gap: 12 },
  cardTitle: { fontSize: 17, fontWeight: '700' },
});
