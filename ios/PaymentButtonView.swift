//
//  PaymentButtonView.swift
//  tyro-pay-api-react-native
//
//  Created by Ronaldo Gomes on 24/5/2024.
//

import TyroApplePay
import SwiftUI
import PassKit

struct PaymentButtonView: View {
	var type: PKPaymentButtonType
	var style: PKPaymentButtonStyle
	var action: (() -> Void)?

	var height: CGFloat = 45

	var body: some View {
		Representable(paymentButtonType: type, paymentButtonStyle: style, action: action)
			.frame(minWidth: 300, maxWidth: 100)
			.frame(height: height)
			.frame(maxWidth: .infinity)
	}

}

extension PaymentButtonView {
	class Coordinator: NSObject {
		var action: (() -> Void)?
		var button: PKPaymentButton

		init(paymentButtonType type: PKPaymentButtonType, paymentButtonStyle style: PKPaymentButtonStyle, action: (() -> Void)?) {
			self.action = action
			self.button = PKPaymentButton(paymentButtonType: type, paymentButtonStyle: style)
			super.init()
			button.addTarget(self, action: #selector(callback(_:)), for: .touchUpInside)
		}

		@objc
		func callback(_ sender: Any) {
			action?()
		}
	}

	struct Representable: UIViewRepresentable {
		var action: (() -> Void)?
		var type: PKPaymentButtonType
		var style: PKPaymentButtonStyle

		init(paymentButtonType type: PKPaymentButtonType, paymentButtonStyle style: PKPaymentButtonStyle, action: (() -> Void)?) {
			self.type = type
			self.style = style
			self.action = action
		}

		func makeCoordinator() -> Coordinator {
			Coordinator(paymentButtonType: type, paymentButtonStyle: style, action: action)
		}

		func makeUIView(context: Context) -> UIView {
			context.coordinator.button
		}

		func updateUIView(_ rootView: UIView, context: Context) {
			context.coordinator.action = action
		}
	}
}

extension PKPaymentButtonStyle {
	static func stringToPKPaymentButtonStyle(rawValue: String) -> Self {
		switch rawValue {
		case "black": return .black
		case "white": return .white
		case "whiteOutline": return .whiteOutline
		default:
			return .automatic
		}
	}
}

extension PKPaymentButtonType {
	static func stringToPKPaymentButtonType(rawValue: String) -> Self {
		switch rawValue {
		case "addMoney": return .addMoney
		case "book": return .book
		case "buy": return .buy
		case "checkout": return .checkout
		case "continue": return .continue
		case "contribute": return .contribute
		case "donate": return .donate
		case "inStore": return .inStore
		case "order": return .order
		case "reload": return .reload
		case "rent": return .rent
		case "setUp": return .setUp
		case "subscribe": return .subscribe
		case "support": return .support
		case "tip": return .tip
		case "topUp": return .topUp
		default: return .plain
		}
	}
}
