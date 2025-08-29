(function(angular) {
	'use strict';
	angular.module('myForms').component('formApprovals', {
		templateUrl : 'Employee/scripts/app/components/approval/approval.html',
		controller : 'ApprovalFormsCtrl',
		require: {
			mainCtrl: '^main'
		}
	});
	
})(window.angular);