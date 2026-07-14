#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTComponent.h>

@interface DPButton : UIButton
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@end

@implementation DPButton
@end

@interface DPButtonManager : RCTViewManager
@end

@implementation DPButtonManager

RCT_EXPORT_MODULE(DPButton)

- (UIView *)view
{
  DPButton *button = [DPButton new];
  button.backgroundColor = [UIColor lightGrayColor]; 
  [button addTarget:self action:@selector(handlePress:) forControlEvents:UIControlEventTouchUpInside];
  return button;
}

- (void)handlePress:(DPButton *)sender
{
  if (sender.onPress) {
    sender.onPress(@{});
  }
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

#pragma mark - Props

RCT_CUSTOM_VIEW_PROPERTY(title, NSString, DPButton)
{
  NSString *title = json ? [RCTConvert NSString:json] : @"title";
  NSLog(@"Setting title: %@", title); 
  [view setTitle:title forState:UIControlStateNormal];
}


RCT_CUSTOM_VIEW_PROPERTY(color, NSString, DPButton)
{
  NSString *hex = json ? [RCTConvert NSString:json] : @"#000000";
  UIColor *color = [self colorFromHexString:hex];
  [view setTitleColor:color forState:UIControlStateNormal];
}


RCT_CUSTOM_VIEW_PROPERTY(backgroundColor, id, DPButton)
{
  if ([json isKindOfClass:[NSString class]]) {
    NSString *hex = [RCTConvert NSString:json];
    UIColor *color = [self colorFromHexString:hex];
    view.backgroundColor = color;
  } else if ([json isKindOfClass:[NSNumber class]]) {
    view.backgroundColor = [RCTConvert UIColor:json];
  } else {
    view.backgroundColor = [UIColor lightGrayColor];
  }
}


RCT_CUSTOM_VIEW_PROPERTY(disabled, BOOL, DPButton)
{
  BOOL isDisabled = json ? [RCTConvert BOOL:json] : NO;
  view.enabled = !isDisabled;
  view.alpha = isDisabled ? 0.5 : 1.0;
}

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

#pragma mark - Helper

- (UIColor *)colorFromHexString:(NSString *)hexString
{
  unsigned rgbValue = 0;
  NSScanner *scanner = [NSScanner scannerWithString:hexString];
  [scanner setScanLocation:([hexString hasPrefix:@"#"] ? 1 : 0)];
  [scanner scanHexInt:&rgbValue];
  return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16) / 255.0
                         green:((rgbValue & 0x00FF00) >> 8) / 255.0
                          blue:(rgbValue & 0x0000FF) / 255.0
                         alpha:1.0];
}

@end
