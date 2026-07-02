import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../constants/theme';
import { ScreenBackground } from './ScreenBackground';

/**
 * Bọc mỗi màn hình: nền đục (backdrop) + gradient pastel phía sau nội dung.
 * Vì nền đục, màn đang hiển thị che hẳn màn phía sau — tránh việc các scene
 * trong suốt bị chồng lên nhau (đặc biệt trên web).
 */
export function GlassScreen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.colors.backdrop }, style]}>
      <ScreenBackground />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
