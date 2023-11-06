# Quick Start Guide - Accepting a Payment

Details for how to accept a payment using Tyro's Pay API
and React Native SDK is detailed here with step by step instructions.

Please also refer to our [example-app](https://github.com/tyro/tyro-pay-api-react-native-example-app)

# 1. Setup

Complete any prerequisites required for using the TyroSDK
and Apple and Google pay, including setting up your
server for integration with Tyro's Pay API and
installing the Tyro React Native SDK in your app

## Prerequisites

The following is required to enable the use of Apple Pay in your app:

- Apple [Merchant Identifier](https://developer.apple.com/help/account/configure-app-capabilities/configure-apple-pay#create-a-merchant-identifier)
- Create a [payment processing certificate](https://developer.apple.com/help/account/configure-app-capabilities/configure-apple-pay#create-a-payment-processing-certificate)
- Enable Apple Pay capability in [Xcode](https://developer.apple.com/documentation/passkit/apple_pay/setting_up_apple_pay#3735190)

## Server-Side

When a customer loads your checkout page, a request with the order information
should be immediately sent to your sever. Your server should calculate the
total of the order and send this total to Tyro when creating a Pay Request.
The Pay Request along with the Pay Secret should be returned to your checkout page.

```javascript
// Node sample code
const express = require('express');
const app = express();
const axios = require('axios');

app.post('/create-order', async (req, res) => {
  const { items } = req.body;
  const totalAmountInCents = calculateTotal(items);

  // Create a Pay Request with the calculated total amount
  const payRequest = await axios.post(
    'https://api.tyro.com/connect/pay/requests',
    {
      locationId: 'tc-examplelocation-3000',
      provider: {
        name: 'TYRO',
        method: 'CARD',
      },
      origin: {
        orderId: 'order123',
      },
      total: {
        amount: totalAmountInCents,
        currency: 'AUD',
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer exampleJwt',
      },
    }
  );

  res.send({
    paySecret: payRequest.paySecret,
  });
});
```

## Client-Side

### Installation of TyroSDK

Create GitHub PAT (Personal Access Token)

Steps to setup the PAT:

- Navigate to GitHub page, **Profile** -> **Settings** -> **Developer Settings**
- On the left panel, select **Personal Access Token** -> **Token(classic)**
- Generate a new token with `read:package` permission

Next, create a .npmrc file and be sure to use the PAT
where it says `YOUR_GITHUB_PACKAGES_TOKEN` in the example below.

For additional information around creating a PAT see this [guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)

```javascript
@tyro:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${YOUR_GITHUB_PACKAGES_TOKEN}
```

install the Tyro React Native SDK in your project's directory
according to the package manager you use.

```npm
npm install @tyro/tyro-pay-api-react-native
```

```yarn
yarn add @tyro/tyro-pay-api-react-native
```

### Install iOS dependencies

```terminal
// navigate to your ios directory to install dependencies
pod install
```

### Google Pay Enablement

The following is required to enable the use of Google Pay in your app:

```java
// Add to the <application> element of your projects AndroidManifest.xml
<meta-data
  android:name="com.google.android.gms.wallet.api.enabled"
  android:value:"true"
/>
```

Also add this to your android projects app level gradle file to add the required dependency.
The GitHub Packages Token is the same one generated above.

```java
allprojects {
  repositories {
      maven {
          url = uri("https://maven.pkg.github.com/tyro/tyro-pay-api-google-pay-sdk-android")
          credentials {
              username = System.getenv("GITHUB_PACKAGES_USER")
              password = System.getenv("GITHUB_PACKAGES_TOKEN")
          }
      }
  }
}
```

### TyroSDK Initialisation

To initialise the TyroSDK in your React Native app,
wrap your payment screen with the TyroProvider component.
liveMode is required and if using Apple Pay then
options.applePay.merchantId is also required.

See [Initialise Tyro React Native](https://preview.redoc.ly/tyro-connect/pla-6091-react-native-sdk/app/apis/pay/tyro-react-native/init/)

```javascript
// example javascript code for using TyroProvider component
import { TyroProvider } from '@tyro/tyro-pay-api-react-native';

const providerOptions = {
  applePay: {
    enabled: true,
    merchantId: '123456789',
    supportedNetworks: ['visa', 'mastercard', 'amex', 'jcb'],
  },
  googlePay: {
    enabled: true,
    merchantName: 'The merchant name',
    supportedNetworks: ['visa', 'mastercard', 'amex', 'jcb'],
  },
  creditCardForm: {
    enabled: true,
  },
};

function App() {
  return (
    <TyroProvider liveMode={true} options={providerOptions}>
      ... // Your App Code
    </TyroProvider>
  );
}
```

# 2. Initialise the Pay Sheet

Set up the Tyro PaySheet component in your checkout page

## In Your Checkout page

### Create the Pay Request on your server and initialise the PaySheet

- Make a call to your server with the order information.
- Your server should calculate the total of the order
  - Send this total when [creating a Pay Request](https://docs.connect.tyro.com/app/apis/pay/0/operation/create-pay-request/)
- Pay Request Pay Secret is then returned to your checkout page

See [PaySheet](https://preview.redoc.ly/tyro-connect/pla-6091-react-native-sdk/app/apis/pay/tyro-react-native/pay-sheet/)

```javascript
// example code for using the useTyro hook to initialise the Pay Sheet
import { useTyro } from "@tyro/tyro-pay-api-react-native";

  // fetch the pay secret from your server and pass it to your Checkout Component
  const fetchPayRequest = async (): Promise<void> => {
    const { paySecret } = await createPayRequest();
    return paySecret;
  };

const CheckoutPage = ({ paySecret }: CheckoutProps) => {
  const {
    initPaySheet,
    initialised,
    payRequest,
    isPayRequestReady,
    isPayRequestLoading,
    tyroError,
  } = useTyro();

  Rest of CheckoutPage Below
}
```

# 3. Import and use the PaySheet component

Finally, embed the Tyro PaySheet component in your
payment screen for the user to submit their payment details.

## In your Payment screen

### Import The PaySheet component

```javascript
import { PaySheet } from '@tyro/tyro-pay-api-react-native';
```

### use the PaySheet component

```javascript
const CheckoutPage = ({ paySecret }: CheckoutProps) => {

 Rest of CheckoutPage Above

  useEffect(() => {
      if (initialised === true && paySecret) {
        initPaySheet(paySecret);
      }
  }, [initialised, paySecret]);

  // You might want to check you have passed in a paySecret yourself.
  if (!paySecret) {
    return (
      <YourErrorHandler errorMessage={"paySecret has not been generated"} />
    );
  }

  if (payRequest?.status === "SUCCESS") {
    return (
      <>
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            // Success message you would like to show your users. Your payment
            was successfully processed.
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <YourErrorHandler
        errorCode={tyroError?.errorCode ?? tyroError?.errorType}
        errorMessage={tyroError?.errorMessage}
      />
      {isPayRequestReady && <PaySheet />}
      {isPayRequestLoading && <ActivityIndicator />}
    </>
  );
};
```
