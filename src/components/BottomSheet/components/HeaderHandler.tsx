import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  BottomSheetHandle,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks';

interface HeaderHandleProps extends BottomSheetHandleProps {
  children?: string | React.ReactNode | React.ReactNode[];
  onClose?: () => void;
}

const HeaderHandleComponent = ({ children, onClose, ...rest }: HeaderHandleProps) => {
  const { Layout } = useTheme();
  return (
    <BottomSheetHandle
      style={styles.container}
      indicatorStyle={styles.indicator}
      {...rest}
    >
      <View style={[Layout.row, Layout.justifyContentBetween, Layout.alignItemsCenter]}>
        {typeof children === 'string' ? (
          <Text style={styles.title}>{children}</Text>
        ) : (
          children
        )}
        {/* close button */}
        <TouchableOpacity onPress={onClose}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>

    </BottomSheetHandle>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.075)',
    zIndex: 99999,
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  indicator: {
    height: 4,
    opacity: 0.5,
  },
});

export const HeaderHandle = memo(HeaderHandleComponent);