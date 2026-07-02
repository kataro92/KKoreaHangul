import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../constants/theme';

let BlurView: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  BlurView = require('expo-blur').BlurView;
} catch {
  BlurView = null;
}

/**
 * Nền kính mờ tràn viền cho tab bar / header (không bo góc).
 */
export function BlurFill({ borderTop, borderBottom }: { borderTop?: boolean; borderBottom?: boolean }) {
  const theme = useTheme();
  const borderStyle = {
    borderTopWidth: borderTop ? StyleSheet.hairlineWidth : 0,
    borderBottomWidth: borderBottom ? StyleSheet.hairlineWidth : 0,
    borderColor: theme.glass.border,
  };
  if (BlurView) {
    return (
      <BlurView
        intensity={theme.glass.intensity + 15}
        tint={theme.glass.blurTint}
        style={[StyleSheet.absoluteFill, borderStyle]}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glass.fill }]} />
      </BlurView>
    );
  }
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glass.fillStrong }, borderStyle]} />
  );
}
