//
//  ApplePayButtonManager.swift
//  TyroPayApiReactNative
//
//  Created by Ronaldo Gomes on 12/3/2024.
//

import Foundation
import SwiftUI

@objc(ApplePayButtonManager)
class ApplePayButtonManager: RCTViewManager {

	override func view() -> UIView {
		return ApplePayButtonProxy()
	}

	static override func requiresMainQueueSetup() -> Bool {
		return true
	}

}

class ApplePayButtonProxy: UIView {

	var returningView: UIView?

	required init?(coder: NSCoder) {
		fatalError("init(coder:) has not been implemented")
	}

	override init(frame: CGRect) {
		super.init(frame: frame)
		let vc = UIHostingController(rootView: ApplePayButton())
		vc.view.frame = bounds
		self.addSubview(vc.view)
		self.returningView = vc.view
	}

	override func layoutSubviews() {
		super.layoutSubviews()
		self.returningView?.frame = bounds
	}

}
