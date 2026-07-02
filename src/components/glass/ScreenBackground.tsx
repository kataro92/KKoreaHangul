import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../constants/theme';

// Import có bảo vệ: nếu chưa cài expo-linear-gradient thì fallback nền đặc.
let LinearGradient: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  LinearGradient = null;
}

/**
 * Nền gradient pastel phủ toàn màn hình cho hiệu ứng Liquid Glass.
 * Đặt tuyệt đối phía sau nội dung.
 */
export function ScreenBackground() {
  const theme = useTheme();
  if (LinearGradient) {
    return (
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    );
  }
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.backdrop }]}
    />
  );
}
