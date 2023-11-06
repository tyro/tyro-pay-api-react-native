package com.tyropayapireactnative.googlepay

import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.tyro.payapi.googlepayclient.TyroGooglePayClient

internal fun mapResult(result: TyroGooglePayClient.Result): WritableMap {
    val resultMap: WritableMap = WritableNativeMap()
    var walletPaymentResult: WalletPaymentResult
    when (result) {
        TyroGooglePayClient.Result.Cancelled -> {
            walletPaymentResult = WalletPaymentResult.CANCELLED
        }
        TyroGooglePayClient.Result.Success -> {
            walletPaymentResult = WalletPaymentResult.SUCCESS
        }
        is TyroGooglePayClient.Result.Failed -> {
            walletPaymentResult = WalletPaymentResult.FAILED
            val (errorMessage, errorType, errorCode, gatewayCode) = result.error
            val error: WritableMap = WritableNativeMap().apply {
                putString("errorMessage", errorMessage)
                putString("errorType", errorType.toString())
                putString("errorCode", errorCode)
                putString("gatewayCode", gatewayCode)
            }
            resultMap.putMap("error", error)
        }
    }
    resultMap.putString("status", walletPaymentResult.toString())
    return resultMap
}
