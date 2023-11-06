package com.tyropayapireactnative.googlepay

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class GooglePayButtonManager : SimpleViewManager<GooglePayButtonView?>() {
    override fun getName(): String {
        return "GooglePayButton"
    }

    override fun onAfterUpdateTransaction(view: GooglePayButtonView) {
        super.onAfterUpdateTransaction(view)
        view.initialize()
    }

    public override fun createViewInstance(reactContext: ThemedReactContext): GooglePayButtonView {
        return GooglePayButtonView(reactContext)
    }

    @ReactProp(name = "buttonType")
    fun setButtonType(button: GooglePayButtonView, buttonType: String) {
        button.setButtonType(buttonType)
    }

    @ReactProp(name = "buttonColor")
    fun setButtonColor(button: GooglePayButtonView, buttonColor: String) {
        button.setButtonColor(buttonColor)
    }

    @ReactProp(name = "buttonBorderRadius")
    fun setBorderRadius(button: GooglePayButtonView, borderRadius: Int) {
        button.setBorderRadius(borderRadius)
    }
}
