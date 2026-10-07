import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { GlassCard } from '../src/components/glass/GlassCard';
import { GlassScreen } from '../src/components/glass/GlassScreen';
import { useTheme } from '../src/constants/theme';
import { useLanguage } from '../src/contexts/LanguageContext';
import { getPrivacyPolicy, PRIVACY_LABELS } from '../src/legal/privacy';

export default function PrivacyScreen() {
  const navigation = useNavigation();
  const { locale, t } = useLanguage();
  const c = useTheme().colors;
  const document = getPrivacyPolicy(locale);

  useEffect(() => {
    navigation.setOptions({ title: PRIVACY_LABELS[locale], headerBackTitle: t('settingsTitle') });
  }, [navigation, locale, t]);

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: c.text }]}>{document.title}</Text>
        {document.sections.map((section) => (
          <GlassCard key={section.title} style={styles.card} contentStyle={styles.cardContent}>
            <Text selectable style={[styles.heading, { color: c.text }]}>{section.title}</Text>
            {section.paragraphs.map((paragraph, index) => (
              <Text selectable key={index} style={[styles.paragraph, { color: c.textSecondary }]}>{paragraph}</Text>
            ))}
          </GlassCard>
        ))}
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  card: { marginBottom: 14 },
  cardContent: { padding: 16, gap: 10 },
  heading: { fontSize: 17, fontWeight: '700' },
  paragraph: { fontSize: 15, lineHeight: 23 },
});
