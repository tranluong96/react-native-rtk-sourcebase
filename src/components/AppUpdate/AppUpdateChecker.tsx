import React, { useEffect, useMemo } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import checkVersion from 'react-native-store-version';
import { androidStoreURL, appStore, iosStoreURL, playStore } from '@/utils/configs/const';

interface AppUpdateCheckerProps {
  onError?: (error: any) => void;
}

const AppUpdateChecker: React.FC<AppUpdateCheckerProps> = ({ onError }) => {
  const country = DataHelpSingleton.getInstance().getCountryDevice();

  const renderURLStore = useMemo(() => {
    if (country === 'jp') {
      return iosStoreURL;
    } else {
      return iosStoreURL;
    }
  }, [country]);

  const checkAppVersion = async (versionCurrent: string) => {
    try {
      const iosStoreURL = renderURLStore;
      const check = await checkVersion({
        version: versionCurrent,
        iosStoreURL: iosStoreURL,
        androidStoreURL: androidStoreURL,
        country: country,
      });

      if (check.result === "new") {
        Alert.alert(
          "アプリアップデートのお願い",
          `最新バージョンをアップデートして\nご利用ください。`,
          [
            {
              text: "アップデート",
              onPress: openStoreUpdateAPP
            }
          ],
          {
            cancelable: false,
          }
        );
      }
    } catch (error) {
      onError?.(error);
    }
  };

  const openStoreUpdateAPP = async () => {
    try {
      const url = Platform.OS === "ios" ? appStore : playStore;
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    } catch (error) {
      onError?.(error);
    }
  };

  const checkForUpdates = async () => {
    try {
      const version = await DeviceInfo.getVersion();
      await checkAppVersion(version);
    } catch (error) {
      onError?.(error);
    }
  };

  useEffect(() => {
    checkForUpdates();
  }, []);

  return null;
};

export default AppUpdateChecker; 