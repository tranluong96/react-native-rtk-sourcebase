import { StyleSheet } from 'react-native';
import { CommonParams } from '../../../@types/theme';

export default function <C>({ Colors, Gutters, Layout, FontSize }: CommonParams<C>) {
  const base = {
    ...Layout.rowCenter,
    ...Gutters.smallHPadding,
    height: 50,
    backgroundColor: Colors.primary,
  }
  return StyleSheet.create({
    base,
    headerLeft: {
      width: '20%',
      alignItems: 'flex-start',
      paddingLeft: 0,
    },
    headerCenter: {
      width: '60%',
    },
    headerRight: {
      width: '20%',
      alignItems: 'flex-end',
    },
    title: {
      fontSize: FontSize.small,
      textAlign: 'center',
      color: Colors.primaryText
    },
  })
}
