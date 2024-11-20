//
//  WalletPaymentResult.swift
//  tyro-pay-api-react-native
//
//  Created by Ronaldo Gomes on 12/11/2024.
//

import Foundation

public enum WalletPaymentStatus: String, Codable {
	case success 		= "SUCCESS"
	case cancelled	= "CANCELLED"
	case failed			= "FAILED"
}

public enum ErrorType: String, Codable {
	case clientInitialisationError = "CLIENT_INITIALISATION_ERROR"
	case payRequestError = "PAY_REQUEST_ERROR"
	case serverError = "SERVER_ERROR"
	case cardError = "CARD_ERROR"
	case unknown = "UNKNOWN"
}

public struct WalletPaymentErrorInfo: Codable {
	var errorMessage: String? = nil
	var errorType: ErrorType? = nil
	var errorCode: String? = nil
	var gatewayCode: String? = nil
}

public struct WalletPaymentResult: Codable {
	let status: WalletPaymentStatus
	let error: WalletPaymentErrorInfo?

	public func toJSON() throws -> String? {
		let encoder = JSONEncoder()
		let data = try encoder.encode(self)
		return String(data: data, encoding: .utf8)
	}
}
