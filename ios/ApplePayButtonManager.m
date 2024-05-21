//
//  ApplePayButtonManager.m
//  TyroPayApiReactNative
//
//  Created by Ronaldo Gomes on 12/3/2024.
//

#import "Foundation/Foundation.h"
#import "React/RCTBridgeMethod.h"
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(ApplePayButtonManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(buttonStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(buttonLabel, NSString)

@end
