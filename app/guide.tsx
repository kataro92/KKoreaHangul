import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../src/components/glass/GlassCard';
import { GlassScreen } from '../src/components/glass/GlassScreen';
import { useTheme } from '../src/constants/theme';
import { useLanguage } from '../src/contexts/LanguageContext';

/**
 * Màn hướng dẫn sử dụng: tổng quan ngắn gọn từng tab + mẹo chung.
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
    { icon: 'book-outline' as const, title: t('tabAlphabet'), body: t('guideAlphabetBody') },
    { icon: 'volume-high-outline' as const, title: t('tabReading'), body: t('guideReadingBody') },
    { icon: 'school-outline' as const, title: t('tabGrammar'), body: t('guideGrammarBody') },
    { icon: 'library-outline' as const, title: t('tabVocabulary'), body: t('guideVocabularyBody') },
    { icon: 'repeat-outline' as const, title: t('tabReview'), body: t('guideReviewBody') },
    { icon: 'bulb-outline' as const, title: t('guideTipsTitle'), body: t('guideTipsBody') },
  ];

  return (
    <GlassScreen>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.intro, { color: c.textSecondary }]}>{t('guideIntro')}</Text>
      {sections.map((s) => (
        <GlassCard key={s.title} style={styles.card} contentStyle={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Ionicons name={s.icon} size={22} color={c.primary} />
            <Text style={[styles.cardTitle, { color: c.text }]}>{s.title}</Text>
          </View>
          <Text style={[styles.cardBody, { color: c.textSecondary }]}>{s.body}</Text>
        </GlassCard>
      ))}
    </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingTop: 8, paddingBottom: 40 },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  card: { marginBottom: 14 },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  cardBody: { fontSize: 14, lineHeight: 22 },
});
