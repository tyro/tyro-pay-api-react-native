package com.tyropayapireactnative.googlepay

import android.util.Log
import android.view.View
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import com.google.android.gms.wallet.button.ButtonConstants.ButtonTheme
import com.google.android.gms.wallet.button.ButtonConstants.ButtonType
import com.google.android.gms.wallet.button.ButtonOptions
import com.google.android.gms.wallet.button.PayButton
import org.json.JSONArray
import org.json.JSONObject

class GooglePayButtonView(private val context: ThemedReactContext) : FrameLayout(context) {
    private var buttonTypeProp: String? = null
    private var buttonColorProp: String? = null
    private var borderRadiusProp: Int = 4
    private var button: PayButton? = null

    fun initialize() {
        if (button != null) {
            removeView(button)
        }
        button = configureGooglePayButton()
        addView(button)
        viewTreeObserver.addOnGlobalLayoutListener { requestLayout() }
    }

    private fun configureGooglePayButton(): PayButton {
        val googlePayButton = PayButton(
            context,
        )
        googlePayButton.initialize(buildButtonOptions())
        googlePayButton.setOnClickListener { _ ->
            // Call the Javascript TouchableOpacity parent where the onClick handler is set
            (this.parent as? View)?.performClick() ?: run {
                Log.e("TyroPayApiReactNative", "Unable to find parent of GooglePayButtonView.")
            }
        }
        return googlePayButton
    }

    private fun buildButtonOptions(): ButtonOptions {
        val allowedPaymentMethods = JSONObject().apply {
            put("type", "CARD")
            put(
                "parameters",
                JSONObject().apply {
                    put("allowedAuthMethods", JSONArray(listOf("CRYPTOGRAM_3DS", "PAN_ONLY")))
                    put("allowedCardNetworks", JSONArray(TyroGooglePayFragment.DEFAULT_CARD_NETWORKS))
                },
            )
        }

        val options = ButtonOptions.newBuilder().apply {
            getMappedButtonTypeProp()?.let {
                setButtonType(it)
            }
            getMappedButtonThemeProp()?.let {
                setButtonTheme(it)
            }
            setCornerRadius(borderRadiusProp)
            setAllowedPaymentMethods(JSONArray().put(allowedPaymentMethods).toString())
        }
        return options.build()
    }

    private fun getMappedButtonTypeProp(): Int? {
        return when (this.buttonTypeProp) {
            "buy" -> ButtonType.BUY
            "book" -> ButtonType.BOOK
            "checkout" -> ButtonType.CHECKOUT
            "donate" -> ButtonType.DONATE
            "order" -> ButtonType.ORDER
            "subscribe" -> ButtonType.SUBSCRIBE
            "pay" -> ButtonType.PAY
            "plain" -> ButtonType.PLAIN
            else -> null
        }
    }

    private fun getMappedButtonThemeProp(): Int? {
        return when (this.buttonColorProp) {
            "white" -> ButtonTheme.LIGHT
            "black", "default" -> ButtonTheme.DARK
            else -> null
        }
    }

    fun setButtonType(buttonType: String) {
        this.buttonTypeProp = buttonType
    }

    fun setButtonColor(buttonColor: String) {
        this.buttonColorProp = buttonColor
    }

    fun setBorderRadius(borderRadius: Int) {
        this.borderRadiusProp = borderRadius
    }
}
