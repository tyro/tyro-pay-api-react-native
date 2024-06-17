/**
 * Demo App Page for Tyro Pay API React Native SDK
 *
 *
 * @format
 */

import { TyroProvider } from '@tyro/tyro-pay-api-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CheckOut from './Checkout';
import Store from './Store';
import { RootStackParamList } from './@types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Demo App
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Tyro Pay Demo</Text>
          </View>
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
                    merchantIdentifier: 'merchant.tyro-pay-api-sample-app',
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
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Store">
                  <Stack.Screen name="Store" component={Store} />
                  <Stack.Screen name="CheckOut" component={CheckOut} />
                </Stack.Navigator>
              </NavigationContainer>
            </TyroProvider>
          </View>
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
    padding: 0,
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
  box: {
    width: 40,
    height: 40,
    marginVertical: 20,
  },
});

export default App;
