import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useLanguage } from '../../src/contexts/LanguageContext';

export default function TabLayout() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90D9',
        headerStyle: { backgroundColor: '#4A90D9' },
        headerTintColor: '#fff',
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginRight: 16 })}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabAlphabet'),
          tabBarLabel: t('tabAlphabet'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: t('tabReading'),
          tabBarLabel: t('tabReading'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="volume-high-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: t('tabVocabulary'),
          tabBarLabel: t('tabVocabulary'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
