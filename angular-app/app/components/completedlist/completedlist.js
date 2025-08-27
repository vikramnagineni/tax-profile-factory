(function(angular) {
	'use strict';

	angular.module('myForms').component('completedForms', {
		templateUrl : 'Employee/scripts/app/components/completedlist/completedlist.html',
		controller : 'CompletedFormsCtrl',
		require: {		   
		    formTabsCtrl: '^formTabs'		   
		},
		bindings: {
			tabindex: '='			
		}
	});
	
})(window.angular);