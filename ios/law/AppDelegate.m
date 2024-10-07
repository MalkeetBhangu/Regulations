/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import <Firebase.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"
#import "Orientation.h" 

@implementation AppDelegate

- (void) splashFade
{
  _splashView = [[UIImageView alloc] initWithFrame:CGRectMake(0,0, 320, 480)];
  _splashView.image = [UIImage imageNamed:@"login_3.png"];
  [_window addSubview:_splashView];
  [_window bringSubviewToFront:_splashView];
  [UIView beginAnimations:nil context:nil];
  [UIView setAnimationDuration:2.0];
  [UIView setAnimationDelay:2.5];
  [UIView setAnimationTransition:UIViewAnimationTransitionNone forView:_window cache:YES];
  [UIView setAnimationDelegate:self];
  [UIView setAnimationDidStopSelector:@selector(startupAnimationDone:finished:context:)];
  _splashView.alpha = 0.0;
  [UIView commitAnimations];
  
  //Create and add the Activity Indicator to splashView
  UIActivityIndicatorView *activityIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhite];
  activityIndicator.alpha = 1.0;
  activityIndicator.center = CGPointMake(160, 360);
  activityIndicator.hidesWhenStopped = NO;
  [_splashView addSubview:activityIndicator];
  [activityIndicator startAnimating];
}

- (void)startupAnimationDone:(NSString *)animationID finished:(NSNumber *)finished context:(void *)context
{
  [_splashView removeFromSuperview];
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //[self performSelector:@selector(splashFade) withObject:nil];
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"law"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [RNSplashScreen show];
  return YES;
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


@end
