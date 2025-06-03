import { Dimensions, StyleSheet } from 'react-native';
import { CommonParams } from '../../../@types/theme';
import { FontSize, MetricsSizes } from '../Variables';

export default function <C>({ Colors, Gutters, FontSize, Layout }: CommonParams<C>) {
  const { width } = Dimensions.get('screen')

  const baseContent = {
    margin: MetricsSizes.regular + 5,
    borderRadius: MetricsSizes.small,
    backgroundColor: Colors.white,
    shadowColor: Colors.textGray800,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: MetricsSizes.tiny,
  }

  return StyleSheet.create({
    base: {
      ...Layout.fill,
      ...Layout.center,
      ...Gutters.regularTMargin,
    },
    content: {
      ...baseContent,
      ...Gutters.smallTPadding,
      width: '90%',
    },
    body: {
      ...Gutters.smallVMargin,
      ...Gutters.tinyHPadding,
      maxHeight: '80%',
    },
    footer: {
      ...Layout.center,
      ...Gutters.regularHPadding,
      height: 40,
      borderTopWidth: 0.2,
      borderTopColor: Colors.textGray200,
    },
    buttonSave: {
      width: '100%',
      height: 40,
    },

    titleButton: {
      fontSize: FontSize.small,
      fontWeight: 'bold',
    },
    message: {
      textAlign: 'center',
      fontSize: FontSize.small,
      color: Colors.textGray800
    },
  })
}
