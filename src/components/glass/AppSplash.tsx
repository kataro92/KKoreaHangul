import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../constants/theme';
import { ScreenBackground } from './ScreenBackground';

/**
 * Lớp splash do React vẽ, phủ khớp với splash native (cùng nền gradient + logo).
 * Hiển thị tối thiểu `minDuration` ms rồi mờ dần (fade) — chạy mượt trên cả iOS,
 * Android và web (không phụ thuộc setOptions vốn chỉ hỗ trợ Android).
 */
export function AppSplash({
  minDuration = 1200,
  fadeDuration = 500,
}: {
  minDuration?: number;
  fadeDuration?: number;
}) {
  const theme = useTheme();
  const [hidden, setHidden] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Logo phóng nhẹ lên khi xuất hiện.
    Animated.spring(scale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }).start();
    const id = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: fadeDuration, useNativeDriver: true }).start(() =>
        setHidden(true)
      );
    }, minDuration);
    return () => clearTimeout(id);
  }, [minDuration, fadeDuration, opacity, scale]);

  if (hidden) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.wrap, { opacity }]}>
      <ScreenBackground />
      <Animated.View style={[styles.center, { transform: [{ scale }] }]}>
        <Image source={require('../../../assets/splash-icon.png')} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.title, { color: theme.colors.text }]}>KKorea Hangul</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', zIndex: 9999, elevation: 24 },
  center: { alignItems: 'center', justifyContent: 'center', gap: 14 },
  logo: { width: 176, height: 176 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
});
