import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { HeaderHandle } from './components/HeaderHandler';

interface IBaseBTSheetProps {
  bottomSheetRef: React.Ref<BottomSheet>;
  children: React.ReactNode;
  onClose?: () => void;
  enablePanDownToClose?: boolean;
}

const BaseBTSheet = ({ children, bottomSheetRef, onClose, enablePanDownToClose }: IBaseBTSheetProps) => {
  // state
  const [backdropPressBehavior, setBackdropPressBehavior] = useState<
    'none' | 'close' | 'collapse'
  >('collapse');

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // renders
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop {...props} pressBehavior={backdropPressBehavior} />
    ),
    [backdropPressBehavior]
  );
  const renderHeaderHandle = useCallback(
    props => <HeaderHandle {...props} children="Backdrop Example" onClose={onClose} />,
    [onClose]
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={renderBackdrop}
      handleComponent={renderHeaderHandle}
    >
      <BottomSheetView>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

export default BaseBTSheet;