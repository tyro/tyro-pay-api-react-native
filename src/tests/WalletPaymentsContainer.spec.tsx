import React from 'react';
import { NativeModules, Platform } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import TyroProvider from '../TyroSharedContext';
import { WalletPaymentResult, WalletPaymentStatus } from '../@types/wallet-payment-result';
import { mockFetch } from './utils/mocks';
import { ClientPayRequestResponse, PayRequestStatus } from '../@types/pay-request-types';
import { InitTestComponent } from './test-components/tests';
import { TyroPayOptionsProps } from '../@types/definitions';
import { TyroErrorMessages } from '../@types/error-message-types';

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
const mockedCancelledResult = { status: WalletPaymentStatus.CANCELLED } as WalletPaymentResult;
const mockedSuccessResult = { status: WalletPaymentStatus.SUCCESS } as WalletPaymentResult;
const mockedFailedResult = {
  status: WalletPaymentStatus.FAILED,
  error: {
    errorMessage: TyroErrorMessages.PAY_REQUEST_ERROR.message,
    errorType: TyroErrorMessages.PAY_REQUEST_ERROR.type,
    errorCode: 'Error-Code',
    gatewayCode: 'Gateway-Code',
  },
} as WalletPaymentResult;

const merchantIdentifier = 'merId';
const merchantName = 'merName';

