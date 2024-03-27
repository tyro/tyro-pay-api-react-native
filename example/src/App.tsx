/**
 * Demo App Page for Tyro Pay API React Native SDK
 *
 *
 * @format
 */

import { TyroProvider } from '@tyro/tyro-pay-api-react-native';
import CheckOut from './checkout';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// Demo App
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView>
        <View style={styles.container}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Demo Checkout</Text>
          </View>
          {/* Content */}
          <View style={styles.contentContainer}>
            <TyroProvider
              options={{
                liveMode: false,
                options: {
                  googlePay: {
                    enabled: true,
                    merchantName: 'Example Merchant',
                  },
                  applePay: {
                    enabled: true,
                  },
                },
                styleProps: {
                  fontFamily: 'roboto',
                  googlePayButton: {
                    buttonColor: 'black',
                    buttonType: 'pay',
                    buttonBorderRadius: 4,
                  },
                },
              }}
            >
              <CheckOut />
            </TyroProvider>
          </View>
          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Tyro Pay API React Native SDK</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
