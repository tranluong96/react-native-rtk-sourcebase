import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Example2Screen, ExampleScreen, HomeScreen, ProfileScreen } from '../screens';
import { ApplicationScreenProps } from '../../@types/navigation';

const HomeStack = createStackNavigator<ApplicationScreenProps>();
const ProfileStack = createStackNavigator<ApplicationScreenProps>();

export const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name={'RootHome'} component={HomeScreen} />
            <HomeStack.Screen name={'Example'} component={ExampleScreen} />
        </HomeStack.Navigator>
    )
}

export const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name={'RootProfile'} component={ProfileScreen} />
            <ProfileStack.Screen name={'Example2'} component={Example2Screen} />
        </ProfileStack.Navigator>
    )
}
