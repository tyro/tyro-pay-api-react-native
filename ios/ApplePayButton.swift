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
	var body: some View {
		VStack {
			PayWithApplePayButton(PayWithApplePayButtonLabel.buy) {}
		}
	}
}
