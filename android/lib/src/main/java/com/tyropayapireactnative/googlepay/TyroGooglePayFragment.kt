package com.tyropayapireactnative.googlepay

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.tyro.payapi.googlepayclient.TyroGooglePayClient
import com.tyro.payapi.googlepayclient.constants.GooglePayCardNetwork

class TyroGooglePayFragment : Fragment() {
    private lateinit var tyroGooglePayClient: TyroGooglePayClient
    private lateinit var configs: TyroGooglePayClient.Config
    private lateinit var googlePayCallback: (result: TyroGooglePayClient.Result?) -> Unit
    private lateinit var googlePayAvailableCallback: (isGooglePayAvailable: Boolean) -> Unit

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        return FrameLayout(requireActivity()).also {
            it.visibility = View.GONE
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        tyroGooglePayClient = TyroGooglePayClient(
            fragment = this,
            config = configs,
            googlePayReadyListener = ::onGooglePayReady,
            paymentResultListener = ::onPaymentResult,
        )
    }

    fun startGooglePayFragment(configs: ReadableMap, context: ReactApplicationContext, googlePayAvailableCallback: (isGooglePayAvailable: Boolean) -> Unit) {
        this.googlePayAvailableCallback = googlePayAvailableCallback
        val configAllowedCardNetworks = configs.getArray("supportedNetworks")?.toArrayList()?.map { GooglePayCardNetwork.valueOf(it.toString().uppercase()) }
        this.configs = TyroGooglePayClient.Config(
            liveMode = configs.getBoolean("liveMode").or(false),
            merchantName = configs.getString("merchantName").orEmpty(),
            allowedCardNetworks = configAllowedCardNetworks ?: DEFAULT_CARD_NETWORKS,
        )

        (context.currentActivity as? FragmentActivity)?.let {
            attemptToCleanupPreviousFragment(it)
            commitFragmentAndStartFlow(it)
        }
    }

    fun startGooglePayFlow(paySecret: String, callback: (result: TyroGooglePayClient.Result?) -> Unit) {
        this.googlePayCallback = callback
        tyroGooglePayClient.launchGooglePay(paySecret)
    }

    private fun commitFragmentAndStartFlow(currentActivity: FragmentActivity) {
        try {
            currentActivity.supportFragmentManager.beginTransaction()
                .add(this, TAG)
                .commit()
        } catch (error: IllegalStateException) {
            googlePayCallback(
                null,
            )
        }
    }

    private fun attemptToCleanupPreviousFragment(currentActivity: FragmentActivity) {
        currentActivity.supportFragmentManager.beginTransaction()
            .remove(this)
            .commitAllowingStateLoss()
    }

    private fun onGooglePayReady(googlePayAvailable: Boolean) {
        this.googlePayAvailableCallback(googlePayAvailable)
    }

    private fun onPaymentResult(result: TyroGooglePayClient.Result) {
        this.googlePayCallback(result)
    }

    companion object {
        const val TAG = "tyro_google_pay_fragment"
        val DEFAULT_CARD_NETWORKS = listOf(
            GooglePayCardNetwork.VISA,
            GooglePayCardNetwork.MASTERCARD,
            GooglePayCardNetwork.AMEX,
            GooglePayCardNetwork.JCB,
        )
    }
}
