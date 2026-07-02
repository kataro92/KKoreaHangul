import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../constants/theme';
import { GlassView } from './GlassView';

interface GlassButtonProps {
  label?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** 'primary' = nền màu đặc; 'glass' = kính mờ; 'outline' = viền màu */
  variant?: 'primary' | 'glass' | 'outline';
  /** Màu nhấn (mặc định primary theme) */
  color?: string;
  /** Nút nhỏ gọn cho hàng nhiều nút (grade / self-rate) */
  compact?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Nút thống nhất toàn app. Mọi nút hành động nên dùng component này để
 * đồng bộ bo góc, chiều cao, khoảng đệm và kiểu chữ.
 */
export function GlassButton({
  label,
  children,
  onPress,
  disabled,
  variant = 'primary',
  color,
  compact,
  style,
}: GlassButtonProps) {
  const theme = useTheme();
  const tint = color ?? theme.colors.primary;
  const radius = theme.radius.md;
  const pad = compact
    ? { paddingVertical: 11, paddingHorizontal: 12, minHeight: 44 }
    : { paddingVertical: 14, paddingHorizontal: 20, minHeight: 52 };
  const fontSize = compact ? 14 : 16;

  if (variant === 'glass') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [{ opacity: pressed || disabled ? 0.7 : 1 }, style]}
      >
        <GlassView radius={radius} style={[styles.center, pad]}>
          {children ?? (
            <Text style={[styles.text, { color: theme.colors.text, fontSize }]}>{label}</Text>
          )}
        </GlassView>
      </Pressable>
    );
  }

  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.center,
        pad,
        {
          borderRadius: radius,
          backgroundColor: isOutline ? 'transparent' : disabled ? theme.colors.textSecondary : tint,
          borderWidth: isOutline ? 1.5 : 0,
          borderColor: isOutline ? tint : 'transparent',
          opacity: pressed ? 0.85 : disabled && !isOutline ? 0.9 : disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {children ?? (
        <Text style={[styles.text, { color: isOutline ? tint : theme.colors.onPrimary, fontSize }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '700' },
});
