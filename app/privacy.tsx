import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../src/components/glass/GlassCard';
import { GlassScreen } from '../src/components/glass/GlassScreen';
import { useTheme } from '../src/constants/theme';
import { useLanguage } from '../src/contexts/LanguageContext';
import policy from '../src/legal/privacy-policy.json';
import { PRIVACY_LABELS } from '../src/legal/privacy';

export default function PrivacyScreen() {
  const navigation = useNavigation();
  const { locale, t } = useLanguage();
  const [language, setLanguage] = useState<'en' | 'vi'>(locale === 'vi' ? 'vi' : 'en');
  const c = useTheme().colors;
  const document = policy[language];

  useEffect(() => {
    navigation.setOptions({ title: PRIVACY_LABELS[locale], headerBackTitle: t('settingsTitle') });
  }, [navigation, locale, t]);

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.languages}>
          {(['en', 'vi'] as const).map((value) => (
            <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: value === language }}
              onPress={() => setLanguage(value)} style={styles.language}>
              <Text style={{ color: value === language ? c.primary : c.textSecondary, fontWeight: '600' }}>
                {value === 'en' ? 'English' : 'Tiếng Việt'}
              </Text>
            </Pressable>
          ))}
        </View>
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
  languages: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  language: { paddingVertical: 12, paddingHorizontal: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  card: { marginBottom: 14 },
  cardContent: { padding: 16, gap: 10 },
  heading: { fontSize: 17, fontWeight: '700' },
  paragraph: { fontSize: 15, lineHeight: 23 },
});
