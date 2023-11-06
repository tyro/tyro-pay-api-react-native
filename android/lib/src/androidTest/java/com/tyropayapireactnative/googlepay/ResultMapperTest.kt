package com.tyropayapireactnative.googlepay

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.soloader.SoLoader
import com.tyro.connect.googlepayclient.TyroGooglePayClient
import com.tyro.connect.payrequest.constants.TyroPayRequestErrorType
import com.tyro.connect.payrequest.model.TyroPayRequestError
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test

class ResultMapperTest {
    private val reactApplicationContext = ReactApplicationContext(
        ApplicationProvider.getApplicationContext<Context>(),
    )

    @Before
    fun setUp() {
        SoLoader.init(reactApplicationContext, false)
    }

    @Test
    fun mapResultShouldReturnCancelled() {
        assertEquals(
            mapResult(TyroGooglePayClient.Result.Cancelled),
            WritableNativeMap().apply {
                putString("status", "CANCELLED")
            },
        )
    }

    @Test
    fun mapResultShouldReturnSuccess() {
        assertEquals(
            mapResult(TyroGooglePayClient.Result.Success),
            WritableNativeMap().apply {
                putString("status", "SUCCESS")
            },
        )
    }

    @Test
    fun mapResultShouldReturnFailed() {
        assertEquals(
            mapResult(
                TyroGooglePayClient.Result.Failed(
                    error = TyroPayRequestError(
                        errorMessage = "message",
                        errorType = TyroPayRequestErrorType.CARD_ERROR,
                        errorCode = "errorCode123",
                        gatewayCode = "gatewayCode69",
                    ),
                ),
            ),
            WritableNativeMap().apply {
                putString("status", "FAILED")
                putMap(
                    "error",
                    WritableNativeMap().apply {
                        putString("errorMessage", "message")
                        putString("errorType", "CARD_ERROR")
                        putString("errorCode", "errorCode123")
                        putString("gatewayCode", "gatewayCode69")
                    },
                )
            },
        )
    }
}
