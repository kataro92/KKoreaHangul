import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../constants/theme';

type SolidWaveProps = {
  /** true khi TTS đang phát */
  active: boolean;
  /** Văn bản đang đọc — dùng ước lượng độ dài để sóng chạy khớp */
  text?: string;
  /** Tốc độ TTS (1 = bình thường) */
  rate?: number;
  color?: string;
  /** Màu phần sóng chưa tới (mờ hơn) */
  dimColor?: string;
  barCount?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/** Ước lượng thời gian nói (ms) — Hangul chậm hơn chữ Latin. */
export function estimateSpeechMs(text: string, rate = 1): number {
  let ms = 280; // pad mở đầu TTS
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) ms += 280;
    else if (/\s/.test(ch)) ms += 120;
    else ms += 90;
  }
  const safeRate = rate > 0.2 ? rate : 1;
  return Math.max(600, ms / safeRate);
}

/**
 * Solid waveform animate khi phát âm.
 * expo-speech không cung cấp amplitude thật — sóng được mô phỏng và
 * tiến độ trái→phải ước lượng theo độ dài văn bản + tốc độ TTS.
 */
export function SolidWave({
  active,
  text = '',
  rate = 1,
  color,
  dimColor,
  barCount = 36,
  height = 32,
  style,
}: SolidWaveProps) {
  const theme = useTheme();
  const tint = color ?? theme.colors.onPrimary;
  const dim = dimColor ?? tint + '55';
  const durationMs = useMemo(() => estimateSpeechMs(text, rate), [text, rate]);

  // Pattern biên độ “cố định” theo nội dung — mỗi từ có dáng sóng riêng.
  const envelope = useMemo(() => {
    const arr: number[] = [];
    let seed = 0;
    for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
    if (seed === 0) seed = 1;
    for (let i = 0; i < barCount; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const r = (seed % 1000) / 1000;
      const arch = Math.sin((i / Math.max(1, barCount - 1)) * Math.PI); // cao giữa
      arr.push(0.18 + 0.82 * (0.45 * r + 0.55 * arch));
    }
    return arr;
  }, [text, barCount]);

  const [levels, setLevels] = useState<number[]>(() => envelope.map((e) => e * 0.2));
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!active) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setProgress(0);
      setLevels(envelope.map((e) => e * 0.15));
      return;
    }

    startRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(1, elapsed / durationMs);
      const t = elapsed / 1000;
      const next = envelope.map((env, i) => {
        const phase = i * 0.42;
        // Dao động nhanh giống biên độ giọng nói
        const wobble =
          0.55 +
          0.45 * Math.abs(Math.sin(t * 9.5 + phase) * Math.cos(t * 3.1 + i * 0.15));
        // Phần đã “phát” sống động hơn; phần chưa tới thấp và tĩnh hơn
        const reached = i / barCount <= p + 0.02;
        if (!reached) return env * 0.22;
        return Math.min(1, env * wobble);
      });
      setLevels(next);
      setProgress(p);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [active, durationMs, envelope, barCount]);

  if (!active) return null;

  return (
    <View style={[styles.wrap, { height }, style]} accessibilityElementsHidden>
      {levels.map((level, i) => {
        const played = i / barCount <= progress;
        const barH = Math.max(3, level * height);
        return (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: barH,
                backgroundColor: played ? tint : dim,
                opacity: played ? 1 : 0.45,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 4,
  },
  bar: {
    flex: 1,
    maxWidth: 6,
    borderRadius: 2,
    minHeight: 3,
  },
});
