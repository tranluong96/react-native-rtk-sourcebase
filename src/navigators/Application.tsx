import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { Example2Screen, LoginScreen, Startup } from '../screens';
import { useTheme } from '../hooks';
import MainNavigator from './Main';
import { ApplicationStackParamList } from '../../@types/navigation';
import moment from 'moment';
import { requestPermission } from '@/services/firebase/fcm_push_notification';

const Stack = createStackNavigator<ApplicationStackParamList>();

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    moment.locale("ja");
    requestPermission();
  }, []);

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: 'white' }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef} >
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          <Stack.Screen name="Startup" component={Startup} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name={'Example2'} component={Example2Screen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
