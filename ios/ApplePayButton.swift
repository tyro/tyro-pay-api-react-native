//
//  ApplePayButton.swift
//  tyroPayApiReactNative
//
//  Created by Ronaldo Gomes on 20/3/2024.
//

import SwiftUI
import PassKit
import TyroApplePay

struct ApplePayButton: View {
	@EnvironmentObject var modernDataStore: ModernDataStore
	@EnvironmentObject var oldDataStore: OldDataStore

	var body: some View {
		VStack {
			if #available(iOS 16, *) {
				PayWithApplePayButton(
					PayWithApplePayButtonLabel.stringToPayWithApplePayButtonLabel(rawValue: modernDataStore.buttonLabel)
				) {}
					.payWithApplePayButtonStyle(
						PayWithApplePayButtonStyle.stringToPayWithApplePayButtonStyle(rawValue: modernDataStore.buttonStyle)
					)
			} else {
				PaymentButtonView(type: self.oldDataStore.buttonLabel, style: self.oldDataStore.buttonStyle)
			}
		}
	}
}
