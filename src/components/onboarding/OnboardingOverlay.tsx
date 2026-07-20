import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGuidance } from '../../contexts/GuidanceContext';
import { ScreenBackground } from '../glass/ScreenBackground';
import { GlassView } from '../glass/GlassView';
import { GlassButton } from '../glass/GlassButton';

/**
 * Màn giới thiệu tính năng, hiện lần đầu mở app (hoặc xem lại từ Cài đặt).
 * Là lớp phủ full-screen (không phải route) render trong _layout, dưới AppSplash
 * — nhờ đó không có race điều hướng lúc khởi động và không nháy tab.
 */

const SLIDE_IMAGES = [
  require('../../../assets/illustrations/onboarding/slide-1.webp'),
  require('../../../assets/illustrations/onboarding/slide-2.webp'),
  require('../../../assets/illustrations/onboarding/slide-3.webp'),
  require('../../../assets/illustrations/onboarding/slide-4.webp'),
] as const;
const FADE_OUT_MS = 350;

export function OnboardingOverlay() {
  const theme = useTheme();
  const c = theme.colors;
  const { t } = useLanguage();
  const { ready, introVisible, finishIntro } = useGuidance();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [page, setPage] = useState(0);
  const [closing, setClosing] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  // Reset trạng thái mỗi lần overlay được mở lại (vd "Xem lại giới thiệu").
  useEffect(() => {
    if (introVisible) {
      setPage(0);
      setClosing(false);
      opacity.setValue(1);
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [introVisible, opacity]);

  // Dự phòng: nếu animation fade không hoàn tất (app bị đưa xuống nền),
  // vẫn đóng overlay để không chặn tương tác.
  useEffect(() => {
    if (!closing) return;
    const failSafe = setTimeout(() => finishIntro(), FADE_OUT_MS + 250);
    return () => clearTimeout(failSafe);
  }, [closing, finishIntro]);

  if (!ready || !introVisible) return null;

  const slides = [1, 2, 3, 4].map((n) => ({
    image: SLIDE_IMAGES[n - 1],
    title: t(`onboardingSlide${n}Title` as 'onboardingSlide1Title'),
    body: t(`onboardingSlide${n}Body` as 'onboardingSlide1Body'),
  }));
  const isLast = page === slides.length - 1;

  const close = () => {
    if (closing) return;
    setClosing(true);
    Animated.timing(opacity, { toValue: 0, duration: FADE_OUT_MS, useNativeDriver: true }).start(() =>
      finishIntro()
    );
  };

  const next = () => {
    const target = Math.min(page + 1, slides.length - 1);
    // Cập nhật page ngay để nút/chấm phản hồi tức thì; onScroll sẽ đồng bộ lại
    // nếu người dùng tự vuốt.
    setPage(target);
    scrollRef.current?.scrollTo({ x: target * width, animated: true });
  };

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.wrap, { opacity }]}
      pointerEvents={closing ? 'none' : 'auto'}
    >
      <ScreenBackground />

      {/* Nút bỏ qua (ẩn ở slide cuối) */}
      <View style={[styles.skipRow, { top: insets.top + 12 }]}>
        {!isLast && (
          <GlassButton variant="glass" compact label={t('onboardingSkip')} onPress={close} />
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setPage(Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width)))
        }
        onScroll={(e) =>
          setPage(Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width)))
        }
        scrollEventThrottle={64}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {slides.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <GlassView radius={theme.radius.lg} style={styles.imageWrap}>
              <Image source={slide.image} style={styles.image} resizeMode="contain" />
            </GlassView>
            <Text style={[styles.title, { color: c.text }]}>{slide.title}</Text>
            <Text style={[styles.body, { color: c.textSecondary }]}>{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Chấm chỉ báo trang */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === page ? c.primary : c.hairline },
              i === page && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        {isLast ? (
          <GlassButton label={t('onboardingStart')} onPress={close} style={styles.footerBtn} />
        ) : (
          <GlassButton label={t('onboardingNext')} onPress={next} style={styles.footerBtn} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { zIndex: 9000, elevation: 20 },
  skipRow: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minHeight: 44,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 18,
  },
  imageWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
    padding: 12,
  },
  image: { width: 196, height: 196 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  body: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 20 },
  footer: { paddingHorizontal: 24 },
  footerBtn: { alignSelf: 'stretch' },
});
