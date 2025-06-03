import { StyleSheet } from 'react-native';
import { CommonParams } from '../../../@types/theme';
import { MetricsSizes } from '../Variables';

export default function <C>({ Colors, Gutters, FontSize }: CommonParams<C>) {
  const baseText = {
    fontSize: FontSize.small,
    color: Colors.primaryText,
  }

  return StyleSheet.create({
    baseText,
    base: {
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: Colors.white,
      borderColor: Colors.textGray200,
      borderRadius: 5,
      height: MetricsSizes.small * 2,
      width: '100%',
      ...Gutters.smallLPadding,
      ...Gutters.tinyVMargin,
      ...baseText,
    },
    disabled: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.textGray200,
      borderRadius: 5,
      height: MetricsSizes.small * 2,
      width: '100%',
      ...Gutters.smallLPadding,
      ...Gutters.tinyVMargin,
      ...baseText,
      backgroundColor: Colors.textGray200,
    },
    toggle: {
      position: 'absolute',
      alignItems: 'center',
      // justifyContent: 'center',
      width: MetricsSizes.small * 3,
      height: MetricsSizes.small * 7,
      borderRadius: MetricsSizes.small,
      right: 0,
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
      ...Gutters.smallTPadding,
    },
    toggleLeft: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: MetricsSizes.small * 3,
      height: MetricsSizes.small * 7,
      borderRadius: MetricsSizes.small,
      left: 0,
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
      ...Gutters.smallTPadding,
      top: -15,
    },
  })
}
