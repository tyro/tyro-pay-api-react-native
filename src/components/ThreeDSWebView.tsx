import React from 'react';
import { Modal, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useSDK } from '../SDKSharedContext';
import { Colors } from '../@types/colors';

const { height, width } = Dimensions.get('window');

export const ThreeDSWebview = (): JSX.Element => {
  const { threeDSCheck } = useSDK();

  return (
    <Modal visible={threeDSCheck.isTrue}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.transparent }}>
          <WebView
            source={{
              uri: threeDSCheck.url,
            }}
            style={{ marginTop: 20, height, width }}
            useWebView2={true}
            javaScriptEnabled={true}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
