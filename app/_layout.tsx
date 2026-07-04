import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { SpeechConfigProvider } from '../src/contexts/SpeechConfigContext';
import { SrsProvider } from '../src/contexts/SrsContext';
import { AppSplash } from '../src/components/glass/AppSplash';
import { useTheme } from '../src/constants/theme';

// Import có bảo vệ: nếu chưa cài expo-splash-screen thì app vẫn chạy (no-op).
let SplashScreen: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SplashScreen = require('expo-splash-screen');
} catch {
  SplashScreen = null;
}

/** Thời gian splash hiển thị tối thiểu (ms). */
const MIN_SPLASH_MS = 1200;

// Giữ splash native cho tới khi React sẵn sàng (gọi ở global scope, không await).
try {
  SplashScreen?.preventAutoHideAsync?.();
} catch {
  // ignore
}

function ThemedStack() {
  const theme = useTheme();

  useEffect(() => {
    // Lớp AppSplash (React) đã phủ kín; ẩn splash native bên dưới sau frame đầu
    // để chuyển tiếp liền mạch (native → overlay giống hệt nhau).
    const id = setTimeout(() => {
      SplashScreen?.hideAsync?.().catch(() => {});
    }, 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backdrop }}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          headerTransparent: false,
          headerStyle: { backgroundColor: theme.glass.fillStrong },
          headerBlurEffect: theme.scheme === 'dark' ? 'dark' : 'light',
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ headerShown: true }} />
        <Stack.Screen name="grammar/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="review-manage" options={{ headerShown: true }} />
      </Stack>
      <AppSplash minDuration={MIN_SPLASH_MS} fadeDuration={500} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <SpeechConfigProvider>
        <SrsProvider>
          <ThemedStack />
        </SrsProvider>
      </SpeechConfigProvider>
    </LanguageProvider>
  );
}
