import { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

export type HangmiPose = 'hero' | 'wave' | 'read' | 'think' | 'celebrate' | 'speak';

const POSE_SOURCES: Record<HangmiPose, ImageSourcePropType> = {
  hero: require('../../../assets/mascot/hangmi-hero.png'),
  wave: require('../../../assets/mascot/hangmi-wave.webp'),
  read: require('../../../assets/mascot/hangmi-read.webp'),
  think: require('../../../assets/mascot/hangmi-think.webp'),
  celebrate: require('../../../assets/mascot/hangmi-celebrate.webp'),
  speak: require('../../../assets/mascot/hangmi-speak.webp'),
};

type HangmiFigureProps = {
  pose?: HangmiPose;
  size?: number;
  caption?: string;
  captionColor?: string;
  /** Soft vertical bob for empty states */
  animate?: boolean;
  style?: ViewStyle;
};

/**
 * Shared Hangmi mascot figure for splash-adjacent UI, empty states, and About.
 */
export function HangmiFigure({
  pose = 'hero',
  size = 140,
  caption,
  captionColor,
  animate = false,
  style,
}: HangmiFigureProps) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    let cancelled = false;
    let loop: Animated.CompositeAnimation | null = null;

    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled || reduce) return;
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(bob, { toValue: -5, duration: 1400, useNativeDriver: true }),
          Animated.timing(bob, { toValue: 0, duration: 1400, useNativeDriver: true }),
        ])
      );
      loop.start();
    });

    return () => {
      cancelled = true;
      loop?.stop();
      bob.stopAnimation();
      bob.setValue(0);
    };
  }, [animate, bob]);

  return (
    <View style={[styles.wrap, style]} accessibilityElementsHidden={!caption} importantForAccessibility={caption ? 'yes' : 'no-hide-descendants'}>
      <Animated.View style={{ transform: [{ translateY: bob }] }}>
        <Image source={POSE_SOURCES[pose]} style={{ width: size, height: size }} resizeMode="contain" />
      </Animated.View>
      {caption ? (
        <Text style={[styles.caption, captionColor ? { color: captionColor } : null]}>{caption}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 10 },
  caption: { fontSize: 14, lineHeight: 20, textAlign: 'center', paddingHorizontal: 12 },
});
