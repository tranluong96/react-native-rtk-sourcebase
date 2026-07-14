import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

import { Header } from '@/components';
import { useFileTransfer, useTheme } from '@/hooks';
import {
  DEMO_DOWNLOAD_URL,
  DEMO_UPLOAD_FILE,
  DEMO_UPLOAD_URL,
} from '@/utils/configs/const';

const percent = (progress: number) => `${Math.round(progress * 100)}%`;

const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.track}>
    <View style={[styles.bar, { width: `${Math.min(progress, 1) * 100}%` }]} />
  </View>
);

/**
 * Upload and download, each cancellable mid-flight.
 *
 * Cancelling stops the bytes on the wire; it does not raise an error, so the
 * screen shows "Cancelled" and never an alert.
 */
const TransferScreen = () => {
  const { Layout, Gutters } = useTheme();

  const upload = useFileTransfer('demo-upload');
  const download = useFileTransfer('demo-download');

  const onUpload = async () => {
    const result = await upload.upload({
      url: DEMO_UPLOAD_URL,
      file: DEMO_UPLOAD_FILE,
    });

    if (result.status === 'error') {
      Alert.alert(result.message);
    }
    // 'cancelled' falls through silently: the user asked for it.
  };

  const onDownload = async () => {
    const result = await download.download({ url: DEMO_DOWNLOAD_URL });

    if (result.status === 'error') {
      Alert.alert(result.message);
    }
    if (result.status === 'success') {
      Alert.alert(`Downloaded ${result.data.size} bytes`);
    }
  };

  return (
    <View style={Layout.fill}>
      <Header title={'Transfer'} />

      <View style={Gutters.regularVMargin}>
        <Text>Upload — {upload.status}</Text>
        <ProgressBar progress={upload.progress} />
        <Text>{percent(upload.progress)}</Text>
        <Button title="Start upload" onPress={onUpload} />
        <Button
          title="Cancel upload"
          onPress={upload.cancel}
          disabled={!upload.isRunning}
        />
      </View>

      <View style={Gutters.regularVMargin}>
        <Text>Download — {download.status}</Text>
        <ProgressBar progress={download.progress} />
        <Text>{percent(download.progress)}</Text>
        <Button title="Start download" onPress={onDownload} />
        <Button
          title="Cancel download"
          onPress={download.cancel}
          disabled={!download.isRunning}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginVertical: 8,
  },
  bar: {
    height: '100%',
    backgroundColor: 'green',
  },
});

export default TransferScreen;
