import { SupportedCardNetworks, SupportedNetworks } from '../@types/tyro-sdk';
import { defaultOptions } from '../@types/default';
import {
  TyroPayOptions,
  TyroPayOptionsKeys,
  TyroPayOptionsOptionsKeys,
  TyroPayOptionsProps,
  TyroPayStylePropKeys,
} from '../@types/definitions';
import { isAndroid, isiOS } from '../utils/helpers';
import { Platform } from 'react-native';
import { ThemeNames, ThemeStyles } from '../@types/theme-styles';
import {
  getSanitizedApplePayStyles,
  getSanitizedGooglePayStyles,
  getSanitizedStyles,
} from '../services/style-properties';
import { StyleProps } from '../@types/style-types';

const deepClone = (object: object): object => JSON.parse(JSON.stringify(object));

export const sanitizeOptions = (options: TyroPayOptionsProps): TyroPayOptions => {
  // Clean the options, and set the defaults
  const useOptions = {
    ...defaultOptions,
    ...options,
    [TyroPayOptionsKeys.styleProps]: {},
    [TyroPayOptionsKeys.options]: {
      [TyroPayOptionsOptionsKeys.applePay]: {
        ...defaultOptions[TyroPayOptionsKeys.options][TyroPayOptionsOptionsKeys.applePay],
        ...(options?.[TyroPayOptionsKeys.options]?.[TyroPayOptionsOptionsKeys.applePay] ?? {}),
      },
      [TyroPayOptionsOptionsKeys.googlePay]: {
        ...defaultOptions[TyroPayOptionsKeys.options][TyroPayOptionsOptionsKeys.googlePay],
        ...(options?.[TyroPayOptionsKeys.options]?.[TyroPayOptionsOptionsKeys.googlePay] ?? {}),
      },
      [TyroPayOptionsOptionsKeys.creditCardForm]: {
        ...defaultOptions[TyroPayOptionsKeys.options][TyroPayOptionsOptionsKeys.creditCardForm],
        ...(options?.[TyroPayOptionsKeys.options]?.[TyroPayOptionsOptionsKeys.creditCardForm] ?? {}),
      },
    },
  };

  // Check and override flag for supported device and wallet schemes
  if (useOptions?.options?.applePay?.enabled === true && isAndroid(Platform.OS)) {
    useOptions.options.applePay.enabled = false;
  }
  if (useOptions?.options?.googlePay?.enabled === true && isiOS(Platform.OS)) {
    useOptions.options.googlePay.enabled = false;
  }

  // Parse options
  const supportedNetworks = parseSupportedNetworks(null, useOptions?.options?.creditCardForm?.supportedNetworks);
  useOptions.options.creditCardForm.supportedNetworks = supportedNetworks ?? undefined;

  // Apply theme defaults
  if (!useOptions?.theme || !Object.values(ThemeNames).includes(useOptions.theme)) {
    useOptions.theme = ThemeNames.DEFAULT;
  }

  // Copy wallet styles
  const providedApplePayStyles = options?.[TyroPayOptionsKeys.styleProps]?.[TyroPayStylePropKeys.applePayButton];
  const providedGooglePayStyles = options?.[TyroPayOptionsKeys.styleProps]?.[TyroPayStylePropKeys.googlePayButton];

  // Clean base styleProps
  useOptions.styleProps = {
    ...defaultOptions[TyroPayOptionsKeys.styleProps],
    ...ThemeStyles[useOptions.theme],
    ...getSanitizedStyles((options?.[TyroPayOptionsKeys.styleProps] ?? {}) as StyleProps),
  };

  // Clean wallet button styles
  useOptions[TyroPayOptionsKeys.styleProps][TyroPayStylePropKeys.applePayButton] = {
    ...defaultOptions[TyroPayOptionsKeys.styleProps][TyroPayStylePropKeys.applePayButton],
    ...getSanitizedApplePayStyles(providedApplePayStyles ?? {}),
  };
  useOptions[TyroPayOptionsKeys.styleProps][TyroPayStylePropKeys.googlePayButton] = {
    ...defaultOptions[TyroPayOptionsKeys.styleProps][TyroPayStylePropKeys.googlePayButton],
    ...getSanitizedGooglePayStyles(providedGooglePayStyles ?? {}),
  };

  return deepClone(useOptions) as TyroPayOptions;
};

export const parseSupportedNetworks = (
  fromPayRequest: SupportedNetworks[] | null,
  fromOptions: SupportedNetworks[] | undefined
): SupportedNetworks[] | null => {
  const availableOptions =
    Array.isArray(fromPayRequest) && fromPayRequest.length
      ? fromPayRequest
      : (Object.values(SupportedCardNetworks) as SupportedNetworks[]);
  const intersection = Array.isArray(fromOptions)
    ? availableOptions.filter((value) => fromOptions.includes(value))
    : availableOptions;
  if (intersection.length === 0 && Array.isArray(fromPayRequest)) {
    return fromPayRequest;
  }
  return intersection.length && intersection.length !== Object.values(SupportedCardNetworks).length
    ? (intersection as SupportedNetworks[])
    : null;
};
