import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlassView } from '../src/components/glass/GlassView';
import { GlassButton } from '../src/components/glass/GlassButton';
import { GlassScreen } from '../src/components/glass/GlassScreen';
import { useTheme } from '../src/constants/theme';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useSrs } from '../src/contexts/SrsContext';

export default function ReviewManageScreen() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const { cards, addCard, removeCard, refreshMeanings } = useSrs();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: t('srsManageTitle') });
  }, [navigation, t]);

  const canSave = front.trim().length > 0 && back.trim().length > 0;
  const save = () => {
    if (!canSave) return;
    addCard({ type: 'custom', front: front.trim(), back: back.trim() });
    setFront('');
    setBack('');
  };

  return (
    <GlassScreen>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: c.text }]}>{t('srsCreateCard')}</Text>
        <GlassView radius={theme.radius.md} style={styles.inputWrap}>
          <TextInput
            style={[styles.input, { color: c.text }]}
            value={front}
            onChangeText={setFront}
            placeholder={t('srsFront')}
            placeholderTextColor={c.textSecondary}
          />
        </GlassView>
        <GlassView radius={theme.radius.md} style={styles.inputWrap}>
          <TextInput
            style={[styles.input, { color: c.text }]}
            value={back}
            onChangeText={setBack}
            placeholder={t('srsBack')}
            placeholderTextColor={c.textSecondary}
          />
        </GlassView>
        <GlassButton onPress={save} disabled={!canSave} label={t('srsSave')} />

        {cards.length > 0 && (
          <GlassButton
            variant="glass"
            onPress={() => refreshMeanings()}
            label={t('srsRefreshMeanings')}
            style={styles.refreshBtn}
          />
        )}

        <Text style={[styles.sectionTitle, { color: c.text, marginTop: 24 }]}>
          {t('srsManageTitle')} ({cards.length})
        </Text>
        {cards.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSecondary }]}>{t('srsManageEmpty')}</Text>
        ) : (
          cards.map((card) => (
            <GlassView key={card.id} radius={theme.radius.md} style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardFront, { color: c.text }]}>{card.front}</Text>
                <Text style={[styles.cardBack, { color: c.textSecondary }]} numberOfLines={1}>
                  {card.back}
                </Text>
              </View>
              <Pressable
                onPress={() => removeCard(card.id)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`${t('srsDelete')}: ${card.front}`}
                style={styles.delBtn}
              >
                <Ionicons name="trash-outline" size={20} color={c.danger} />
              </Pressable>
            </GlassView>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingTop: 8, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  inputWrap: { marginBottom: 10, paddingHorizontal: 4 },
  input: { paddingHorizontal: 12, paddingVertical: 12, fontSize: 16 },
  refreshBtn: { marginTop: 10 },
  empty: { fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  cardRow: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 8 },
  cardInfo: { flex: 1, marginRight: 8 },
  cardFront: { fontSize: 17, fontWeight: '600' },
  cardBack: { fontSize: 13, marginTop: 2 },
  delBtn: { padding: 4 },
});
