(function(angular) {
	'use strict';

	angular.module('myForms').component('formsToBeCompleted', {
		templateUrl : 'Employee/scripts/app/components/formslist/formslist.html',
		controller : 'FormsListCtrl',
		require: {
			mainCtrl: '^main',
		    formTabsCtrl: '^formTabs'		   
		},
		bindings: {
			tabindex: '='			
		}
	});
	
})(window.angular);