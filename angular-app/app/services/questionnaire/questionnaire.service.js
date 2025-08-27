(function(angular) {
	'use strict';
	
	angular.module('myForms')
		.factory('Questionnaire', ['$http', function($http) {
		  return {
			  getLiveWorkStatesWithQuestions: function(onSuccessCallback, onErrorCallback) {
				$http.get('getLiveWorkStatesWithQuestions.action').then(
					function successCallback(response) {
						onSuccessCallback(response);
					}, 
					function errorCallback(response) {
						// Provide actual exception component!
						onErrorCallback(response);
					});
		    },
		    checkIfQuestionsApply: function(onSuccessCallback, onErrorCallback) {
				$http.get('checkIfQuestionsApply.action').then(
					function successCallback(response) {
						onSuccessCallback(response);
					}, 
					function errorCallback(response) {
						// Provide actual exception component!
						onErrorCallback(response);
					});
		    },
		    updateFormSnapshot: function(selReportIDs, onSuccessCallback, onErrorCallback) {
		    	
	        
	            var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            }	            
	           

	            $http.post('updateFormSnapshot.action?answerBasedReportIDs='+selReportIDs, null, config).then(
	            		function successCallback(response) {	        	    	
							onSuccessCallback(response);
						}, 
						function errorCallback(response) {
							// Provide actual exception component!
							onErrorCallback(response);
						});		    	
		    	},
		    	getQuestionnaireMessge: function(callbackOnSuccessQMsg, callbackOnErrorQMsg){
					  $http.get('getQuestionnaireMessge.action').then(
						  function successCallback(response) {	        	    	
							  callbackOnSuccessQMsg(response);
						  }, 
						  function errorCallback(response) {
							  callbackOnErrorQMsg(response);
						  }); 	
				  },
		  };
	}]);
})(window.angular);