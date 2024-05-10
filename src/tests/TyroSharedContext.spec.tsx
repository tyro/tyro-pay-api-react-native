import TyroProvider from '../TyroSharedContext';
import React from 'react';
import * as helpers from '../utils/helpers';
import TyroSDK from '../TyroSDK';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { ClientPayRequestResponse } from '../@types/pay-request-types';
import { mockFetch } from './utils/mocks';
import { act } from 'react-test-renderer';
import { ProviderTestComponent, InitTestComponent } from './test-components/tests';
import { TyroPayOptionsProps } from '../@types/definitions';

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

describe('TyroProvider', () => {
  describe('init PaySheet', () => {
    afterEach(() => {
      jest.resetAllMocks();
      cleanup();
    });
    test('tyroError has message when an error occurred initialising TyroProvider', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      const spy = jest.spyOn(TyroSDK, 'init').mockImplementationOnce(async () => {
        throw new Error();
      });
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, { liveMode: false });
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
      spy.mockRestore();
    }, 15000);
    test('Able to init and display PaySheet', async () => {
      global.fetch = jest.fn(() =>
        mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
      );
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent />, {
            liveMode: false,
            options: {
              googlePay: {
                enabled: true,
              },
              applePay: {
                enabled: true,
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
