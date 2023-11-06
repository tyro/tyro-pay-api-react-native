package com.tyropayapireactnative
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.tyro.payapi.googlepayclient.TyroGooglePayClient
import com.tyro.payapi.payrequest.model.TyroPayRequestError
import com.tyropayapireactnative.googlepay.TyroGooglePayFragment
import com.tyropayapireactnative.googlepay.mapResult

class TyroPaySdkModule internal constructor(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    private lateinit var tyroGooglePayFragment: TyroGooglePayFragment
    override fun getName(): String {
        return "TyroPaySdkModule"
    }

    @ReactMethod
    fun initWalletPay(configs: ReadableMap, promise: Promise) {
        val googlePayConfigs: ReadableMap = configs.getMap("googlePay") ?: run {
            promise.resolve(mapResult(TyroGooglePayClient.Result.Failed(TyroPayRequestError("You must provide the `googlePay` configs."))))
            return
        }
        tyroGooglePayFragment = TyroGooglePayFragment()
        tyroGooglePayFragment.startGooglePayFragment(
            googlePayConfigs,
            reactApplicationContext,
        ) { result ->
            promise.resolve(result)
        }
    }

    @ReactMethod
    fun startWalletPay(paySecret: String, promise: Promise) {
        tyroGooglePayFragment.startGooglePayFlow(paySecret) { result ->
            if (result != null) {
                promise.resolve(mapResult(result))
            }
        }
    }
}
