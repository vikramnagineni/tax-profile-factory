(function(angular) {
	'use strict';

	angular.module('myForms').component('rejectedForms', {
		templateUrl : 'Employee/scripts/app/components/rejectedlist/rejectedlist.html',
		controller : 'RejectedFormsCtrl',
		require: {		   
		    formTabsCtrl: '^formTabs'		   
		},
		bindings: {
			tabindex: '='			
		}
	});
	
})(window.angular);