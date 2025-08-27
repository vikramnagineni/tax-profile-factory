(function(angular) {
	'use strict';

	angular.module('myForms').component('questionnaire', {
		templateUrl : 'Employee/scripts/app/components/questionnaire/questionnaire.html',
		require: {
			mainCtrl: '^main'
		},
		controller : 'QuestionnaireCtrl'		
	});	
})(window.angular);