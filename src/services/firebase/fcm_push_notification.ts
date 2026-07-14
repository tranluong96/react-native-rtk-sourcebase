import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging, {
    getMessaging,
    getToken,
    onMessage,
    onNotificationOpenedApp,
    onTokenRefresh,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import notifee, {
    AndroidImportance,
    AuthorizationStatus,
    EventType,
} from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';

import { reduxStorage } from '@/store';
import { TYPE_CONSTANT } from '@/utils/configs/const';
import { isNullOrEmpty } from '@/utils/functions';
import { navigate, navigateAndSimpleReset } from '@/navigators/navigate_ext';

let previousMessageId: string | undefined;

export const FcmPushNotification = () => {
    const navigation = useNavigation();
    const messagingInstance = getMessaging(getApp());

    useEffect(() => {
        initNotifications();
    }, []);

    const initNotifications = async () => {
        await createNotificationChannel();
        registerFCMListeners();
        registerBackgroundMessageHandler();
        handleNotificationTap();
    };

    const createNotificationChannel = async () => {
        if (Platform.OS === 'android') {
            await notifee.createChannel({
                id: TYPE_CONSTANT.ANDROID_CHANNEL_ID,
                name: TYPE_CONSTANT.ANDROID_CHANNEL_NAME,
                importance: AndroidImportance.HIGH,
                vibration: true,
                sound: 'default',
            });
            console.log('✅ Notifee channel created:', TYPE_CONSTANT.ANDROID_CHANNEL_ID);
        }
    };

    const registerFCMListeners = () => {
        onMessage(messagingInstance, async remoteMessage => {
            if (!remoteMessage || previousMessageId === remoteMessage.messageId) return;
            previousMessageId = remoteMessage.messageId;

            console.log('🔴 Foreground message:', remoteMessage);

            await displayNotification(remoteMessage);

            onSetStatusNotification(remoteMessage);
        });

        onTokenRefresh(messagingInstance, newToken => {
            console.log('🔄 Token refreshed:', newToken);
            reduxStorage.setItem(TYPE_CONSTANT.DEVICE_TOKEN, newToken);
        });
    };

    const registerBackgroundMessageHandler = () => {
        messagingInstance.setBackgroundMessageHandler(async remoteMessage => {
            console.log('🔵 Background message:', remoteMessage);
            await displayNotification(remoteMessage);
        });
    };

    const handleNotificationTap = () => {
        onNotificationOpenedApp(messagingInstance, remoteMessage => {
            console.log('✅ [Background Tap]:', remoteMessage);
            if (remoteMessage?.data) onOpenNotification(remoteMessage.data);
        });

        messagingInstance.getInitialNotification().then(remoteMessage => {
            console.log('✅ [Quit Tap]:', remoteMessage);
            if (remoteMessage?.data) onOpenNotification(remoteMessage.data);
        });

        notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS && detail.notification?.data) {
                onOpenNotification(detail.notification.data);
            }
        });

        notifee.onBackgroundEvent(async ({ type, detail }) => {
            if (type === EventType.PRESS && detail.notification?.data) {
                onOpenNotification(detail.notification.data);
            }
        });
    };

    const displayNotification = async (remoteMessage: any) => {
        const title =
            remoteMessage.data?.title ||
            remoteMessage.notification?.title ||
            'No title';
        const body =
            remoteMessage.data?.body ||
            remoteMessage.notification?.body ||
            'No body';

        await notifee.displayNotification({
            title,
            body,
            android: {
                channelId: TYPE_CONSTANT.ANDROID_CHANNEL_ID,
                pressAction: {
                    id: 'default',
                },
            },
            ios: {
                sound: 'default',
            },
            data: remoteMessage.data ?? {},
        });
    };

    const onSetStatusNotification = (data: any) => {
        console.log('✅ New Notification Status:', data);
    };

    const onOpenNotification = async (data: any) => {
        console.log('✅ Handling open notification with data:', data);
        const json = await reduxStorage.getItem(TYPE_CONSTANT.SESSION);
        if (isNullOrEmpty(json)) {
            navigateAndSimpleReset(navigation, 'Login');
        } else {
            navigate(navigation, 'Example2');
        }
    };

    return null;
};

// -------------------------

export const requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
    }
    const settings = await notifee.requestPermission();
    console.log('🔑 Notifee permission:', settings.authorizationStatus);
    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        // getDeviceToken();
    }
};

export const getDeviceToken = async () => {
    try {
        const token = await getToken(getMessaging(getApp()));
        console.log('📲 FCM Token:', token);
        reduxStorage.setItem(TYPE_CONSTANT.DEVICE_TOKEN, token);
        return token;
    } catch (err) {
        console.error('❌ getDeviceToken error:', err);
        return '';
    }
};

// -------------------------

export const clearAllNotificationsLocal = async () => {
    await notifee.cancelAllNotifications();
    console.log('✅ All local notifications cleared');
};

export const deleteDeviceToken = async () => {
    const messagingInstance = getMessaging(getApp());
    await messagingInstance.deleteToken();
    await reduxStorage.removeItem(TYPE_CONSTANT.DEVICE_TOKEN);
    console.log('✅ Device token deleted');
};
