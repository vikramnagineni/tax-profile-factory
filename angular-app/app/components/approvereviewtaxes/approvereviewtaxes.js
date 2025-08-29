(function(angular) {
	'use strict';
	angular.module('myForms').component('approveReviewTaxes', {
		templateUrl : 'Employee/scripts/app/components/approvereviewtaxes/approvereviewtaxes.html',
		controller : 'ApproveReviewTaxesCtrl',
		require: {
			mainCtrl: '^main'
		}
	});
	
})(window.angular);