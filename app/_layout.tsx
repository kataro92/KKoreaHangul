import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { SpeechConfigProvider } from '../src/contexts/SpeechConfigContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <SpeechConfigProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#4A90D9' },
              headerTintColor: '#fff',
            }}
          />
        </Stack>
      </SpeechConfigProvider>
    </LanguageProvider>
  );
}
