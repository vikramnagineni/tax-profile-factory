(function(angular) {
	'use strict';

	angular.module('myForms').component('main', {
		templateUrl : 'Employee/scripts/app/components/main/main.html',
		controller : 'MainCtrl',
		bindings: {
			mode: '@',
			formseditable: '@'
		}		
	});
	
})(window.angular);