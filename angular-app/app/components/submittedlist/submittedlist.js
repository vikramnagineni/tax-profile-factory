(function(angular) {
	'use strict';

	angular.module('myForms').component('submittedForms', {
		templateUrl : 'Employee/scripts/app/components/submittedlist/submittedlist.html',
		controller : 'SubmittedFormsCtrl',
		require: {		   
		    formTabsCtrl: '^formTabs'		   
		},
		bindings: {
			tabindex: '='			
		}
	});
	
})(window.angular);