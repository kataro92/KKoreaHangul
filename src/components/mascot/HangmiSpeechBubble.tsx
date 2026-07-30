import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../constants/theme';

type HangmiSpeechBubbleProps = {
  text: string;
  /** Avatar size (default 64) */
  avatarSize?: number;
  style?: ViewStyle;
  /** Compact layout for hint cards */
  compact?: boolean;
};

/**
 * Hangmi speaking beside a tip bubble — used in ScreenHint and the user guide.
 */
export function HangmiSpeechBubble({ text, avatarSize = 64, style, compact }: HangmiSpeechBubbleProps) {
  const theme = useTheme();
  const c = theme.colors;

  return (
    <View style={[styles.row, style]}>
      <Image
        source={require('../../../assets/mascot/hangmi-speak.webp')}
        style={{ width: avatarSize, height: avatarSize }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <View
        style={[
          styles.bubble,
          compact && styles.bubbleCompact,
          {
            backgroundColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(74,108,247,0.08)',
            borderColor: c.hairline,
          },
        ]}
      >
        <View
          style={[
            styles.tail,
            {
              borderRightColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(74,108,247,0.08)',
            },
          ]}
        />
        <Text style={[styles.text, compact && styles.textCompact, { color: c.text }]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bubble: {
    flex: 1,
    borderRadius: 16,
    borderTopLeftRadius: 6,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    position: 'relative',
  },
  bubbleCompact: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderTopLeftRadius: 4 },
  tail: {
    position: 'absolute',
    left: -8,
    top: 16,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  text: { fontSize: 14, lineHeight: 21 },
  textCompact: { fontSize: 13, lineHeight: 19 },
});
