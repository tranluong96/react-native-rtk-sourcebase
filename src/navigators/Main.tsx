import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NotifyScreen, MapScreen } from '../screens';
import { BottomTabNavigatorParamList } from '../../@types/navigation';
import { useSelector } from 'react-redux';
import { NotificationState } from '../store/notification';
import { View } from 'react-native';
import { HomeStackScreen, ProfileStackScreen } from './StackNavigatorMgmt';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const MainNavigator = () => {
  const badgeAmount = useSelector((state: { notification: NotificationState }) => state.notification.amountBadge)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
        },
        tabBarIcon: ({
          color, size
        }) => {
          let iconName
          if (route.name == 'Home') {
            iconName = 'home'
          } else if (route.name == 'Notify') {
            iconName = 'notifications'
          } else if (route.name == 'Profile') {
            iconName = "person-circle"
          } else {
            iconName = "location"
          }
          return <View />;
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray"
      })}>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Notify" component={NotifyScreen} options={{ tabBarBadge: badgeAmount }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
