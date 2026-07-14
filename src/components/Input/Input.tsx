import React, { ReactElement, Ref, useState } from 'react'
import { View, TextInput, TextInputProps, TouchableOpacity, ViewStyle, ColorValue, TextStyle } from 'react-native'
import { useTheme } from '../../hooks';

type Props = Omit<TextInputProps, 'style' | 'multiline' | 'editable' | 'onSubmitEditing'> & {
  rightLabel?: ReactElement,
  rightStyle?: ViewStyle,
  rightIconStyle?: ViewStyle,
  rightIconColor?: ColorValue,
  email?: any,
  phone?: any,
  number?: any,
  secure?: boolean,
  style?: TextStyle,
  inputRef?: React.RefObject<any>,
  multiline?: boolean,
  onSubmitEditing?: () => void,
  onRightPress?: () => void,
  error?: any,
  editable?: boolean,
  leftLabel?: ReactElement,
  onLeftPress?: () => void,
  leftStyle?: ViewStyle,
}
const Input = ({
  secure = false,
  editable = true,
  error,
  leftLabel,
  multiline = false,
  email,
  number,
  phone,
  rightLabel,
  rightStyle,
  rightIconColor,
  rightIconStyle,
  leftStyle,
  inputRef,
  style,
  onRightPress,
  onSubmitEditing,
  onLeftPress, ...props }: Props) => {
  const [toggleSecure, setToggleSecure] = useState(false)
  const { Common, Colors, FontSize, Gutters } = useTheme()

  const isSecure = toggleSecure ? false : secure
  const inputStyles = [
    Common.input.base,
    error && { borderColor: Colors.error },
    multiline && { textAlignVertical: 'top' },
    editable === false && Common.input.disabled,
    leftLabel && { ...Gutters.largeLPadding },
    style,
  ]

  const inputType = email
    ? 'email-address'
    : number
      ? 'numeric'
      : phone
        ? 'phone-pad'
        : 'default'

  const renderToggle = () => {
    if (!secure) {
      return null
    }

    return (
      <TouchableOpacity
        style={[Common.input.toggle, rightStyle]}
        onPress={() => setToggleSecure(!toggleSecure)}
      >
        {rightLabel ? (
          rightLabel
        ) : (
          <View />
        )}
      </TouchableOpacity>
    )
  }
  const renderLeft = () => {
    if (!leftLabel) {
      return null
    }

    return (
      <TouchableOpacity
        style={[Common.input.toggleLeft, leftStyle]}
        onPress={() => onLeftPress && onLeftPress()}
        disabled={onLeftPress != undefined ? false : true}
      >
        {leftLabel}
      </TouchableOpacity>
    )
  }

  const renderRight = () => {
    if (!rightLabel) {
      return null
    }

    return (
      <TouchableOpacity
        style={[Common.input.toggle, rightStyle]}
        onPress={() => onRightPress && onRightPress()}
        disabled={onRightPress != undefined ? false : true}
      >
        {rightLabel}
      </TouchableOpacity>
    )
  }

  return (
    <View>
      {renderLeft()}
      <TextInput
        ref={inputRef}
        style={inputStyles}
        secureTextEntry={isSecure}
        autoComplete="off"
        autoCapitalize="none"
        multiline={multiline}
        autoCorrect={false}
        keyboardType={inputType}
        placeholderTextColor={Colors.textGray200}
        onSubmitEditing={onSubmitEditing}
        {...props}
      />
      {renderToggle()}
      {renderRight()}
    </View>
  )
}


Input.defaultProps = {
};

export default Input
