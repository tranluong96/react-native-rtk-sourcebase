/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import { StyleSheet } from 'react-native';
import buttonStyles from './components/Buttons';
import headerStyles from './components/Header';
import inputStyles from './components/Input';
import ConfirmModalStyles from './components/ConfirmModal';
import ActionModalStyles from './components/ActionModal';
import { CommonParams } from '../../@types/theme';

export default function <C>({ Colors, ...args }: CommonParams<C>) {
  return {
    button: buttonStyles({ Colors, ...args }),
    header: headerStyles({ Colors, ...args }),
    input: inputStyles({ Colors, ...args }),
    confirmModal: ConfirmModalStyles({ Colors, ...args }),
    actionModal: ActionModalStyles({ Colors, ...args }),
    ...StyleSheet.create({
      backgroundPrimary: {
        backgroundColor: Colors.primary,
      },
      backgroundReset: {
        backgroundColor: Colors.transparent,
      },
      textInput: {
        backgroundColor: Colors.inputBackground,
        color: Colors.textGray400,
        height: 45,
        borderRadius: 10,
        paddingStart: 12,
      },
    }),
  };
}
