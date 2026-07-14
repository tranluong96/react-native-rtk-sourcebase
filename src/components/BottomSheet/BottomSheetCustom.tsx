import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
    BottomSheetView
} from '@gorhom/bottom-sheet';
import { HeaderHandle } from './components/HeaderHandler';
import { EBottomSheetType } from '@/utils/configs/enum';
import { Portal } from "@gorhom/portal";


interface IBackDropBTSheetProps {
    sheetRef: React.Ref<BottomSheet>;
    type: EBottomSheetType;
    children: React.ReactNode;
    enablePanDownToClose?: boolean;
    onChange?: (index: number) => void;
    isHideHeader?: boolean;
    isUseSnapPoints?: boolean;
    isBackDrop?: boolean;
    txtHeader?: string;
    onClose?: () => void;
}

const BottomSheetCustom = ({
    sheetRef,
    type = EBottomSheetType.DEFAULT,
    children,
    enablePanDownToClose = true,
    onChange,
    isHideHeader = false,
    isBackDrop = true,
    isUseSnapPoints = false,
    txtHeader = 'Bottomsheet Example',
    onClose,
}: IBackDropBTSheetProps) => {

    const [backdropPressBehavior, setBackdropPressBehavior] = useState<
        'none' | 'close' | 'collapse'
    >('collapse');

    // hooks
    const snapPoints = useMemo(() => isUseSnapPoints ? ['25%', '50%'] : ['50%'], [isUseSnapPoints]);

    // renders
    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop {...props} pressBehavior={backdropPressBehavior} />
        ),
        [backdropPressBehavior]
    );

    const renderHeaderHandle = useCallback(
        props => <HeaderHandle {...props} children={txtHeader} onClose={onClose} />,
        [txtHeader, onClose]
    );

    return (
        <Portal>
            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={enablePanDownToClose}
                onChange={onChange}
                index={-1}
                backdropComponent={isBackDrop ? renderBackdrop : undefined}
                handleComponent={isHideHeader ? null : renderHeaderHandle}
            >
                {type === EBottomSheetType.DEFAULT && (
                    <BottomSheetView>
                        {children}
                    </BottomSheetView>
                )}
                {type === EBottomSheetType.SCROLLVIEW && (
                    <BottomSheetScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 250 }}>
                        <View style={{ flex: 1 }}>
                            {children}
                        </View>
                    </BottomSheetScrollView>
                )}
            </BottomSheet>
        </Portal>
    );
};


export default BottomSheetCustom;