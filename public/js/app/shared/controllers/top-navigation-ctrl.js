/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.shared')
/** Handles interactions with the top menu (mobile menu, mobile search, mobile cart & full screen cart icon) */
    .controller('TopNavigationCtrl', ['$scope', '$rootScope', '$state', '$controller', '$timeout', 'GlobalData', 'CartSvc', 'AuthSvc', 'AuthDialogManager', 'CategorySvc', 'settings', 'YGoogleSignin',

        function ($scope, $rootScope, $state, $controller, $timeout, GlobalData, CartSvc, AuthSvc, AuthDialogManager, CategorySvc, settings, YGoogleSignin) {

            $scope.GlobalData = GlobalData;
            $scope.categories = CategorySvc.getCategoriesFromCache();

            $scope.isAuthenticated = AuthSvc.isAuthenticated;
            $scope.user = GlobalData.user;

            if (AuthSvc.isGoogleLoggedIn(GlobalData.customerAccount)) {
                YGoogleSignin.getUser(settings.googleClientId).then(function (googleUser) {
                    if (googleUser.image) {
                        $scope.user.image = googleUser.image;
                    } else {
                        $scope.user.image = settings.avatarImagePlaceholder;
                    }
                });
            } else {
                $scope.user.image = settings.avatarImagePlaceholder;
            }

            var unbindCats = $rootScope.$on('categories:updated', function(eve, obj){
                if(!$scope.categories || obj.source === settings.eventSource.languageUpdate){
                    $scope.categories = obj.categories;
                }
            });


            $scope.cart =  CartSvc.getLocalCart();
            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                $scope.cart = eveObj.cart;
            });


            $scope.$on('$destroy', unbind);
            $scope.$on('$destroy', unbindCats);

            /** Toggles the "show cart view" state as the cart icon is clicked. Note that this is the
             * actual cart details display, not the icon. */
            $scope.toggleCart = function () {
                if (!$rootScope.showCart) {
                    AuthDialogManager.close();
                }
                $rootScope.showCart = !$rootScope.showCart;
            };

            /** Determines if the cart icon should be displayed.*/
            $scope.isShowCartButton = function () {
                return !$state.is('base.checkout.details') && !$state.is('base.confirmation');
            };

            /** Determines if the wish list icon should be displayed.*/
            $scope.isShowWishListButton = function () {
                return !$state.is('base.checkout.details') && !$state.is('base.confirmation');
            };

            /** Toggles the navigation menu for the mobile view. */
            $scope.toggleOffCanvas = function () {
                $rootScope.showMobileNav = !$rootScope.showMobileNav;
            };

            $scope.logout = function() {
                AuthSvc.signOut();
            };
            
            $scope.login = function(dOpts, opts) {
                AuthDialogManager.open(dOpts, opts);
            };

            $scope.myAccount = function() {
                $state.go('base.account');
            };

        }]);