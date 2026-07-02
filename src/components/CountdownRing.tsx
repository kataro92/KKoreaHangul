import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface CountdownRingProps {
  remaining: number;
  total: number;
}

/** Đồng hồ đếm ngược đơn giản: vòng số + thanh tiến độ (không cần svg). */
export function CountdownRing({ remaining, total }: CountdownRingProps) {
  const theme = useTheme();
  const c = theme.colors;
  const ratio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { borderColor: c.primary, backgroundColor: c.primary + '1A' }]}>
        <Text style={[styles.number, { color: c.primary }]}>{remaining}</Text>
        <Text style={[styles.unit, { color: c.primary }]}>s</Text>
      </View>
      <View style={[styles.track, { backgroundColor: c.hairline }]}>
        <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: c.primary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12 },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  number: { fontSize: 40, fontWeight: '800' },
  unit: { fontSize: 16, marginLeft: 2, marginTop: 8 },
  track: { width: 180, height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});
