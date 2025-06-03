/* eslint-disable react-native/no-inline-styles */
import React, { ReactElement } from 'react'
import { TouchableOpacity, Text, View, ScrollView, ViewStyle, Modal } from 'react-native'
import { useTheme } from '../../hooks';

type Props = {
  isOpen?: boolean,
  title?: string,
  bodyActionModal?: ReactElement,
  footerActionModal?: ReactElement,
  useScrollView?: boolean,
  titleStyle?: ViewStyle,
  textOk?: string,
  textCancel?: string,
  isNotification?: string,
  bodyStyle?: ViewStyle,
  footerStyle?: ViewStyle,
  message?: string,
  isSuccess?: boolean,
  hiddenFooter?: boolean,
  onSave?: () => void,
  onCancel?: () => void
}
const ActionModal = ({
  isOpen,
  title,
  bodyActionModal,
  footerActionModal,
  onSave,
  onCancel,
  useScrollView,
  titleStyle,
  textOk,
  isNotification,
  bodyStyle,
  footerStyle,
  message,
  isSuccess,
  hiddenFooter,
  textCancel,

}: Props) => {
  const { Common, Layout, Colors, Gutters, MetricsSizes } = useTheme()

  const styleBody = [
    Common.actionModal.body,
    bodyStyle,
    isNotification && onSave
      ? { height: 80, ...Layout.justifyContentCenter }
      : null,
  ]
  const styleFooter = [Common.actionModal.footer, footerStyle]
  const styleTextCancel = [Common.actionModal.titleButton, { color: Colors.textGray800 }]
  const styleTextOk = [Common.actionModal.titleButton, { color: Colors.textGray800 }]
  const styleButtonSave = [
    Common.actionModal.buttonSave,
    isNotification && onSave
      ? { ...Layout.fullWidth, borderRightWidth: 0 }
      : null,
  ]

  const renderBody = () => {
    return (
      <View style={styleBody}>
        {useScrollView ? (
          <ScrollView>{bodyActionModal}</ScrollView>
        ) : bodyActionModal ? (
          bodyActionModal
        ) : (
          <View style={Layout.center}>
            <Text style={[Common.actionModal.message, Gutters.smallVMargin]}>
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
        {footerActionModal ? (
          footerActionModal
        ) : (
          <View style={Layout.row}>
            <View style={styleButtonSave}>
              <TouchableOpacity onPress={() => onSave && onSave()}>
                <Text style={styleTextOk}>{textOk ? textOk : "OK"}</Text>
              </TouchableOpacity>
            </View>
            <View style={Common.actionModal.buttonCancel}>
              <TouchableOpacity onPress={() => onCancel && onCancel()}>
                <Text style={styleTextCancel}>
                  {textCancel ? textCancel : "Cancel"}
                </Text>
              </TouchableOpacity>
            </View>
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
      <View style={Common.actionModal.base}>
        <View
          style={[Common.actionModal.content, hiddenFooter ? { paddingTop: 0 } : {}]}
        >
          {title ? <Text style={[titleStyle, { textAlign: 'center' }]}>{title}</Text> : null}
          {renderBody()}
          {!hiddenFooter && renderFooter()}
        </View>
      </View>
    </Modal>
  )
}

ActionModal.defaultProps = {
  isOpen: false,
};

export default ActionModal
