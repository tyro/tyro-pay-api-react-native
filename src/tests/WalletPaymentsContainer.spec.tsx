import React from 'react';
import { NativeModules } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import TyroProvider from '../TyroSharedContext';
import { WalletPaymentResult } from '../@types/wallet-payment-result';
import { mockFetch } from './utils/mocks';
import { ClientPayRequestResponse, PayRequestStatus } from '../@types/pay-request-types';
import { InitTestComponent } from './test-components/tests';
import { TyroPayOptionsProps } from '../@types/definitions';

const renderWithProvider = async (component, options: TyroPayOptionsProps): Promise<any> => {
  return render(<TyroProvider options={options}>{component}</TyroProvider>);
};

const mockedFetchPayRequestOnCompletion = (status: PayRequestStatus): void => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    mockFetch(200, {
      status,
      isLive: false,
      origin: '',
      total: {},
      errorMessage: undefined,
    } as unknown as ClientPayRequestResponse)
  );
};
const mockedCancelledResult = { status: 'CANCELLED' } as WalletPaymentResult;
const mockedSuccessResult = { status: 'SUCCESS' } as WalletPaymentResult;
const mockedFailedResult = {
  status: 'FAILED',
  error: {
    errorMessage: 'google pay failed',
    errorType: 'INVALID_ACTION',
    errorCode: 'Error-Code',
    gatewayCode: 'Gateway-Code',
  },
} as WalletPaymentResult;

describe('WalletPaymentsContainer', () => {
  let wrapper;

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('when platform OS is android', () => {
    beforeEach(() => {
      jest.mock('react-native/Libraries/Utilities/Platform', () => ({
        OS: 'android',
        select: (): any => null,
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('when googlePay is supported on device', () => {
      beforeEach(() => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(
          mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
        );
        NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      });
      afterEach(() => {
        jest.clearAllMocks();
      });

      test('should render google-pay button when google pay is supported', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent />, {
              liveMode: false,
              styleProps: { showSupportedCards: false, googlePayButton: { buttonBorderRadius: 8 } },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
        });
        // check google pay button
        expect(wrapper.queryByTestId('google-pay-button')).not.toBeNull();
        // check google pay button style
        const button = await wrapper.findByTestId('google-pay-button');
        expect(button._fiber.memoizedProps.buttonBorderRadius).toEqual(8);
      }, 15000);
      test('should accept custom styleProps, even if the number is a string', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent />, {
              liveMode: false,
              styleProps: {
                showSupportedCards: false,
                googlePayButton: { buttonBorderRadius: '6' as unknown as number },
              },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
        });
        // check google pay button style
        const button = await wrapper.findByTestId('google-pay-button');
        expect(button._fiber.memoizedProps.buttonBorderRadius).toEqual(6);
      }, 15000);
      test('should ignore/revert to default, on invalid styleProps', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent />, {
              liveMode: false,
              styleProps: {
                showSupportedCards: false,
                googlePayButton: { buttonBorderRadius: 'monkey' as unknown as number },
              },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
        });
        // check google pay button style
        const button = await wrapper.findByTestId('google-pay-button');
        expect(button._fiber.memoizedProps.buttonBorderRadius).toEqual(4);
      }, 15000);
      test('should do nothing when googlePay is cancelled', async () => {
        NativeModules.TyroPaySdkModule.startWalletPay.mockResolvedValue(mockedCancelledResult);
        mockedFetchPayRequestOnCompletion(PayRequestStatus.AWAITING_PAYMENT_INPUT);
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
          // check google pay button
          const googlePay = await wrapper.findByTestId('google-pay-button');
          await fireEvent.press(googlePay);
        });
        expect(wrapper.queryByText('ErrorCode', { exact: false })).toBeNull();
        expect(wrapper.queryByText('GatewayCode', { exact: false })).toBeNull();
        expect(wrapper.queryByText('ErrorMessage', { exact: false })).toBeNull();
        expect(wrapper.queryByText('Pay Request Status', { exact: false })).toBeNull();
      }, 15000);
      test('should update tyroError and payRequest when googlePay is failed', async () => {
        NativeModules.TyroPaySdkModule.startWalletPay.mockResolvedValue(mockedFailedResult);
        mockedFetchPayRequestOnCompletion(PayRequestStatus.FAILED);

        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
          // check google pay button
          const googlePay = await wrapper.findByTestId('google-pay-button');
          await fireEvent.press(googlePay);
        });
        wrapper.getByText('ErrorCode: Error-Code');
        wrapper.getByText('GatewayCode: Gateway-Code');
        wrapper.getByText('ErrorMessage: google pay failed');
        await waitFor(async () => {
          await wrapper.findByText('Pay Request Status: FAILED');
        });
      }, 15000);
      test('should update payRequest when googlePay is successful', async () => {
        NativeModules.TyroPaySdkModule.startWalletPay.mockResolvedValue(mockedSuccessResult);
        mockedFetchPayRequestOnCompletion(PayRequestStatus.SUCCESS);
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
          // check google pay button
          const googlePay = await wrapper.findByTestId('google-pay-button');
          await fireEvent.press(googlePay);
        });
        expect(wrapper.queryByText('ErrorCode', { exact: false })).toBeNull();
        expect(wrapper.queryByText('GatewayCode', { exact: false })).toBeNull();
        expect(wrapper.queryByText('ErrorMessage', { exact: false })).toBeNull();
        await waitFor(async () => {
          await wrapper.findByText('Pay Request Status: SUCCESS');
        });
      }, 15000);
    });

    describe('when googlePay is not supported on device', () => {
      beforeEach(async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(
          mockFetch(200, { status: 'AWAITING_PAYMENT_INPUT', isLive: false } as ClientPayRequestResponse)
        );
        NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(false);
      });
      it('should hide google-pay button when google pay is not supported', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
          // check google pay button
          expect(wrapper.queryByTestId('google-pay-button')).toBeNull();
        });
      });
    });
  });
});
