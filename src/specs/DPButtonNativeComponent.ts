import type { HostComponent, ViewProps } from 'react-native';
import type { BubblingEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type OnPressEvent = {};

export interface NativeProps extends ViewProps {
  title: string;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  onPress?: BubblingEventHandler<OnPressEvent>;
}

export default codegenNativeComponent<NativeProps>(
  'DPButton'
) as HostComponent<NativeProps>; 