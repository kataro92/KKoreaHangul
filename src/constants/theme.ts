/**
 * Hệ thiết kế Liquid Glass — theme sáng/tối tự động (useColorScheme).
 * Cung cấp bảng màu, dải gradient pastel cho nền, và token cho bề mặt kính mờ.
 */
import { useColorScheme } from 'react-native';

export type Scheme = 'light' | 'dark';

export interface GlassTokens {
  /** Màu nền phủ trên lớp blur (bán trong suốt) */
  fill: string;
  /** Màu nền kính đậm hơn cho thẻ nổi */
  fillStrong: string;
  /** Viền sáng mảnh của kính */
  border: string;
  /** Vệt sáng highlight ở mép trên */
  highlight: string;
  /** Tông blur cho expo-blur */
  blurTint: 'light' | 'dark' | 'default';
  /** Cường độ blur */
  intensity: number;
}

export interface Theme {
  scheme: Scheme;
  colors: {
    text: string;
    textSecondary: string;
    primary: string;
    onPrimary: string;
    consonant: string;
    vowel: string;
    batchim: string;
    warning: string;
    danger: string;
    hairline: string;
    /** nền dự phòng khi không có gradient/blur */
    backdrop: string;
  };
  /** Các điểm dừng của gradient nền pastel */
  gradient: string[];
  glass: GlassTokens;
  radius: { sm: number; md: number; lg: number; xl: number };
}

const LIGHT: Theme = {
  scheme: 'light',
  colors: {
    text: '#141428',
    textSecondary: '#5A5A72',
    primary: '#4A6CF7',
    onPrimary: '#FFFFFF',
    consonant: '#4A6CF7',
    vowel: '#E85D9F',
    batchim: '#22C6A6',
    warning: '#F5A623',
    danger: '#FF5A76',
    hairline: 'rgba(20,20,40,0.08)',
    backdrop: '#EEF2FF',
  },
  gradient: ['#DCE8FF', '#E9E0FF', '#FFE1F0', '#E4F8FF'],
  glass: {
    fill: 'rgba(255,255,255,0.45)',
    fillStrong: 'rgba(255,255,255,0.62)',
    border: 'rgba(255,255,255,0.65)',
    highlight: 'rgba(255,255,255,0.9)',
    blurTint: 'light',
    intensity: 40,
  },
  radius: { sm: 10, md: 16, lg: 22, xl: 30 },
};

const DARK: Theme = {
  scheme: 'dark',
  colors: {
    text: '#F4F5FF',
    textSecondary: 'rgba(235,235,250,0.62)',
    primary: '#7AA0FF',
    onPrimary: '#0B1024',
    consonant: '#7AA0FF',
    vowel: '#FF8AC0',
    batchim: '#4BE3C1',
    warning: '#FFC24B',
    danger: '#FF7A8F',
    hairline: 'rgba(255,255,255,0.12)',
    backdrop: '#0E1030',
  },
  gradient: ['#141634', '#241a44', '#3a1c3e', '#122437'],
  glass: {
    fill: 'rgba(40,42,70,0.42)',
    fillStrong: 'rgba(48,50,82,0.58)',
    border: 'rgba(255,255,255,0.16)',
    highlight: 'rgba(255,255,255,0.28)',
    blurTint: 'dark',
    intensity: 48,
  },
  radius: { sm: 10, md: 16, lg: 22, xl: 30 },
};

export function getTheme(scheme: Scheme | null | undefined): Theme {
  return scheme === 'dark' ? DARK : LIGHT;
}

/** Hook chính: trả về theme theo chế độ hệ thống. */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return getTheme(scheme);
}
