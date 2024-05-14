import React from 'react';
import { Modal, Dimensions, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSDK } from '../SDKSharedContext';

const { height, width } = Dimensions.get('window');

export const ThreeDSWebview = (): JSX.Element => {
  const { threeDSCheck } = useSDK();

  return (
    <Modal visible={threeDSCheck.isTrue}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <WebView
          source={{
            uri: threeDSCheck.url,
          }}
          style={{ marginTop: 20, height, width }}
          useWebView2={true}
          javaScriptEnabled={true}
        />
      </SafeAreaView>
    </Modal>
  );
};
