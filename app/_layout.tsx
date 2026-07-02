import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { SpeechConfigProvider } from '../src/contexts/SpeechConfigContext';
import { SrsProvider } from '../src/contexts/SrsContext';
import { useTheme } from '../src/constants/theme';

function ThemedStack() {
  const theme = useTheme();
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
