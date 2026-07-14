import React from 'react';
import { View, Alert, Button, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useScreenRequest, useTheme } from '@/hooks';
import { useLazyFetchOneQuery } from '@/services/modules/users';
import { isCancelledError } from '@/services/cancellation';
import { getApiErrorMessage } from '@/utils/functions/api_error';
import { Header } from '@/components';
import { ApplicationScreenProps } from 'types/navigation';

const ProfileScreen = ({ navigation }: ApplicationScreenProps) => {
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
      // Cancelled by the user, or by leaving the tab: expected, not an error.
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
      <Header title={'Profile'} />

      <Button title="Fetch user" onPress={onFetchUser} disabled={isPending} />
      <Button title="Cancel request" onPress={cancelAll} disabled={!isPending} />

      {isPending ? (
        <View style={[Layout.rowCenter, Gutters.regularVMargin]}>
          <ActivityIndicator />
          <Text style={Gutters.smallLMargin}>Loading…</Text>
        </View>
      ) : null}

      <Button
        title="Go Transfer (upload / download)"
        onPress={() => navigation.navigate('Transfer')}
      />
      <Button
        title="Go Example2Screen"
        onPress={() => navigation.navigate('Example2')}
      />
    </View>
  );
};

export default ProfileScreen;
