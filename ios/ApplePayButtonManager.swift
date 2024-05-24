//
//  ApplePayButtonManager.swift
//  TyroPayApiReactNative
//
//  Created by Ronaldo Gomes on 12/3/2024.
//

import Foundation
import SwiftUI
import PassKit

extension PayWithApplePayButtonStyle {
	static func stringToPayWithApplePayButtonStyle(rawValue: String) -> Self {
		switch rawValue {
		case "black": return .black
		case "white": return .white
		case "whiteOutline": return .whiteOutline
		default:
			return .automatic
		}
	}
}

extension PayWithApplePayButtonLabel {
	static func stringToPayWithApplePayButtonLabel(rawValue: String) -> Self {
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
		default:
			return .plain
		}
	}
}

@objc(ApplePayButtonManager)
class ApplePayButtonManager: RCTViewManager {

	override func view() -> UIView {
		return ApplePayButtonProxy()
	}

	static override func requiresMainQueueSetup() -> Bool {
		return true
	}
}

class ModernDataStore: ObservableObject {
	@Published var buttonLabel: PayWithApplePayButtonLabel = .plain
	@Published var buttonStyle: PayWithApplePayButtonStyle = .automatic
}

class OldDataStore: ObservableObject {
	@Published var buttonLabel: PKPaymentButtonType = .plain
	@Published var buttonStyle: PKPaymentButtonStyle = .automatic
}

class ApplePayButtonProxy: UIView {

	var returningView: UIView?
	let modernDataStore: ModernDataStore = .init()
	let oldDataStore: OldDataStore = .init()

	required init?(coder: NSCoder) {
		fatalError("init(coder:) has not been implemented")
	}

	override init(frame: CGRect) {
		super.init(frame: frame)
		let vc = UIHostingController(rootView: ApplePayButton()
			.environmentObject(self.modernDataStore)
			.environmentObject(self.oldDataStore)
		)
		vc.view.frame = bounds
		self.addSubview(vc.view)
		self.returningView = vc.view
	}

	override func layoutSubviews() {
		super.layoutSubviews()
		self.returningView?.frame = bounds
	}

	@objc
	var buttonStyle: String = "" {
		didSet {
			if #available(iOS 16, *) {
				modernDataStore.buttonStyle = PayWithApplePayButtonStyle.stringToPayWithApplePayButtonStyle(rawValue: buttonStyle)
			} else {
				oldDataStore.buttonStyle = PKPaymentButtonStyle.stringToPKPaymentButtonStyle(rawValue: buttonStyle)
			}
		}
	}

	@objc
	var buttonLabel: String = "" {
		didSet {
			if #available(iOS 16, *) {
				modernDataStore.buttonLabel = PayWithApplePayButtonLabel.stringToPayWithApplePayButtonLabel(rawValue: buttonLabel)
			} else {
				oldDataStore.buttonLabel = PKPaymentButtonType.stringToPKPaymentButtonType(rawValue: buttonLabel)
			}
		}
	}
}
