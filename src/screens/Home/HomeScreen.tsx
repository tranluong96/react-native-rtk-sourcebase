import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks';
import { decrementBadge, incrementBadge } from '@/store/notification';
import { Header, Input, ConfirmModal, ActionModal, BaseBTSheet } from '@/components';
import { ApplicationScreenProps } from 'types/navigation';
import { BottomSheetCustom } from '@/components/BottomSheet';
import { EBottomSheetType } from '@/utils/configs/enum';
import { K_SCREEN_HEIGHT } from '@/utils/configs/screens';


const HomeScreen = ({ navigation }: ApplicationScreenProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isOpenAction, setIsOpenAction] = useState<boolean>(false)
  const {
    Layout,
  } = useTheme();
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<BottomSheetModal>(null);


  const renderRightHeader = () => {
    return <Text>Right menu</Text>
  }

  const handleIncrementBadge = () => {
    dispatch(incrementBadge({ amountBadge: 22 }))
  }

  const handleDecrementBadge = () => {
    dispatch(decrementBadge())
  }

  const renderleftHeader = () => {
    return <Text>Left menu</Text>
  }

  return (
    <View style={Layout.fill}>
      <Header title='Home' rightHeader={renderRightHeader()} leftHeader={renderleftHeader()} />
      <Input />
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile", { message: "Message from Home" })}
      />
      <Button
        title="Open Modal Confirm"
        onPress={() => setIsOpen(true)}
      />
      <Button
        title="Open Modal Action"
        onPress={() => setIsOpenAction(true)}
      />
      <Button
        title="Open Bottomsheet"
        onPress={() => {
          if (bottomSheetRef.current) {
            bottomSheetRef.current.expand();
          } else {
            console.log("bottomSheetRef.current is null");
          }
        }}
      />
      <Button
        title="Close Bottomsheet"
        onPress={() => bottomSheetRef.current?.close()}
      />
      <Button
        title="Increment Badge"
        onPress={() => handleIncrementBadge()}
      />
      <Button
        title="Decrement Badge"
        onPress={() => handleDecrementBadge()}
      />

      <ConfirmModal
        isOpen={isOpen}
        title='Confirm Modal'
        onSave={() => setIsOpen(false)}
        message='Show modal confirm'
      />
      <ActionModal
        isOpen={isOpenAction}
        title='Action Modal'
        onSave={() => setIsOpenAction(false)}
        onCancel={() => setIsOpenAction(false)}
        message='Show modal Action'
      />
      <BaseBTSheet
        bottomSheetRef={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
        children={<View style={[Layout.fill, { height: K_SCREEN_HEIGHT / 2 }]}>
          <Text>Hello</Text>
        </View>}
      />
    </View>
  );
};

export default HomeScreen;
