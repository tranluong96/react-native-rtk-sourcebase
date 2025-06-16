import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/hooks';
import { setDefaultTheme } from '@/store/theme';
import { ApplicationScreenProps } from 'types/navigation';
import { isNullOrEmpty } from '@/utils/functions';
import { reduxStorage } from '@/store';
import { TYPE_CONSTANT } from '@/utils/configs/const';
import { navigateAndSimpleReset } from '@/navigators/navigate_ext';

const Startup = ({ navigation }: ApplicationScreenProps) => {
  const { Layout, Gutters } = useTheme();

  const init = async () => {
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true);
      }, 2000),
    );
    await setDefaultTheme({ theme: 'default', darkMode: null });
    const json = await reduxStorage.getItem(TYPE_CONSTANT.SESSION);
    if (isNullOrEmpty(json)) {
      navigateAndSimpleReset(navigation, 'Login');
    } else {
      navigateAndSimpleReset(navigation, 'Main');
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
    </View>
  );
};

export default Startup;
