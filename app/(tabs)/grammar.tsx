import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlassView } from '../../src/components/glass/GlassView';
import { GlassCard } from '../../src/components/glass/GlassCard';
import { GlassScreen } from '../../src/components/glass/GlassScreen';
import { useTheme } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { getGrammarByLevel } from '../../src/data/grammar';
import type { GrammarLevel } from '../../src/data/grammar';

export default function GrammarScreen() {
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const router = useRouter();
  const [level, setLevel] = useState<GrammarLevel>('topik1');
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const list = getGrammarByLevel(level);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.explanation.toLowerCase().includes(q) ||
        g.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [level, query]);

  const levelBtn = (lv: GrammarLevel, label: string) => {
    const active = level === lv;
    return (
      <Pressable
        style={[styles.levelBtn, { borderColor: active ? c.primary : c.hairline, backgroundColor: active ? c.primary + '22' : 'transparent' }]}
        onPress={() => setLevel(lv)}
      >
        <Text style={[styles.levelBtnText, { color: active ? c.primary : c.textSecondary }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <GlassScreen>
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelRow}>
          {levelBtn('basics', t('grammarBasics'))}
          {levelBtn('topik1', t('vocabLevel1'))}
          {levelBtn('topik2', t('vocabLevel2'))}
        </View>
        <GlassView radius={theme.radius.md} style={styles.searchWrap}>
          <TextInput
            style={[styles.search, { color: c.text }]}
            value={query}
            onChangeText={setQuery}
            placeholder={t('grammarSearchPlaceholder')}
            placeholderTextColor={c.textSecondary}
          />
        </GlassView>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSecondary }]}>{t('grammarEmpty')}</Text>
        ) : (
          items.map((g) => (
            <Pressable key={g.id} onPress={() => router.push(`/grammar/${g.id}`)}>
              <GlassCard style={styles.item} contentStyle={styles.itemContent}>
                <View style={styles.itemMain}>
                  <Text style={[styles.itemTitle, { color: c.text }]}>{g.title}</Text>
                  <Text style={[styles.itemExplanation, { color: c.textSecondary }]} numberOfLines={2}>
                    {g.explanation}
                  </Text>
                  {g.tags.length > 0 && (
                    <View style={styles.tagRow}>
                      {g.tags.map((tag) => (
                        <Text key={tag} style={[styles.tag, { color: c.primary, backgroundColor: c.primary + '1A' }]}>
                          {tag}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
              </GlassCard>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { padding: 16, paddingBottom: 8 },
  levelRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  levelBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  levelBtnText: { fontSize: 12.5, fontWeight: '600', textAlign: 'center' },
  searchWrap: { paddingHorizontal: 4 },
  search: { paddingHorizontal: 12, paddingVertical: 11, fontSize: 15 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingTop: 4, paddingBottom: 110 },
  empty: { fontSize: 14, textAlign: 'center', paddingVertical: 24 },
  item: { marginBottom: 12 },
  itemContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  itemMain: { flex: 1, marginRight: 8 },
  itemTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  itemExplanation: { fontSize: 13, lineHeight: 18 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
});
