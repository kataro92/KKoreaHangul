import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SpeechConfigProvider } from '../src/contexts/SpeechConfigContext';

export default function RootLayout() {
  return (
    <SpeechConfigProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SpeechConfigProvider>
  );
}
