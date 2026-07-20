import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGuidance } from '../../contexts/GuidanceContext';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

/**
 * Thẻ gợi ý lần đầu cho từng màn hình:
 * - Chưa đóng → thẻ giải thích 2-3 dòng + nút "Đã hiểu" (chỉ hiện một lần).
 * - Đã đóng → thay bằng một dòng mô tả nhỏ cố định (subtitle, nếu có).
 * Trạng thái đã đóng lưu trong GuidanceContext (AsyncStorage, có trong backup).
 */
export function ScreenHint({
  id,
  hint,
  subtitle,
  style,
}: {
  /** Định danh màn hình: 'alphabet' | 'reading' | 'grammar' | 'vocabulary' | 'review' */
  id: string;
  /** Nội dung thẻ gợi ý lần đầu. */
  hint: string;
  /** Dòng mô tả nhỏ hiển thị sau khi thẻ bị đóng (tuỳ chọn). */
  subtitle?: string;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const c = theme.colors;
  const { t } = useLanguage();
  const { ready, isHintDismissed, dismissHint } = useGuidance();

  // Chưa đọc xong storage: không render gì để tránh nháy thẻ đã bị đóng.
  if (!ready) return null;

  if (isHintDismissed(id)) {
    if (!subtitle) return null;
    return <Text style={[styles.subtitle, { color: c.textSecondary }, style]}>{subtitle}</Text>;
  }

  return (
    <GlassCard style={style ? [styles.card, style] : styles.card} contentStyle={styles.cardContent}>
      <View style={styles.row}>
        <Ionicons name="information-circle-outline" size={20} color={c.primary} style={styles.icon} />
        <Text style={[styles.hint, { color: c.text }]}>{hint}</Text>
      </View>
      <GlassButton
        compact
        variant="outline"
        label={t('hintGotIt')}
        onPress={() => dismissHint(id)}
        style={styles.button}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 14 },
  cardContent: { padding: 14, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  icon: { marginTop: 1 },
  hint: { flex: 1, fontSize: 13, lineHeight: 19 },
  button: { alignSelf: 'flex-end' },
  subtitle: { fontSize: 13, marginBottom: 12 },
});
