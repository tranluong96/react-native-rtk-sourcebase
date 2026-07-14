import DPButtonNativeComponent, { NativeProps } from '@/specs/DPButtonNativeComponent';
import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface DPButtonProps extends Omit<NativeProps, 'style'> {
  style?: StyleProp<ViewStyle>;
}

const DPButton: React.FC<DPButtonProps> = ({ title, color, backgroundColor, disabled, onPress, style, ...rest }) => {
  return (
    <DPButtonNativeComponent
      title={title}
      color={color}
      backgroundColor={backgroundColor}
      disabled={disabled}
      onPress={onPress}
      style={style}
      {...rest}
    />
  );
};

export default DPButton; 