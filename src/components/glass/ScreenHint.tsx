import { StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGuidance } from '../../contexts/GuidanceContext';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';
import { HangmiSpeechBubble } from '../mascot/HangmiSpeechBubble';

/**
 * Thẻ gợi ý lần đầu cho từng màn hình:
 * - Chưa đóng → Hangmi đang nói + nút "Đã hiểu" (chỉ hiện một lần).
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
      <HangmiSpeechBubble text={hint} avatarSize={72} compact />
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
  button: { alignSelf: 'flex-end' },
  subtitle: { fontSize: 13, marginBottom: 12 },
});
