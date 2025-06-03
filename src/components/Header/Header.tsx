/* eslint-disable react-native/no-inline-styles */
import React, { ReactElement } from 'react'
import { TouchableOpacity, Text, View, ViewStyle, ColorValue } from 'react-native'
import { useTheme } from '../../hooks';
import { useNavigation } from '@react-navigation/native'

type Props = {
  goBackAction?: () => void,
  goBackData?: () => void,
  onPressBack?: () => void,
  title: string,
  centerHeader?: ReactElement,
  rightHeader?: ReactElement,
  style?: ViewStyle,
  isShowBack?: boolean,
  iconBack?: string,
  leftHeader?: ReactElement,
  leftIconColor?: ColorValue,
  widthLeft?: number,
  widthCenter?: number,
  widthRight?: number
};

const Header = ({
  goBackAction,
  goBackData,
  onPressBack,
  title,
  centerHeader,
  rightHeader,
  style,
  isShowBack,
  iconBack,
  leftHeader,
  leftIconColor,
  widthLeft,
  widthCenter,
  widthRight,
}: Props) => {
  const navigation = useNavigation()
  const { Common, Colors } = useTheme()
  const handleGoBack = () => {
    if (onPressBack) {
      onPressBack()
    } else {
      navigation.goBack()
    }
  }

  const styleLeft = [
    Common.header.headerLeft,
    widthLeft ? { width: widthLeft } : null,
  ]
  const styleCenter = [
    Common.header.headerCenter,
    widthCenter ? { width: widthCenter } : null,
  ]
  const styleRight = [
    Common.header.headerRight,
    widthRight ? { width: widthRight } : null,
  ]

  return (
    <View style={[Common.header.base, style, isShowBack && { paddingLeft: 0 }]}>
      <View style={styleLeft}>
        {isShowBack && (
          <TouchableOpacity onPress={handleGoBack} style={{ padding: 5 }}>
            <Text>Back</Text>
          </TouchableOpacity>
        )}
        {leftHeader}
      </View>
      <View style={styleCenter}>
        {title ? (
          <Text style={Common.header.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {centerHeader}
      </View>
      <View style={styleRight}>
        {rightHeader}
      </View>
    </View>
  );
};

Header.defaultProps = {
  title: "Home"
};

export default Header
