// new splash screen
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks';
import { Colors } from '@/theme/Variables';

const SplashScreen = () => {

    const { Layout } = useTheme();

    return (
        <View style={[Layout.fill, Layout.colCenter, { backgroundColor: Colors.white }]}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    )
}

export default SplashScreen;