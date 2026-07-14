import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setConnected } from '@/store/network';

/**
 * Global connectivity watcher (renders nothing).
 *
 * - Auto-detects internet status via NetInfo.
 * - Keeps the `network` redux slice in sync (used to block API requests while offline).
 * - Shows an alert when the connection drops and again when it is restored.
 *
 * Mount it once, near the root of the app (see App.tsx).
 * Pass `showAlerts={false}` to disable the connectivity popups.
 */
type Props = {
  showAlerts?: boolean;
};

const NetworkListener = ({ showAlerts = true }: Props) => {
  const { t } = useTranslation('network');
  const dispatch = useDispatch();

  // Assume online at startup so we don't alert on the very first event unless
  // the device is actually offline.
  const wasConnected = useRef<boolean>(true);
  const alerting = useRef<boolean>(false);

  useEffect(() => {
    // Base connectivity on `isConnected` (the network interface state): it flips
    // reliably when the device disconnects/reconnects. We intentionally do NOT
    // gate on `isInternetReachable` here — it is unreliable on iOS/Simulator and
    // often stays `false` after the network comes back, which would leave the
    // offline banner stuck on screen.
    const isOnline = (state: NetInfoState) => state.isConnected === true;

    const showAlert = (title: string, message: string) => {
      if (alerting.current) {
        return;
      }
      alerting.current = true;
      Alert.alert(title, message, [
        { text: t('ok'), onPress: () => (alerting.current = false) },
      ]);
    };

    const subscription = NetInfo.addEventListener(state => {
      const online = isOnline(state);
      dispatch(setConnected({ isConnected: online }));

      if (online === wasConnected.current) {
        return;
      }
      wasConnected.current = online;

      if (!showAlerts) {
        return;
      }
      if (online) {
        showAlert(t('restoredTitle'), t('restoredMessage'));
      } else {
        showAlert(t('offlineTitle'), t('offlineMessage'));
      }
    });

    return () => subscription();
  }, [dispatch, t, showAlerts]);

  return null;
};

export default NetworkListener;
