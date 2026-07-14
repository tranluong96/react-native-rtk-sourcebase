import React from 'react';
import { View, Alert, Button, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useScreenRequest, useTheme } from '@/hooks';
import { useLazyFetchOneQuery } from '@/services/modules/users';
import { isCancelledError } from '@/services/cancellation';
import { getApiErrorMessage } from '@/utils/functions/api_error';
import { Header } from '@/components';

const NotifyScreen = () => {
  const { t } = useTranslation(['example', 'welcome']);
  const { Layout, Gutters } = useTheme();

  // Aborts whatever is still in flight when this tab loses focus or unmounts.
  const { run, cancelAll, isPending } = useScreenRequest();
  const [fetchOne] = useLazyFetchOneQuery();

  const onFetchUser = async () => {
    try {
      const user = await run(fetchOne('1')).unwrap();
      Alert.alert(t('example:helloUser', { name: user.name }));
    } catch (error) {
      // The user cancelled, or they switched tab. Nothing failed, so there is
      // nothing to report: an alert here would blame them for their own action.
      if (isCancelledError(error)) {
        return;
      }
      const message = getApiErrorMessage(error);
      if (message) {
        Alert.alert(message);
      }
    }
  };

  return (
    <View style={Layout.fill}>
      <Header title={'Notify'} />

      <Button title="Fetch user" onPress={onFetchUser} disabled={isPending} />
      <Button title="Cancel request" onPress={cancelAll} disabled={!isPending} />

      {isPending ? (
        <View style={[Layout.rowCenter, Gutters.regularVMargin]}>
          <ActivityIndicator />
          <Text style={Gutters.smallLMargin}>Loading…</Text>
        </View>
      ) : null}
    </View>
  );
};

export default NotifyScreen;
