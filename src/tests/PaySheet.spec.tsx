import React from 'react';
import TyroProvider from '../TyroSharedContext';
import { NativeModules } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ClientPayRequestResponse, PayRequestStatus, ThreeDSecureStatus } from '../@types/pay-request-types';
import { mockFetch } from './utils/mocks';
import { act } from 'react-test-renderer';
import { InitTestComponent, TestPayButton, useYear } from './test-components/tests';
import { CardTypeNames } from '../@types/card-types';
import { TyroPayOptionsProps, TyroPayStyleLabelPositions } from '../@types/definitions';
import { ErrorCodes, ErrorMessageType, TyroErrorMessages } from '../@types/error-message-types';
import { HTTP_ACCEPTED, HTTP_FORBIDDEN, HTTP_OK } from '../@types/http-status-codes';

jest.mock('../clients/config/pay-request-client-config.ts', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../clients/config/pay-request-client-config.ts'),
    POLL_INTERVAL_MS: 100,
    PAY_REQUEST_POLL_MAX_RETRIES: 1,
  };
});
jest.mock('../clients/config/three-d-secure-client-config.ts', () => {
  return {
    __esModule: true,
    THREE_D_SECURE_METHOD_MAX_RETRIES: 1,
    CHALLENGE_POLL_INTERVAL_MS: 100,
    CHALLENGE_MAX_RETRIES: 1,
  };
});

jest.mock('../@types/images.tsx', () => {
  const images = ['card-unknown', 'card-cvv', 'card-error', 'visa', 'mastercard'];
  return {
    ImageSources: images.reduce((acc, name) => {
      const attributes = { testID: `${name}-image` };
      acc[name] = (): JSX.Element => (
        <>
          <div {...attributes}>{name}-image</div>
        </>
      );
      return acc;
    }, {}),
  };
});

const merchantIdentifier = 'merId';
const merchantName = 'merName';
const cardDeclined = 'Card Declined';

const renderWithProvider = async (component, options: TyroPayOptionsProps): Promise<any> => {
  return render(<TyroProvider options={options}>{component}</TyroProvider>);
};

// Common confirmation functions
const checkInitializedCorrectly = async (wrapper): Promise<void> => {
  // check initial components have rendered, click checkout
  expect(wrapper.queryByText('Pay')).toBeNull();
  expect(wrapper.queryByText('Or pay with card')).toBeNull();
  const checkOutButton = await wrapper.findByTestId('test-button');
  await fireEvent.press(checkOutButton);
  expect(wrapper.queryByText('Pay')).not.toBeNull();
};
const checkForPaySheetRenders = (wrapper: any): void => {
  expect(wrapper.getByPlaceholderText('Card number')).not.toBeNull();
  expect(wrapper.getByPlaceholderText('Name on card')).not.toBeNull();
  expect(wrapper.getByPlaceholderText('MM/YY')).not.toBeNull();
  expect(wrapper.getByPlaceholderText('CVV')).not.toBeNull();
};
const fillOutForm = async (
  wrapper,
  cardString: string,
  nameString: string,
  expiryString: string,
  cvvString: string
): Promise<void> => {
  if (cardString?.length) {
    const cardInputField = wrapper.getByPlaceholderText('Card number');
    await fireEvent.changeText(cardInputField, cardString);
  }
  if (nameString?.length) {
    const nameInputField = wrapper.getByPlaceholderText('Name on card');
    await fireEvent.changeText(nameInputField, nameString);
  }
  if (expiryString?.length) {
    const expiryInputField = wrapper.getByPlaceholderText('MM/YY');
    await fireEvent.changeText(expiryInputField, expiryString);
  }
  if (cvvString?.length) {
    const cvvInputField = wrapper.getByPlaceholderText('CVV');
    await fireEvent.changeText(cvvInputField, cvvString);
  }
};
const pressButton = async (wrapper, buttonId: string): Promise<void> => {
  const payButton = await wrapper.findByTestId(buttonId);
  await fireEvent.press(payButton);
};

