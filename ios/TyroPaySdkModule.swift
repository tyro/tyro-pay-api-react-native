//
//  TyroPaySdkModule.swift
//  TyroPayApiReactNative
//
//  Created by Ronaldo Gomes on 13/3/2024.
//

import Foundation
import TyroApplePay
import PassKit

typealias RNPaymentItems = [[String: Any]]

enum TyroApplePayErrors: Error {
	case invalidConfiguration
	case invalidPaymentItem
}

@objc(TyroPaySdkModule)
class TyroPaySdkModule: RCTEventEmitter {

	@objc(requiresMainQueueSetup)
	static override func requiresMainQueueSetup() -> Bool {
		return true
	}

	var config: TyroApplePay.Configuration!
	var tyroApplePay: TyroApplePay?
	var paymentItems: [PaymentItem] = []

	private func mapRNPaymentItemsToSDKPaymentItems(_ rnPaymentItems: RNPaymentItems) throws -> [PaymentItem] {
		return try rnPaymentItems.map { paymentItem in
			switch paymentItem["type"] as? String {
			case "custom":
				return .custom(paymentItem["label"] as! String, NSDecimalNumber(string: paymentItem["amount"] as! String))
			case "tax":
				return .tax(paymentItem["amount"] as! NSDecimalNumber)
			case "discount":
				return .discount(paymentItem["amount"] as! NSDecimalNumber)
			default:
				throw TyroApplePayErrors.invalidPaymentItem
			}
		}
	}

	private func getConfigParamOrThrow<T>(_ paramName: String, _ configs: NSDictionary) throws -> T {
		guard let value = configs[paramName] as? T else {
			throw TyroApplePayErrors.invalidConfiguration
		}
		return value
	}

	private func mapSupportedNetworkStringToPKPaymentNetwork(_ paymentNetworks: [String]) -> [PKPaymentNetwork] {
		return paymentNetworks.map({ PKPaymentNetwork($0) })
	}

	@objc(initWalletPay:resolve:rejecter:)
	func initWalletPay(configs: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		do {
			let merchantIdentifier: String = try getConfigParamOrThrow("merchantIdentifier", configs)
			let allowedCardNetworks: [String] = ["Visa", "MasterCard"] //try getConfigParamOrThrow("supportedNetworks", configs)
			let paymentItems: RNPaymentItems = try getConfigParamOrThrow("paymentItems", configs)

			self.paymentItems = try mapRNPaymentItemsToSDKPaymentItems(paymentItems)
			self.config = TyroApplePay.Configuration(
				merchantIdentifier: merchantIdentifier,
				allowedCardNetworks: mapSupportedNetworkStringToPKPaymentNetwork(allowedCardNetworks)
			)
			self.tyroApplePay = TyroApplePay(config: config)
			resolve(true)
		} catch {
			print(error)
			reject("500", "Failed to initialize wallet. Parameters", error)
		}
	}

	@objc(startWalletPay:resolve:rejecter:)
	func startWalletPay(paySecret: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		print("paySecret: \(paySecret)")

		Task.detached { @MainActor in
			do {
				
				let result = try await self.tyroApplePay?.startPayment(paySecret: paySecret, paymentItems: self.paymentItems)

				switch result {
				case .cancelled:
					resolve("cancelled")
				case .success:
					resolve("successed")
				default:
					print("not sure why it is asking to be exhaustive!!!")
				}

			} catch {
				print("failed")
				reject("500", error.localizedDescription, error)
			}
		}

//		let tyroApplePay = TyroApplePay(config: TyroApplePay.Configuration(
//			merchantIdentifier: "merchant.tyro-pay-api-sample-app", // Your merchant id registered for the app on apple developer center
//			allowedCardNetworks: [.visa, .masterCard]
//		))
//
//		Task.detached { @MainActor in
//			do {
//				let paymentItems: [PaymentItem] = [
//					.custom("Burger", NSDecimalNumber(string: "1.00")),
//					.custom("Total", NSDecimalNumber(string: "1.00"))
//				]
//				let result = try await tyroApplePay.startPayment(paySecret: paySecret, paymentItems: paymentItems)
//
//				switch result {
//				case .cancelled:
//					print("Sample App -> ContentView -> ApplePay cancelled")
//					reject()
//				case .success:
//					resolve()
//					print("Sample App -> ContentView -> payment successful")
//				}
//			} catch is TyroApplePayError {
//				reject()
//			}
//		}

	}

}
