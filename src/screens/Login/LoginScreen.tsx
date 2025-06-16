import React from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { ApplicationScreenProps } from 'types/navigation';
import { Header, Input } from '@/components';
import useTheme from '@/hooks/useTheme';
import { reduxStorage } from '@/store';
import { TYPE_CONSTANT } from '@/utils/configs/const';
import { navigateAndSimpleReset } from '@/navigators/navigate_ext';

const LoginScreen = ({ navigation }: ApplicationScreenProps) => {
  const {
    Gutters,
    Layout,
  } = useTheme();

  const renderRightHeader = () => {
    return <Text>Right menu 1</Text>
  }

  const renderleftHeader = () => {
    return <Text>Left menu 2</Text>
  }

  const login = async () => {
    await reduxStorage.setItem(TYPE_CONSTANT.SESSION, '123');
    navigateAndSimpleReset(navigation, 'Main');
  }

  return (
    <View style={Layout.fill}>
      <Header title='Login' rightHeader={renderRightHeader()} leftHeader={renderleftHeader()} />
      {/* <View style={{ height: "50%", width: "100%" }}>
        <WebView source={{ uri: 'https://www.google.com/' }} style={{ flex: 1 }} />
      </View> */}
      <View style={Gutters.smallHMargin}>
        <Input style={{ marginVertical: 10 }} />
        <Input style={{ marginVertical: 10 }} />
      </View>
      <Button
        title="Login"
        onPress={() => login()}
      />
    </View>
  );
};

export default LoginScreen;
