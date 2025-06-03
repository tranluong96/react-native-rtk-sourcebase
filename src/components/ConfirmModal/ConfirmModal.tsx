/* eslint-disable react-native/no-inline-styles */
import useTheme from '@/hooks/useTheme'
import React, { ReactElement } from 'react'
import { TouchableOpacity, Text, View, ScrollView, ViewStyle, Modal } from 'react-native'

type Props = {
  isOpen?: boolean,
  title?: string,
  bodyconfirmModal?: ReactElement,
  footerconfirmModal?: ReactElement,
  useScrollView?: boolean,
  titleStyle?: ViewStyle,
  textOk?: string,
  isNotification?: string,
  bodyStyle?: ViewStyle,
  footerStyle?: ViewStyle,
  message?: string,
  isSuccess?: boolean,
  hiddenFooter?: boolean,
  onSave?: () => void,
}
const ConfirmModal = ({
  isOpen,
  title,
  bodyconfirmModal,
  footerconfirmModal,
  onSave,
  useScrollView,
  titleStyle,
  textOk,
  isNotification,
  bodyStyle,
  footerStyle,
  message,
  isSuccess,
  hiddenFooter,
}: Props) => {
  const { Common, Layout, Colors, Gutters, MetricsSizes } = useTheme()

  const styleBody = [
    Common.confirmModal.body,
    bodyStyle,
    isNotification && onSave
      ? { height: 80, ...Layout.justifyContentCenter }
      : null,
  ]
  const styleFooter = [Common.confirmModal.footer, footerStyle]
  const styleTextOk = [Common.confirmModal.titleButton, { color: Colors.textGray800 }]
  const styleButtonSave = [
    Common.confirmModal.buttonSave,
    isNotification && onSave
      ? { ...Layout.fullWidth, borderRightWidth: 0 }
      : null,
  ]

  const renderBody = () => {
    return (
      <View style={styleBody}>
        {useScrollView ? (
          <ScrollView>{bodyconfirmModal}</ScrollView>
        ) : bodyconfirmModal ? (
          bodyconfirmModal
        ) : (
          <View style={Layout.center}>
            <Text style={[Common.confirmModal.message, Gutters.smallVMargin]}>
              {message}
            </Text>
          </View>
        )}
      </View>
    )
  }

  const renderFooter = () => {
    return (
      <View style={styleFooter}>
        {footerconfirmModal ? (
          footerconfirmModal
        ) : (
          <View style={[styleButtonSave, Layout.center]}>
            <TouchableOpacity onPress={() => onSave && onSave()}>
              <Text style={styleTextOk}>{textOk ? textOk : "OK"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
    >
      <View style={Common.confirmModal.base}>
        <View
          style={[Common.confirmModal.content, hiddenFooter ? { paddingTop: 0 } : {}]}
        >
          {title ? <Text style={[titleStyle, { textAlign: 'center' }]}>{title}</Text> : null}
          {renderBody()}
          {!hiddenFooter && renderFooter()}
        </View>
      </View>
    </Modal>
  )
}

ConfirmModal.defaultProps = {
  isOpen: false,
};

export default ConfirmModal
