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
	case invalidConfiguration(String)
	case invalidPaymentItem
}

@objc(TyroPaySdkModule)
class TyroPaySdkModule: RCTEventEmitter {

	@objc(requiresMainQueueSetup)
	static override func requiresMainQueueSetup() -> Bool {
		return true
	}

	private let supportedPaymentNetworks: [String: TyroApplePayCardNetwork] = {
		return TyroApplePayCardNetwork.allCases.reduce(into: [:], { acc, el in
			acc[el.rawValue.rawValue.lowercased()] = el
		})
	}()

	private var config: TyroApplePay.Configuration!
	private var tyroApplePay: TyroApplePay?

	@objc(initWalletPay:resolve:rejecter:)
	func initWalletPay(configs: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
		do {
			guard TyroApplePay.isApplePayAvailable() else {
				resolve(false)
				return
			} 
			let merchantIdentifier: String = try getConfigParamOrThrow("merchantIdentifier", configs, "Merchant Identifier is required")
			let allowedCardNetworks: [String] = try getConfigParamOrThrow("supportedNetworks", configs, "Supported Networks is require")
			let paymentNetworks: [TyroApplePayCardNetwork] = try self.mapSupportedNetworkStringsToTyroApplePayCardNetwork(allowedCardNetworks)

			self.config = TyroApplePay.Configuration(
				merchantIdentifier: merchantIdentifier,
				allowedCardNetworks: paymentNetworks
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
		Task.detached { @MainActor in
			do {
				let result = try await self.tyroApplePay?.startPayment(paySecret: paySecret)

				switch result {
				case .cancelled:
					resolve("cancelled")
				case .success:
					resolve("successed")
				default:
					throw TyroPaySdkModuleError.initializationFailed("SDK not initialized")
				}
			} catch {
				reject("500", error.localizedDescription, error)
			}
		}
	}

	private func mapSupportedNetworkStringsToTyroApplePayCardNetwork(_ paymentNetworks: [String]) throws -> [TyroApplePayCardNetwork] {
		return try paymentNetworks.map { networkName in
			if let tyroApplePayCardNetwork = self.supportedPaymentNetworks[networkName] {
				return tyroApplePayCardNetwork
			} else {
				throw TyroPaySdkModuleError.invalidCaseNetwork("Card Network \(networkName) is invalid")
			}
		}
	}

	private func getConfigParamOrThrow<T>(_ paramName: String, _ configs: NSDictionary, _ message: String) throws -> T {
		guard let value = configs[paramName] as? T else {
			throw TyroApplePayErrors.invalidConfiguration(message)
		}
		return value
	}
}

enum TyroPaySdkModuleError: Error {
	case invalidCaseNetwork(String)
	case initializationFailed(String)
}
