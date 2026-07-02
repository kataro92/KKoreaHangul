import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useSrs } from '../../src/contexts/SrsContext';
import { useTheme } from '../../src/constants/theme';
import { BlurFill } from '../../src/components/glass/BlurFill';

export default function TabLayout() {
  const router = useRouter();
  const { t } = useLanguage();
  const { stats } = useSrs();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerTransparent: false,
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { color: theme.colors.text, fontWeight: '700' },
        headerShadowVisible: false,
        headerBackground: () => <BlurFill borderBottom />,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground: () => <BlurFill borderTop />,
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginRight: 16 })}
          >
            <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabAlphabet'),
          tabBarLabel: t('tabAlphabet'),
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: t('tabReading'),
          tabBarLabel: t('tabReading'),
          tabBarIcon: ({ color, size }) => <Ionicons name="volume-high-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="grammar"
        options={{
          title: t('tabGrammar'),
          tabBarLabel: t('tabGrammar'),
          tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: t('tabVocabulary'),
          tabBarLabel: t('tabVocabulary'),
          tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: t('tabReview'),
          tabBarLabel: t('tabReview'),
          tabBarBadge: stats.due > 0 ? stats.due : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="repeat-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
