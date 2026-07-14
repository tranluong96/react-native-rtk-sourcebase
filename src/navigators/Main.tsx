import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NotifyScreen, MapScreen } from '../screens';
import { BottomTabNavigatorParamList } from '../../@types/navigation';
import { useSelector } from 'react-redux';
import { NotificationState } from '../store/notification';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeStackScreen, ProfileStackScreen } from './StackNavigatorMgmt';
import { FcmPushNotification } from '@/services/firebase/fcm_push_notification';
import { useTheme } from '@/hooks';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const TAB_ICONS: Record<keyof BottomTabNavigatorParamList, string> = {
  Home: '🏠',
  Map: '📍',
  Notify: '🔔',
  QR: '🔳',
  Profile: '🙂',
};

const MainNavigator = () => {
  const badgeAmount = useSelector(
    (state: { notification: NotificationState }) => state.notification.amountBadge,
  );
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <>
      <FcmPushNotification />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            { height: 60 + insets.bottom, paddingBottom: insets.bottom },
          ],
          tabBarItemStyle: styles.tabItem,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconPill, focused && styles.iconPillActive]}>
              <Text style={[styles.icon, !focused && styles.iconInactive]}>
                {TAB_ICONS[route.name]}
              </Text>
            </View>
          ),
          tabBarActiveTintColor: Colors.brand,
          tabBarInactiveTintColor: Colors.textGray200,
          tabBarBadgeStyle: styles.badge,
        })}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen
          name="Notify"
          component={NotifyScreen}
          options={{ tabBarBadge: badgeAmount > 0 ? badgeAmount : undefined }}
        />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </>
  );
};

const getStyles = (Colors: ReturnType<typeof useTheme>['Colors']) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: Colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      elevation: 0,
    },
    tabItem: {
      paddingTop: 8,
    },
    tabLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 2,
    },
    iconPill: {
      width: 46,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPillActive: {
      backgroundColor: Colors.brandSoft,
    },
    icon: {
      fontSize: 17,
    },
    iconInactive: {
      opacity: 0.45,
    },
    badge: {
      backgroundColor: Colors.error,
      color: Colors.white,
      fontSize: 10,
      fontWeight: '700',
    },
  });

export default MainNavigator;
