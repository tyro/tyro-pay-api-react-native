//
//  TyroPaySdkModule.m
//  TyroPayApiReactNative
//
//  Created by Ronaldo Gomes on 13/3/2024.
//

#import "React/RCTBridgeModule.h"
#import "Foundation/Foundation.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(TyroPaySdkModule, RCTEventEmitter)
RCT_EXTERN_METHOD(initWalletPay: (nonnull NSDictionary *)configs resolve: (RCTPromiseResolveBlock) resolve rejecter: (RCTPromiseRejectBlock) reject)
RCT_EXTERN_METHOD(startWalletPay: (nonnull NSString *)paySecret resolve: (RCTPromiseResolveBlock) resolve rejecter: (RCTPromiseRejectBlock) reject)
@end
