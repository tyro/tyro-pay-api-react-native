package com.tyropayapireactnative.googlepay

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class GooglePayButtonManager : SimpleViewManager<GooglePayButtonView>() {
    override fun getName(): String {
        return "GooglePayButton"
    }

    public override fun createViewInstance(reactContext: ThemedReactContext): GooglePayButtonView {
        return GooglePayButtonView(reactContext).also {
            it.initialize()
        }
    }

    private fun reinitializeButton(view: GooglePayButtonView) {
        view.initialize()
    }

    @ReactProp(name = "buttonType")
    fun setButtonType(button: GooglePayButtonView, buttonType: String) {
        button.setButtonType(buttonType)
        reinitializeButton(button)
    }

    @ReactProp(name = "buttonColor")
    fun setButtonColor(button: GooglePayButtonView, buttonColor: String) {
        button.setButtonColor(buttonColor)
        reinitializeButton(button)
    }

    @ReactProp(name = "buttonBorderRadius")
    fun setBorderRadius(button: GooglePayButtonView, borderRadius: Int) {
        button.setBorderRadius(borderRadius)
        reinitializeButton(button)
    }
}