describe('WalletPaymentsContainer', () => {
  let wrapper;

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('when platform OS is android', () => {
    beforeAll(() => {
      Platform.OS = 'android';
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('when googlePay is supported on device', () => {
      beforeEach(() => {
        mockedFetchPayRequestOnCompletion(PayRequestStatus.AWAITING_PAYMENT_INPUT);
        NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      });
      afterEach(() => {
        jest.clearAllMocks();
      });
      test('googlePay defaults to be disabled', async () => {
        await act(async () => {
          await waitFor(
            async () => {
              wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
                liveMode: false,
                styleProps: { showSupportedCards: false, googlePayButton: { buttonBorderRadius: 8 } },
              });
            },
            { timeout: 10000 }
          );
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
        });
        // check google pay button
        expect(wrapper.queryByTestId('google-pay-button')).toBeNull();
      });

      test('should render google-pay button when google pay is supported', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                googlePay: {
                  enabled: true,
                  merchantName,
                },
              },
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

      test('should render google-pay button with default styleProps', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                googlePay: {
                  enabled: true,
                  merchantName,
                },
              },
              styleProps: { showSupportedCards: false },
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
        expect(button._fiber.memoizedProps.buttonBorderRadius).toEqual(4);
        expect(button._fiber.memoizedProps.buttonType).toEqual('plain');
        expect(button._fiber.memoizedProps.buttonColor).toEqual('default');
      }, 15000);
      test('should accept custom styleProps, even if the number is a string', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                googlePay: {
                  enabled: true,
                  merchantName,
                },
              },
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
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                googlePay: {
                  enabled: true,
                  merchantName,
                },
              },
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
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                googlePay: {
                  enabled: true,
                  merchantName,
                },
              },
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
          await waitFor(
            async () => {
              wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
                liveMode: false,
                options: {
                  googlePay: {
                    enabled: true,
                    merchantName,
                  },
                },
                styleProps: { showSupportedCards: false },
              });
            },
            { timeout: 10000 }
          );
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
          // check google pay button
          const googlePay = await wrapper.findByTestId('google-pay-button');
          await fireEvent.press(googlePay);
        });
        wrapper.getByText('ErrorCode: Error-Code');
        wrapper.getByText('GatewayCode: Gateway-Code');
        wrapper.getByText(`ErrorMessage: ${TyroErrorMessages.PAY_REQUEST_ERROR.message}`);
        wrapper.getByText(`ErrorType: ${TyroErrorMessages.PAY_REQUEST_ERROR.type}`);
        await waitFor(async () => {
          await wrapper.findByText(`Pay Request Status: ${WalletPaymentStatus.FAILED}`);
        });
      }, 15000);
      test('should update payRequest when googlePay is successful', async () => {
        NativeModules.TyroPaySdkModule.startWalletPay.mockResolvedValue(mockedSuccessResult);
        mockedFetchPayRequestOnCompletion(PayRequestStatus.SUCCESS);
        await act(async () => {
          await waitFor(
            async () => {
              wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
                liveMode: false,
                options: {
                  googlePay: {
                    enabled: true,
                    merchantName,
                  },
                },
                styleProps: { showSupportedCards: false },
              });
            },
            { timeout: 10000 }
          );
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
        mockedFetchPayRequestOnCompletion(PayRequestStatus.AWAITING_PAYMENT_INPUT);
        NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(false);
      });
      it('should hide google-pay button when google pay is not supported', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                googlePay: {
                  enabled: true,
                  merchantName,
                },
              },
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

  describe('when platform OS is ios', () => {
    beforeAll(() => {
      Platform.OS = 'ios';
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when applePay is supported', () => {
      beforeEach(() => {
        mockedFetchPayRequestOnCompletion(PayRequestStatus.AWAITING_PAYMENT_INPUT);
        NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
      });
      afterEach(() => {
        jest.clearAllMocks();
      });

      test('applePay defaults to be disabled', async () => {
        await act(async () => {
          await waitFor(
            async () => {
              wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
                liveMode: false,
                styleProps: { showSupportedCards: false },
              });
            },
            { timeout: 10000 }
          );
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
        });
        // check google pay button
        expect(wrapper.queryByTestId('apple-pay-button')).toBeNull();
      });

      test('should render apple-pay button and default styles', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                applePay: {
                  enabled: true,
                  merchantIdentifier,
                },
              },
              styleProps: { showSupportedCards: false },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
        });
        // check apple pay button
        const button = await wrapper.findByTestId('apple-pay-button');
        expect(button._fiber.memoizedProps.buttonStyle).toEqual('black');
        expect(button._fiber.memoizedProps.buttonLabel).toEqual('plain');
      }, 15000);
      test('should do nothing when applePay is cancelled', async () => {
        NativeModules.TyroPaySdkModule.startWalletPay.mockResolvedValue(mockedCancelledResult);
        mockedFetchPayRequestOnCompletion(PayRequestStatus.AWAITING_PAYMENT_INPUT);
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                applePay: {
                  enabled: true,
                  merchantIdentifier,
                },
              },
              styleProps: { showSupportedCards: false },
            });
          });
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
          // check apple pay button
          const applePay = await wrapper.findByTestId('apple-pay-button');
          await fireEvent.press(applePay);
        });
        expect(wrapper.queryByText('ErrorCode', { exact: false })).toBeNull();
        expect(wrapper.queryByText('GatewayCode', { exact: false })).toBeNull();
        expect(wrapper.queryByText('ErrorMessage', { exact: false })).toBeNull();
        expect(wrapper.queryByText('Pay Request Status', { exact: false })).toBeNull();
      }, 15000);
      test('should update tyroError and payRequest when applePay is failed', async () => {
        NativeModules.TyroPaySdkModule.startWalletPay.mockResolvedValue(mockedFailedResult);
        mockedFetchPayRequestOnCompletion(PayRequestStatus.FAILED);

        await act(async () => {
          await waitFor(
            async () => {
              wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
                liveMode: false,
                options: {
                  applePay: {
                    enabled: true,
                    merchantIdentifier,
                  },
                },
                styleProps: { showSupportedCards: false },
              });
            },
            { timeout: 10000 }
          );
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
          // check apple pay button
          const applePay = await wrapper.findByTestId('apple-pay-button');
          await fireEvent.press(applePay);
        });
        wrapper.getByText('ErrorCode: Error-Code');
        wrapper.getByText('GatewayCode: Gateway-Code');
        wrapper.getByText(`ErrorMessage: ${TyroErrorMessages.PAY_REQUEST_ERROR.message}`);
        wrapper.getByText(`ErrorType: ${TyroErrorMessages.PAY_REQUEST_ERROR.type}`);
        await waitFor(async () => {
          await wrapper.findByText('Pay Request Status: FAILED');
        });
      }, 15000);
      test('should update payRequest when applePay is successful', async () => {
        NativeModules.TyroPaySdkModule.startWalletPay.mockResolvedValue(mockedSuccessResult);
        mockedFetchPayRequestOnCompletion(PayRequestStatus.SUCCESS);
        await act(async () => {
          await waitFor(
            async () => {
              wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
                liveMode: false,
                options: {
                  applePay: {
                    enabled: true,
                    merchantIdentifier,
                  },
                },
                styleProps: { showSupportedCards: false },
              });
            },
            { timeout: 10000 }
          );
          // check initial components have rendered, click checkout
          const checkOutButton = await wrapper.findByTestId('test-button');
          await fireEvent.press(checkOutButton);
          // check apple pay button
          const applePay = await wrapper.findByTestId('apple-pay-button');
          await fireEvent.press(applePay);
        });
        expect(wrapper.queryByText('ErrorCode', { exact: false })).toBeNull();
        expect(wrapper.queryByText('GatewayCode', { exact: false })).toBeNull();
        expect(wrapper.queryByText('ErrorMessage', { exact: false })).toBeNull();
        await waitFor(async () => {
          await wrapper.findByText('Pay Request Status: SUCCESS');
        });
      }, 15000);
    });
  });
});
