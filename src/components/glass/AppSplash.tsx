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
  ready = true,
}: {
  minDuration?: number;
  fadeDuration?: number;
  /** Chỉ bắt đầu đếm giờ fade khi app đã sẵn sàng (vd đã đọc xong cờ onboarding). */
  ready?: boolean;
}) {
  const theme = useTheme();
  const [hidden, setHidden] = useState(false);
  const [fading, setFading] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    // Logo phóng nhẹ lên khi xuất hiện.
    Animated.spring(scale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }).start();
    // Dự phòng: animation có thể không bao giờ hoàn tất khi app/tab bị đưa
    // xuống nền (rAF bị tạm dừng) — luôn gỡ splash sau tổng thời gian dự kiến
    // để lớp phủ không chặn tương tác vĩnh viễn (vô điều kiện, kể cả khi
    // `ready` không bao giờ tới, vd AsyncStorage treo).
    const failSafe = setTimeout(() => setHidden(true), minDuration + fadeDuration + 1500);
    return () => clearTimeout(failSafe);
  }, [minDuration, fadeDuration, scale]);

  useEffect(() => {
    if (!ready) return;
    // Đếm giờ fade chỉ khi app sẵn sàng, nhưng vẫn tính từ lúc mount để tổng
    // thời gian splash không bị cộng dồn khi ready tới sớm.
    const elapsed = Date.now() - mountedAt.current;
    const id = setTimeout(() => {
      setFading(true);
      Animated.timing(opacity, { toValue: 0, duration: fadeDuration, useNativeDriver: true }).start(() =>
        setHidden(true)
      );
    }, Math.max(0, minDuration - elapsed));
    return () => clearTimeout(id);
  }, [ready, minDuration, fadeDuration, opacity]);

  if (hidden) return null;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.wrap, { opacity }]}
      pointerEvents={fading ? 'none' : 'auto'}
    >
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
