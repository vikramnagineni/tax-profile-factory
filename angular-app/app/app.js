(function(angular) {
	
	
	'use strict';	
	angular.module('myForms', ['ngRoute', 'ngAria', 'ngAnimate', 'ui.bootstrap', 'angular-loading-bar','angular-confirm'])
	.run(function ($rootScope, $location, $log, VERSION) {
		// Application wide init steps can be specified here (e.g. application constants, i18n, etc.)!
		$rootScope.VERSION = VERSION;
		$rootScope.conversionLogout = function(view){
			try{
				var parser = new DOMParser();
				var parsed = jQuery(parser.parseFromString(view, "text/html"));
				var selected =parsed.find("#update").val();
				if(selected === 'updating')
					window.location = "switchLogout.action";
			}catch(err){}
		};
	}).config(['$logProvider','$httpProvider','cfpLoadingBarProvider', function($logProvider,$httpProvider,cfpLoadingBarProvider){
	    $logProvider.debugEnabled(false);
	    $httpProvider.interceptors.push('bgCheckErrorHandler');
	    	
	    //cfpLoadingBarProvider.parentSelector = '#content';#navbar
	    //cfpLoadingBarProvider.parentSelector = '#body';
	    //cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
	    //cfpLoadingBarProvider.includeSpinner = true;
	    //cfpLoadingBarProvider.parentSelector = '#navbar';
	}])
	
	
}) (window.angular);