import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { BlurFill } from './BlurFill';

const TAB_ICON_SIZE = 22;

/** Extra bottom space on web (Chrome device toolbar has no safe-area inset). */
const WEB_BOTTOM_PAD = 16;
const TAB_ROW_MIN_HEIGHT = 54;

export function useTabBarOffset(): number {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'web' ? WEB_BOTTOM_PAD : 0);
  return TAB_ROW_MIN_HEIGHT + bottomPad;
}

export function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'web' ? WEB_BOTTOM_PAD : 0);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      <BlurFill borderTop />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? theme.colors.primary : theme.colors.textSecondary;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const badge = options.tabBarBadge;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            >
              <View style={styles.iconWrap}>
                {options.tabBarIcon?.({ focused, color, size: TAB_ICON_SIZE }) ?? (
                  <Ionicons name="ellipse-outline" size={TAB_ICON_SIZE} color={color} />
                )}
                {badge != null ? (
                  <View style={[styles.badge, { backgroundColor: theme.colors.danger }]}>
                    <Text style={styles.badgeText}>{String(badge)}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: TAB_ROW_MIN_HEIGHT,
    paddingTop: 8,
    overflow: 'visible',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
    paddingBottom: 4,
    overflow: 'visible',
    ...(Platform.OS === 'web' ? { minHeight: TAB_ROW_MIN_HEIGHT } : null),
  },
  itemPressed: {
    opacity: 0.75,
  },
  iconWrap: {
    width: 28,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'center',
    width: '100%',
    ...(Platform.OS === 'web'
      ? {
          overflow: 'visible',
          paddingBottom: 2,
        }
      : Platform.OS === 'android'
        ? { includeFontPadding: false }
        : null),
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});
