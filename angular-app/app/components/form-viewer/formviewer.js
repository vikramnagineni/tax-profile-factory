(function(angular) {
	'use strict';

	angular.module('myForms').component('formViewer', {
		templateUrl : 'Employee/scripts/app/components/formviewer/formviewer.html',
		controller : 'FormViewerCtrl',
		require: {
			mainCtrl: '^main'
		}
	});
})(window.angular);