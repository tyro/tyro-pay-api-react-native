import TyroProvider from '../TyroSharedContext';
import React from 'react';
import { NativeModules } from 'react-native';
import * as helpers from '../utils/helpers';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { ClientPayRequestResponse } from '../@types/pay-request-types';
import { mockFetch } from './utils/mocks';
import { act } from 'react-test-renderer';
import { ProviderTestComponent, InitTestComponent } from './test-components/tests';
import { TyroPayOptionsProps } from '../@types/definitions';
import { ErrorMessageType, TyroErrorMessages } from '../@types/message-types';

jest.mock('../utils/helpers', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../utils/helpers'),
    isAndroid: jest.fn(),
    isiOS: jest.fn(),
  };
});

const mockedHelpers = helpers as jest.Mocked<typeof helpers>;

const renderWithProvider = async (component, options: TyroPayOptionsProps): Promise<any> => {
  return render(<TyroProvider options={options}>{component}</TyroProvider>);
};

let wrapper;

const merchantIdentifier = 'merId';
const merchantName = 'merName';

describe('TyroProvider', () => {
  describe('init TyroProvider', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('TyroProvider does not initialise when googlePay enabled and missing merchantName', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(true);
      mockedHelpers.isiOS.mockReturnValue(false);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: { googlePay: { enabled: true } },
          });
        });
        expect(
          await wrapper.findByText(
            `ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`
          )
        ).not.toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);

    test('TyroProvider does not initialise when applePay enabled and missing merchantIdentifier', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(false);
      mockedHelpers.isiOS.mockReturnValue(true);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: { applePay: { enabled: true } },
          });
        });
        expect(
          await wrapper.findByText(
            `ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`
          )
        ).not.toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);

    test('TyroProvider does initialise when applePay enabled with merchantIdentifier', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(false);
      mockedHelpers.isiOS.mockReturnValue(true);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: { applePay: { enabled: true, merchantIdentifier } },
          });
        });
        expect(
          await wrapper.queryByText(
            `ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`
          )
        ).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);

    test('TyroProvider does initialise when googlePay enabled with merchantName', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(false);
      mockedHelpers.isiOS.mockReturnValue(true);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: { googlePay: { enabled: true, merchantName } },
          });
        });
        expect(
          await wrapper.queryByText(
            `ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`
          )
        ).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);

    test('TyroProvider does initialise when googlePay/applePay enabled with merchant details on ios', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(false);
      mockedHelpers.isiOS.mockReturnValue(true);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: {
              googlePay: { enabled: true, merchantName },
              applePay: { enabled: true, merchantIdentifier },
            },
          });
        });
        expect(
          await wrapper.queryByText(
            `ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`
          )
        ).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);
    test('TyroProvider does initialise when googlePay/applePay enabled with merchant details on android', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(true);
      mockedHelpers.isiOS.mockReturnValue(false);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: {
              googlePay: { enabled: true, merchantName },
              applePay: { enabled: true, merchantIdentifier },
            },
          });
        });
        expect(
          await wrapper.queryByText(
            `ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`
          )
        ).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);

    test('TyroProvider does initialise when googlePay/applePay enabled and merchantIdentifier missing for apple pay on android', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(true);
      mockedHelpers.isiOS.mockReturnValue(false);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: {
              googlePay: { enabled: true, merchantName },
              applePay: { enabled: true },
            },
          });
        });
        expect(
          wrapper.queryByText(`ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`)
        ).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);

    test('TyroProvider does initialise when googlePay/applePay enabled with merchantName missing for googlePay on ios', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(false);
      mockedHelpers.isiOS.mockReturnValue(true);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: {
              googlePay: { enabled: true },
              applePay: { enabled: true, merchantIdentifier },
            },
          });
        });
        expect(
          wrapper.queryByText(`ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`)
        ).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);

    test('TyroProvider does initialise when googlePay/applePay disabled', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValue(true);
      mockedHelpers.isiOS.mockReturnValue(false);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
          });
        });
        expect(
          await wrapper.queryByText(
            `ErrorMessage: ${TyroErrorMessages[ErrorMessageType.MISSING_MERCHANT_CONFIG].message}`
          )
        ).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);
  });
  describe('init PaySheet', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Able to init and display PaySheet for android', async () => {
      NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValueOnce(true);
      mockedHelpers.isiOS.mockReturnValueOnce(false);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: {
              googlePay: {
                enabled: true,
                merchantName,
              },
              applePay: {
                enabled: true,
                merchantIdentifier,
              },
            },
          });
        });
        expect(wrapper.queryByText('Pay')).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        const button = await wrapper.findByTestId('test-button');
        await fireEvent.press(button);
        expect(await wrapper.findByText('Pay')).not.toBeNull();
        expect(await wrapper.findByText('Or pay with card')).not.toBeNull();
        expect(await wrapper.findByPlaceholderText('Card number')).not.toBeNull();
        expect(await wrapper.findByPlaceholderText('Name on card')).not.toBeNull();
        expect(await wrapper.findByPlaceholderText('MM/YY')).not.toBeNull();
        expect(await wrapper.findByPlaceholderText('CVV')).not.toBeNull();
      });
    }, 15000);

    test('Able to init and display PaySheet for iOS', async () => {
      NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      mockedHelpers.isAndroid.mockReturnValueOnce(false);
      mockedHelpers.isiOS.mockReturnValueOnce(true);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: {
              googlePay: {
                enabled: true,
                merchantName,
              },
              applePay: {
                enabled: true,
                merchantIdentifier,
              },
            },
          });
        });
        expect(wrapper.queryByText('Pay')).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        const button = await wrapper.findByTestId('test-button');
        await fireEvent.press(button);
        expect(await wrapper.findByText('Pay')).not.toBeNull();
        expect(await wrapper.findByText('Or pay with card')).not.toBeNull();
        expect(await wrapper.findByPlaceholderText('Card number')).not.toBeNull();
        expect(await wrapper.findByPlaceholderText('Name on card')).not.toBeNull();
        expect(await wrapper.findByPlaceholderText('MM/YY')).not.toBeNull();
        expect(await wrapper.findByPlaceholderText('CVV')).not.toBeNull();
      });
    }, 15000);

    test('PaySheet is not displayed when error with initPaySheet and tyroError has the error message', async () => {
      global.fetch = jest.fn(() => mockFetch(200, { status: 'SUCCESS', isLive: false } as ClientPayRequestResponse));
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, { liveMode: false });
        });
        expect(wrapper.queryByText('Pay')).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        const button = await wrapper.findByTestId('test-button');
        await fireEvent.press(button);
        expect(await wrapper.findByText('ErrorMessage: PaySheet failed to initialise')).not.toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);

    test('PaySheet fails to init when TyroProvider failed to initialise', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: {
              googlePay: { enabled: true },
            },
          });
        });
        expect(wrapper.queryByText('Pay')).toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        const button = await wrapper.findByTestId('test-button');
        await fireEvent.press(button);
        expect(await wrapper.findByText('ErrorMessage: TyroProvider not initialised')).not.toBeNull();
        expect(wrapper.queryByText('Or pay with card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
        expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
        expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
        expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
      });
    }, 15000);
  });
  describe('Provider Context', () => {
    afterEach(() => {
      cleanup();
    });
    test('Provider is able to provide the default options to its children on Android', async () => {
      mockedHelpers.isAndroid.mockReturnValue(true);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<ProviderTestComponent />, { liveMode: false });
        });
        expect(wrapper.queryByText('liveMode: false')).not.toBeNull();
        expect(wrapper.queryByText('applePay')).toBeNull();
        expect(wrapper.queryByText('creditCard')).not.toBeNull();
        expect(wrapper.queryByText('default')).not.toBeNull();
        wrapper.unmount();
      });
    }, 15000);
    test('Provider is able to provide the default options to its children on iOS', async () => {
      mockedHelpers.isiOS.mockReturnValue(true);
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<ProviderTestComponent />, { liveMode: true });
        });
        expect(wrapper.queryByText('liveMode: true')).not.toBeNull();
        expect(wrapper.queryByText('googlePay')).toBeNull();
        expect(wrapper.queryByText('creditCard')).not.toBeNull();
        expect(wrapper.queryByText('default')).not.toBeNull();
        wrapper.unmount();
      });
    }, 15000);
  });
});
