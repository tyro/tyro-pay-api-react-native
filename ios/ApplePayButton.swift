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
	@EnvironmentObject var dataStore: DataStore

	var body: some View {
		VStack {
			PayWithApplePayButton(self.dataStore.buttonLabel) {}
				.payWithApplePayButtonStyle(self.dataStore.buttonStyle)
		}
	}
}
