import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../constants/theme';

// Import có bảo vệ: nếu chưa cài expo-blur thì fallback View bán trong suốt.
let BlurView: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  BlurView = require('expo-blur').BlurView;
} catch {
  BlurView = null;
}

interface GlassViewProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** Dùng nền kính đậm hơn cho thẻ nổi bật */
  strong?: boolean;
  /** Bo góc (mặc định lg) */
  radius?: number;
  /** Hiện vệt sáng highlight ở mép trên */
  highlight?: boolean;
}

/**
 * Bề mặt kính mờ Liquid Glass: lớp blur + phủ màu bán trong suốt + viền sáng
 * + vệt highlight ở mép trên. Fallback sang View mờ khi thiếu expo-blur.
 */
export function GlassView({ children, style, strong, radius, highlight = true }: GlassViewProps) {
  const theme = useTheme();
  const r = radius ?? theme.radius.lg;
  const fill = strong ? theme.glass.fillStrong : theme.glass.fill;

  const frame: ViewStyle = {
    borderRadius: r,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: theme.glass.border,
    overflow: 'hidden',
  };

  const content = (
    <>
      {highlight && (
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            { backgroundColor: theme.glass.highlight, borderTopLeftRadius: r, borderTopRightRadius: r },
          ]}
        />
      )}
      {children}
    </>
  );

  if (BlurView) {
    return (
      <BlurView
        intensity={theme.glass.intensity}
        tint={theme.glass.blurTint}
        experimentalBlurMethod="dimezisBlurView"
        style={[frame, style]}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} pointerEvents="none" />
        {content}
      </BlurView>
    );
  }

  return <View style={[frame, { backgroundColor: fill }, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    opacity: 0.9,
  },
});
