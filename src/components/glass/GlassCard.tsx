import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../constants/theme';
import { GlassView } from './GlassView';

interface GlassCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  strong?: boolean;
  radius?: number;
}

/**
 * Thẻ kính mờ có bóng đổ mềm. Bóng đặt ở lớp ngoài (vì GlassView overflow:hidden).
 */
export function GlassCard({ children, style, contentStyle, strong = true, radius }: GlassCardProps) {
  const theme = useTheme();
  const r = radius ?? theme.radius.lg;
  const shadow: ViewStyle =
    Platform.OS === 'android'
      ? { elevation: 6 }
      : {
          shadowColor: theme.scheme === 'dark' ? '#000' : '#5566AA',
          shadowOpacity: theme.scheme === 'dark' ? 0.4 : 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
        };
  return (
    <View style={[{ borderRadius: r }, shadow, style]}>
      <GlassView strong={strong} radius={r} style={[styles.inner, contentStyle]}>
        {children}
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: { padding: 18 },
});
