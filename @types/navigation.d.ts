import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps, StackNavigationOptions } from '@react-navigation/stack';

export type MainParamsList = {
  Home: undefined;
};

export type ApplicationStackParamList = {
  Startup: undefined;
  Example: undefined;
  Example2: undefined;
  BackdropExample: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
};

export type BottomTabNavigatorParamList = {
  Map: undefined;
  Notify: undefined;
  QR: undefined;
  Profile: undefined;
  Home: undefined
}

export type ApplicationScreenProps = CompositeNavigationProp<StackScreenProps<ApplicationStackParamList>, BottomTabNavigatorParamList>;