describe('PaySheet', () => {
  let wrapper;
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('HandleSubmit', () => {
    describe('Submit Guards - no paysecret and unknown card type', () => {
      test('Pay button will not submit if no paySecret', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
            origin: 'nope',
          } as unknown as ClientPayRequestResponse)
        ); // init and verify paySecret
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<TestPayButton title={'Pay'} />, { liveMode: false });
          });
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
          expect(wrapper.queryByText('Pay')).not.toBeNull();
          expect(wrapper.queryByText('no error')).not.toBeNull();
          await pressButton(wrapper, 'pay-button');
          expect(
            wrapper.queryByText(
              `${TyroErrorMessages.CLIENT_INITIALISATION_ERROR.type}: ${TyroErrorMessages.CLIENT_INITIALISATION_ERROR.message}`
            )
          ).not.toBeNull();
        });
      }, 15000);

      test('can submit payRequest when supportedNetworks matches frontend and backend', async () => {
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce(
            mockFetch(HTTP_OK, {
              status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
              isLive: false,
              supportedNetworks: [CardTypeNames.VISA],
            } as unknown as ClientPayRequestResponse)
          ) // init and verify paySecret
          .mockResolvedValueOnce(
            mockFetch(HTTP_ACCEPTED, {
              status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
              isLive: false,
            } as ClientPayRequestResponse)
          ) // submitPayRequest
          .mockResolvedValueOnce(
            mockFetch(HTTP_OK, {
              status: PayRequestStatus.SUCCESS,
              isLive: false,
              origin: '',
              total: {},
              errorMessage: undefined,
            } as unknown as ClientPayRequestResponse)
          ); // pollPayCompletion
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: { creditCardForm: { supportedNetworks: [CardTypeNames.VISA] } },
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
          await pressButton(wrapper, 'pay-button');
          expect(wrapper.getByText(`Pay Request Status: ${PayRequestStatus.SUCCESS}`)).not.toBeNull();
          checkForPaySheetRenders(wrapper);
        });
      }, 15000);

      test('cannot submit payRequest when supportedNetworks does not match between frontend and backend', async () => {
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce(
            mockFetch(HTTP_OK, {
              status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
              isLive: false,
              supportedNetworks: [CardTypeNames.MASTERCARD],
            } as unknown as ClientPayRequestResponse)
          ) // init and verify paySecret
          .mockResolvedValueOnce(
            mockFetch(HTTP_ACCEPTED, {
              status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
              isLive: false,
            } as ClientPayRequestResponse)
          ) // submitPayRequest
          .mockResolvedValueOnce(
            mockFetch(HTTP_OK, {
              status: PayRequestStatus.SUCCESS,
              isLive: false,
              origin: '',
              total: {},
              errorMessage: undefined,
            } as unknown as ClientPayRequestResponse)
          ); // pollPayCompletion
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: { creditCardForm: { supportedNetworks: [CardTypeNames.VISA] } },
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
          await pressButton(wrapper, 'pay-button');
          expect(wrapper.queryByText(`Pay Request Status: ${PayRequestStatus.SUCCESS}`)).toBeNull();
          expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.CARD_ERROR].type}`)).not.toBeNull();
          expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.INVALID_CARD_TYPE}`)).not.toBeNull();
          checkForPaySheetRenders(wrapper);
        });
      }, 15000);

      test('using a non-supported card type sets tyroError to INVALID_CARD_TYPE', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
            supportedNetworks: [CardTypeNames.VISA],
          } as unknown as ClientPayRequestResponse)
        ); // init and verify paySecret
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: { creditCardForm: { supportedNetworks: [CardTypeNames.VISA] } },
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '6759649826438453', 'test name', '01' + useYear, '123');
          await pressButton(wrapper, 'pay-button');
          expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.CARD_ERROR].type}`)).not.toBeNull();
          expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.INVALID_CARD_TYPE}`)).not.toBeNull();
          checkForPaySheetRenders(wrapper);
        });
      }, 15000);

      test('cannot submit if form validation fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
            supportedNetworks: null,
          } as unknown as ClientPayRequestResponse)
        ); // init and verify paySecret

        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: { creditCardForm: { supportedNetworks: [CardTypeNames.VISA] } },
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '411111111111', '', '01' + useYear, '');
          await pressButton(wrapper, 'pay-button');
          wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.CARD_ERROR].type}`);
          wrapper.getByText(`ErrorCode: ${ErrorCodes.INVALID_CARD_DETAILS}`);
        });
      }, 15000);
    });
  });
  describe('Submit Pay Request', () => {
    test('can submit payRequest - no 3DS Challenge and success status', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.SUCCESS,
            isLive: false,
            origin: '',
            total: {},
            errorMessage: undefined,
          } as unknown as ClientPayRequestResponse)
        ); // pollPayCompletion
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`Pay Request Status: ${PayRequestStatus.SUCCESS}`)).not.toBeNull();
        checkForPaySheetRenders(wrapper);
      });
    }, 15000);

    test('can submit payRequest - no 3DS Challenge and failed status', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.FAILED,
            isLive: false,
            origin: '',
            total: {},
            errorMessage: undefined,
            errorCode: cardDeclined,
          } as unknown as ClientPayRequestResponse)
        ); // pollPayCompletion
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        // Payment failed
        expect(wrapper.getByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).not.toBeNull();
        // tyroError.errorCode gets set to PAYMENT_FAILED
        expect(
          wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.PAY_REQUEST_ERROR].type}`)
        ).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${cardDeclined}`)).not.toBeNull();
      });
    }, 15000);

    test('can submit payRequest - no 3DS Challenge and voided status if request was voided immediately before a success status was polled', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValue(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.VOIDED,
            isLive: false,
            origin: '',
            total: {},
            errorMessage: undefined,
          } as unknown as ClientPayRequestResponse)
        ); // pollPayCompletion
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`Pay Request Status: ${PayRequestStatus.VOIDED}`)).not.toBeNull();
        // tyroError.errorCode gets set to PAYMENT_FAILED
        expect(
          wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.PAY_REQUEST_ERROR].type}`)
        ).not.toBeNull();
        expect(
          wrapper.getByText(`ErrorMessage: ${TyroErrorMessages[ErrorMessageType.PAY_REQUEST_ERROR].message}`)
        ).not.toBeNull();
      });
    }, 15000);

    test('if submitting the pay request fails but polling succeeds, tyroError is set with server error', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(mockFetch(500, {} as ClientPayRequestResponse)) // submitPayRequest
        .mockResolvedValue(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
            origin: '',
            total: {},
            errorMessage: undefined,
          } as unknown as ClientPayRequestResponse)
        ); // pollPayCompletion
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].type}`)).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.FAILED_TO_SUBMIT}`)).not.toBeNull();
      });
    }, 15000);

    test('sets tyroError to server error with the status http status code if polling the submitted pay request also fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(mockFetch(503, {} as ClientPayRequestResponse)) // submitPayRequest
        .mockResolvedValueOnce(null); // pollPayCompletion
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].type}`)).not.toBeNull();
        expect(
          wrapper.getByText(`ErrorMessage: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].message}`)
        ).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: 503`)).not.toBeNull();
      });
    }, 15000);

    test('sets tyroError to server error timeout if after polling for result, its still processing', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValue(
          mockFetch(HTTP_OK, {
            status: 'PROCESSING',
            isLive: false,
            origin: '',
            total: {},
            errorMessage: undefined,
          } as unknown as ClientPayRequestResponse)
        ); // pollPayCompletion
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages.SERVER_ERROR.type}`)).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.TIMEOUT}`)).not.toBeNull();
      });
    }, 1500000);

    test('sets tyroError to Unknown error if after polling for result, it has an unaccounted for status', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValue(
          mockFetch(HTTP_OK, {
            status: 'UNACCOUNTED FOR STATUS',
            isLive: false,
            origin: '',
            total: {},
            errorMessage: undefined,
          } as unknown as ClientPayRequestResponse)
        ); // pollPayCompletion
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].type}`)).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.UNKNOWN_ERROR}`)).not.toBeNull();
      });
    }, 1500000);

    test('can submit payRequest, SUCCESS final status - 3DS Challenge', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
          } as unknown as ClientPayRequestResponse)
        ) // pollPayCompletion
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_AUTH,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureMethodResult
        .mockResolvedValueOnce(mockFetch(HTTP_OK, {} as unknown as ClientPayRequestResponse)) // invoke3DSecureAuth/send3DSecureAuthRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_CHALLENGE,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureAuthResult
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.SUCCESS,
            isLive: false,
            origin: '',
            total: {},
          } as unknown as ClientPayRequestResponse)
        ); // pollFor3DSecureChallengeAndFinalResult
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`Pay Request Status: ${PayRequestStatus.SUCCESS}`)).not.toBeNull();
        checkForPaySheetRenders(wrapper);
      });
    }, 15000);

    test('can submit payRequest, FAILED final status - 3DS Challenge fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
          } as unknown as ClientPayRequestResponse)
        ) // pollPayCompletion
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_AUTH,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureMethodResult
        .mockResolvedValueOnce(mockFetch(HTTP_OK, {} as unknown as ClientPayRequestResponse)) // invoke3DSecureAuth/send3DSecureAuthRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_CHALLENGE,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureAuthResult
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.FAILED,
            isLive: false,
            origin: '',
            total: {},
            errorCode: cardDeclined,
            threeDSecure: {
              status: PayRequestStatus.FAILED,
            },
          } as unknown as ClientPayRequestResponse)
        ); // pollFor3DSecureChallengeAndFinalResult
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).not.toBeNull();
        // tyroError.errorCode gets set to errorcode on pay request
        expect(
          wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.PAY_REQUEST_ERROR].type}`)
        ).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${cardDeclined}`)).not.toBeNull();
      });
    }, 15000);

    test('Polling for 3d Secure Auth Result times out - tyroError set to TIMEOUT', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
          } as unknown as ClientPayRequestResponse)
        ) // pollPayCompletion
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_AUTH,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureMethodResult
        .mockResolvedValueOnce(mockFetch(HTTP_OK, {} as unknown as ClientPayRequestResponse)) // invoke3DSecureAuth/send3DSecureAuthRequest
        .mockResolvedValueOnce(mockFetch(500, {} as unknown as ClientPayRequestResponse)); // pollFor3DSecureAuthResult
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        // tyroError.errorCode gets set to timeout
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages.SERVER_ERROR.type}`)).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.TIMEOUT}`)).not.toBeNull();
      });
    }, 15000);

    test('can submit payRequest, polling for final result has an http error - 3DS Challenge unknown result', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
          } as unknown as ClientPayRequestResponse)
        ) // pollPayCompletion
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_AUTH,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureMethodResult
        .mockResolvedValueOnce(mockFetch(HTTP_OK, {} as unknown as ClientPayRequestResponse)) // invoke3DSecureAuth/send3DSecureAuthRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_CHALLENGE,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureAuthResult
        .mockResolvedValueOnce(mockFetch(500, {} as unknown as ClientPayRequestResponse)); // pollFor3DSecureChallengeAndFinalResult
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages.SERVER_ERROR.type}`)).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.TIMEOUT}`)).not.toBeNull();
      });
    }, 15000);

    test('can submit payRequest - Frictionless 3DS SUCCESS', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
          } as unknown as ClientPayRequestResponse)
        ) // pollPayCompletion
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_AUTH,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureMethodResult
        .mockResolvedValueOnce(mockFetch(HTTP_OK, {} as unknown as ClientPayRequestResponse)) // invoke3DSecureAuth/send3DSecureAuthRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.SUCCESS,
            isLive: false,
          } as unknown as ClientPayRequestResponse)
        );
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`Pay Request Status: ${PayRequestStatus.SUCCESS}`)).not.toBeNull();
      });
    }, 15000);

    test('can submit payRequest - Frictionless 3DS FAILED', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
          } as unknown as ClientPayRequestResponse)
        ) // pollPayCompletion
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            threeDSecure: {
              status: ThreeDSecureStatus.AWAITING_AUTH,
              challengeURL: 'challenge-url',
            },
          } as unknown as ClientPayRequestResponse)
        ) // pollFor3DSecureMethodResult
        .mockResolvedValueOnce(mockFetch(HTTP_OK, {} as unknown as ClientPayRequestResponse)) // invoke3DSecureAuth/send3DSecureAuthRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.FAILED,
            isLive: false,
            errorCode: cardDeclined,
          } as unknown as ClientPayRequestResponse)
        );
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).not.toBeNull();
        // tyroError.errorCode gets set to PAYMENT_FAILED
        expect(
          wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.PAY_REQUEST_ERROR].type}`)
        ).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${cardDeclined}`)).not.toBeNull();
      });
    }, 15000);

    test('pollFor3DSecureMethodResult returns an http error, sets tyroError to SERVER_ERROR', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
            origin: 'nope',
          } as unknown as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
            origin: 'nope',
          } as unknown as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_AUTHENTICATION,
            isLive: false,
            origin: 'nope',
          } as unknown as ClientPayRequestResponse)
        ) // pollPayCompletion
        .mockResolvedValueOnce(mockFetch(400, { want: 'this' } as unknown as ClientPayRequestResponse)); // pollFor3DSecureMethodResult
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        await pressButton(wrapper, 'pay-button');
        // tyroError.errorCode gets set to PAYMENT_FAILED
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].type}`)).not.toBeNull();
        expect(
          wrapper.getByText(`ErrorMessage: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].message}`)
        ).not.toBeNull();
      });
    }, 15000);
  });

  describe('On submit form validation', () => {
    test('Cannot submit paysheet when all inputs not present', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
        } as ClientPayRequestResponse)
      ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await pressButton(wrapper, 'pay-button');
        // error messages appear
        expect(wrapper.queryByText('Please enter a card number')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card name')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card expiry')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a security code')).not.toBeNull();
        // no failed status for pay request i.e. nothing was submitted
        expect(wrapper.queryByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).toBeNull();
      });
    }, 15000);

    test('Errors are presented by blurring the fields', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
        } as ClientPayRequestResponse)
      ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);

        // Dont do this --> await pressButton(wrapper, 'pay-button');
        // Lets test on blur events instead
        const cardInputField = wrapper.getByPlaceholderText('Card number');
        await fireEvent(cardInputField, 'blur');
        const nameInputField = wrapper.getByPlaceholderText('Name on card');
        await fireEvent(nameInputField, 'blur');
        const expiryInputField = wrapper.getByPlaceholderText('MM/YY');
        await fireEvent(expiryInputField, 'blur');
        const cvvInputField = wrapper.getByPlaceholderText('CVV');
        await fireEvent(cvvInputField, 'blur');

        // error messages appear
        expect(wrapper.queryByText('Please enter a card number')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card name')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card expiry')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a security code')).not.toBeNull();
        // no failed status for pay request i.e. nothing was submitted
        expect(wrapper.queryByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).toBeNull();
      });
    }, 15000);

    test('Cannot submit paySheet when just the card number has been given', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
        } as ClientPayRequestResponse)
      ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', '', '', '');
        // try submitting the empty form
        await pressButton(wrapper, 'pay-button');
        // error messages appear/don't appear
        expect(wrapper.queryByText('Please enter a card number')).toBeNull();
        expect(wrapper.queryByText('Please enter a card name')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card expiry')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a security code')).not.toBeNull();
        // no failed status for pay request i.e. nothing was submitted
        expect(wrapper.queryByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).toBeNull();
      });
    }, 15000);

    test('Cannot submit paySheet when just the name on card has been given', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
        } as ClientPayRequestResponse)
      ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '', 'test name', '', '');
        // try submitting the empty form
        await pressButton(wrapper, 'pay-button');
        // error messages appear/don't appear
        expect(wrapper.queryByText('Please enter a card number')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card name')).toBeNull();
        expect(wrapper.queryByText('Please enter a card expiry')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a security code')).not.toBeNull();
        // no failed status for pay request i.e. nothing was submitted
        expect(wrapper.queryByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).toBeNull();
      });
    }, 15000);

    test('Cannot submit paySheet when just the card expiry has been given', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
        } as ClientPayRequestResponse)
      ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '', '', '01' + useYear, '');
        // try submitting the empty form
        await pressButton(wrapper, 'pay-button');
        // error messages appear/don't appear
        expect(wrapper.queryByText('Please enter a card number')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card name')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card expiry')).toBeNull();
        expect(wrapper.queryByText('Please enter a security code')).not.toBeNull();
        // no failed status for pay request i.e. nothing was submitted
        expect(wrapper.queryByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).toBeNull();
      });
    }, 15000);

    test('Cannot submit paySheet when just the card cvv has been given', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
        } as ClientPayRequestResponse)
      ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '', '', '', '123');
        // try submitting the empty form
        await pressButton(wrapper, 'pay-button');
        // error messages appear/don't appear
        expect(wrapper.queryByText('Please enter a card number')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card name')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a card expiry')).not.toBeNull();
        expect(wrapper.queryByText('Please enter a security code')).toBeNull();
        // no failed status for pay request i.e. nothing was submitted
        expect(wrapper.queryByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).toBeNull();
      });
    }, 15000);

    test('Expects that the amex CVV must be 4 digits', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
        } as ClientPayRequestResponse)
      ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '347678901234564', 'amex test card', '01' + useYear, '123');
        // try submitting the empty form
        await pressButton(wrapper, 'pay-button');
        // error messages appear/don't appear
        expect(wrapper.queryByText('Please enter a card number')).toBeNull();
        expect(wrapper.queryByText('Please enter a card name')).toBeNull();
        expect(wrapper.queryByText('Please enter a card expiry')).toBeNull();
        expect(wrapper.queryByText('Invalid security code')).not.toBeNull();
        // no failed status for pay request i.e. nothing was submitted
        expect(wrapper.queryByText(`Pay Request Status: ${PayRequestStatus.FAILED}`)).toBeNull();
      });
    }, 15000);

    test('Cannot submit paySheet when supportedNetworks is visa, but mastercard is supplied', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          supportedNetworks: [CardTypeNames.VISA],
          isLive: false,
        } as ClientPayRequestResponse)
      );
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            options: { creditCardForm: { supportedNetworks: [CardTypeNames.VISA] } },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '5105105105105100', 'test name', '01' + useYear, '123');
        // try submitting the empty form
        await pressButton(wrapper, 'pay-button');
        // error messages appear/don't appear
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.CARD_ERROR].type}`)).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.INVALID_CARD_TYPE}`)).not.toBeNull();
      });
    }, 15000);
  });

  describe('Getting new paysecret', () => {
    test('if submitting the pay request fails, tyroError is set with server error and failed to submit error code', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(mockFetch(500, {} as ClientPayRequestResponse)) // submit pay request
        .mockResolvedValueOnce(
          // poll for pay request
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        )
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        // tyroError is set with a Payment failed error
        await pressButton(wrapper, 'pay-button');
        expect(wrapper.getByText(`ErrorType: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].type}`)).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${ErrorCodes.FAILED_TO_SUBMIT}`)).not.toBeNull();
        // get a new pay secret
        await pressButton(wrapper, 'test-button');
        // tyroError is reset
        expect(
          wrapper.queryByText(`ErrorMessage: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].message}`)
        ).toBeNull();
      });
    }, 15000);

    test('when setting a new pay secret, an error occurs e.g. 403 - tyroError will say PaySheet failed to initialise', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ) // init and verify paySecret
        .mockResolvedValueOnce(
          mockFetch(HTTP_ACCEPTED, { status: PayRequestStatus.FAILED, isLive: false } as ClientPayRequestResponse)
        ) // submitPayRequest
        .mockResolvedValueOnce(
          mockFetch(HTTP_OK, {
            status: PayRequestStatus.FAILED,
            isLive: false,
            errorCode: cardDeclined,
          } as unknown as ClientPayRequestResponse)
        ) // pollPayCompletion
        .mockResolvedValueOnce(
          mockFetch(HTTP_FORBIDDEN, {
            status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
            isLive: false,
          } as ClientPayRequestResponse)
        ); // init and verify paySecret again // submitPayRequest
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        await checkInitializedCorrectly(wrapper);
        checkForPaySheetRenders(wrapper);
        await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
        // tyroError is set with a Payment failed error
        await pressButton(wrapper, 'pay-button');
        expect(
          wrapper.getByText(`ErrorMessage: ${TyroErrorMessages[ErrorMessageType.PAY_REQUEST_ERROR].message}`)
        ).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${cardDeclined}`)).not.toBeNull();
        // get a new pay secret`
        await pressButton(wrapper, 'test-button');
        // tyroError is reset
        expect(
          wrapper.getByText(`ErrorMessage: ${TyroErrorMessages[ErrorMessageType.SERVER_ERROR].message}`)
        ).not.toBeNull();
        expect(wrapper.getByText(`ErrorCode: ${HTTP_FORBIDDEN}`)).not.toBeNull();
      });
    }, 15000);
  });

  describe('styleProps handling', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
          supportedNetworks: null,
        } as ClientPayRequestResponse)
      );
      NativeModules.TyroPaySdkModule.initWalletPay.mockResolvedValue(true);
    });
    describe('walletPayments', () => {
      it('defaults walletPaymentsDividerText', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              options: {
                googlePay: {
                  enabled: false,
                  merchantName,
                },
                applePay: {
                  enabled: true,
                  merchantIdentifier,
                  supportedNetworks: ['visa'],
                },
              },
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          expect(wrapper.getByText('Or pay with card')).not.toBeNull();
        });
      });
      it('handles walletPaymentsDividerText', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
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
              styleProps: { walletPaymentsDividerText: 'My Custom Divider Text', showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          expect(wrapper.getByText('My Custom Divider Text')).not.toBeNull();
        });
      });
      it('can disable walletPaymentsDividerEnabled', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
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
              styleProps: { walletPaymentsDividerEnabled: false, showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          expect(wrapper.queryByText('Or pay with card')).toBeNull();
        });
      });
    });
    describe('card images - no card preview rotation', () => {
      it('defaults to showing blank card icon', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          expect(wrapper.getByTestId('card-unknown-image')).not.toBeNull();
          expect(wrapper.getByTestId('card-cvv-image')).not.toBeNull();
          expect(wrapper.queryByTestId('visa-image')).toBeNull();
          expect(wrapper.queryByTestId('mastercard-image')).toBeNull();
        });
      });
      it('it shows visa card when a visa is entered', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '4111111111111111', 'test name', '01' + useYear, '123');
          expect(wrapper.queryByTestId('card-unknown-image')).toBeNull();
          expect(wrapper.getByTestId('visa-image')).not.toBeNull();
          expect(wrapper.queryByTestId('mastercard-image')).toBeNull();
        });
      });
      it('it shows mastercard card when a mastercard is entered', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '5105105105105100', 'test name', '01' + useYear, '123');
          expect(wrapper.queryByTestId('card-unknown-image')).toBeNull();
          expect(wrapper.getByTestId('mastercard-image')).not.toBeNull();
          expect(wrapper.queryByTestId('visa-image')).toBeNull();
          expect(wrapper.queryByTestId('card-error-image')).toBeNull();
        });
      });
      it('it shows error when credit card invalid', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '1234', '', '', '123');
          await pressButton(wrapper, 'pay-button');
          expect(wrapper.getByTestId('card-error-image')).not.toBeNull();
          expect(wrapper.queryByTestId('card-cvv-image')).not.toBeNull();
        });
      });
      it('it shows error when cvc invalid', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '4111111111111111', '', '', '1');
          await pressButton(wrapper, 'pay-button');
          expect(wrapper.getByTestId('card-error-image')).not.toBeNull();
          expect(wrapper.queryByTestId('visa-image')).not.toBeNull();
        });
      });
      it('it shows nothing when disabled and nothing entered', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showCardIcon: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          expect(wrapper.queryByTestId('card-unknown-image')).toBeNull();
          expect(wrapper.queryByTestId('card-cvv-image')).toBeNull();
          expect(wrapper.queryByTestId('card-error-image')).toBeNull();
        });
      });
      it('it shows nothing when disabled and something entered', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showCardIcon: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          await fillOutForm(wrapper, '5105105105105100', 'test name', '01' + useYear, '123');
          expect(wrapper.queryByTestId('card-unknown-image')).toBeNull();
          expect(wrapper.queryByTestId('visa-image')).toBeNull();
          expect(wrapper.queryByTestId('mastercard-image')).toBeNull();
          expect(wrapper.queryByTestId('card-cvv-image')).toBeNull();
          expect(wrapper.queryByTestId('card-error-image')).toBeNull();
        });
      });
    });
    describe('card images - card preview enabled', () => {
      beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(0));
      });
      afterEach(() => {
        jest.useRealTimers();
      });

      it('it shows card preview', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
            });
          });
          await checkInitializedCorrectly(wrapper);
        });
        wrapper.getByTestId('visa-image');
        await act(async () => {
          jest.advanceTimersByTime(2000);
          await waitFor(
            () => {
              wrapper.getByTestId('mastercard-image');
            },
            { timeout: 1000, interval: 500 }
          );
        });
      });
      it('it shows card preview when showCardIcon is false', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showCardIcon: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
        });
        wrapper.getByTestId('visa-image');
        expect(wrapper.queryByTestId('card-unknown-image')).toBeNull();
        expect(wrapper.queryByTestId('card-error-image')).toBeNull();
      });
      it('it shows relative card icon when start entering card number', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
            });
          });
          await checkInitializedCorrectly(wrapper);
          jest.advanceTimersByTime(1000);
        });
        expect(wrapper.queryByTestId('card-unknown-image')).toBeNull();
        wrapper.getByTestId('card-cvv-image');
        wrapper.getByTestId('visa-image');
        const cardInputField = wrapper.getByPlaceholderText('Card number');
        await fireEvent.changeText(cardInputField, '51051');
        expect(wrapper.queryByTestId('card-unknown-image')).toBeNull();
        expect(wrapper.queryByTestId('visa-image')).toBeNull();
        expect(wrapper.queryByTestId('card-error-image')).toBeNull();
        wrapper.getByTestId('mastercard-image');
      });
      it('it shows error when credit card invalid', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
            });
          });
          await checkInitializedCorrectly(wrapper);
          jest.advanceTimersByTime(1000);
        });
        await fillOutForm(wrapper, '1234', '', '', '123');
        await pressButton(wrapper, 'pay-button');
        wrapper.getByTestId('card-error-image');
        wrapper.getByTestId('card-cvv-image');
      });
    });
    describe('showErrorSpacing', () => {
      it('defaults to enable error spacing on all input fields', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          expect(wrapper.queryAllByTestId('error-spacer').length).toEqual(4);
        });
      });
      it('setting true enables error spacing', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showErrorSpacing: true, showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          expect(wrapper.queryAllByTestId('error-spacer').length).toEqual(4);
        });
      });
      it('can disable error spacing', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showErrorSpacing: false, showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          checkForPaySheetRenders(wrapper);
          expect(wrapper.queryAllByTestId('error-spacer').length).toEqual(0);
        });
      });
    });
    describe('labelPositioning', () => {
      it('defaults to use placeholder text with labelPosition=floating', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          expect(wrapper.getByPlaceholderText('Card number')).not.toBeNull();
          expect(wrapper.getByPlaceholderText('Name on card')).not.toBeNull();
          expect(wrapper.getByPlaceholderText('MM/YY')).not.toBeNull();
          expect(wrapper.getByPlaceholderText('CVV')).not.toBeNull();
          expect(wrapper.queryByText('Card number')).toBeNull();
          expect(wrapper.queryByText('Name on card')).toBeNull();
          expect(wrapper.queryByText('Expiry (MM/YY)')).toBeNull();
          expect(wrapper.queryByText('Security code')).toBeNull();
        });
      });
      it('supports label text with labelPosition=block', async () => {
        await act(async () => {
          await waitFor(async () => {
            wrapper = await renderWithProvider(<InitTestComponent passPaySecret={true} />, {
              liveMode: false,
              styleProps: { labelPosition: TyroPayStyleLabelPositions.BLOCK, showSupportedCards: false },
            });
          });
          await checkInitializedCorrectly(wrapper);
          expect(wrapper.getByText('Card number')).not.toBeNull();
          expect(wrapper.getByText('Name on card')).not.toBeNull();
          expect(wrapper.getByText('Expiry (MM/YY)')).not.toBeNull();
          expect(wrapper.getByText('Security code')).not.toBeNull();
          expect(wrapper.queryByPlaceholderText('Card number')).toBeNull();
          expect(wrapper.queryByPlaceholderText('Name on card')).toBeNull();
          expect(wrapper.queryByPlaceholderText('MM/YY')).toBeNull();
          expect(wrapper.queryByPlaceholderText('CVV')).toBeNull();
        });
      });
    });
  });
  describe('basic UI/UX responses', () => {
    it('should focus and blur components on press', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetch(HTTP_OK, {
          status: PayRequestStatus.AWAITING_PAYMENT_INPUT,
          isLive: false,
        } as ClientPayRequestResponse)
      ); // init and verify paySecret
      await act(async () => {
        await waitFor(async () => {
          wrapper = await renderWithProvider(<TestPayButton title={'Pay'} />, {
            liveMode: false,
            styleProps: { showSupportedCards: false },
          });
        });
        checkForPaySheetRenders(wrapper);
        const cardInputField = wrapper.getByPlaceholderText('Card number');
        await fireEvent(cardInputField, 'focus');
        expect(wrapper.getByPlaceholderText('Card number')).toBeSelected();
        await fireEvent(cardInputField, 'blur');
        expect(wrapper.getByPlaceholderText('Card number')).not.toBeSelected();
      });
    });
  });
});
