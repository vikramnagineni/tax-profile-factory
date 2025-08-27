(function(angular) {
	'use strict';
	
	angular.module('myForms')
		.factory('Common', ['$log', '$http', function($log, $http) {
		  return {
		  getCompany: function(onSuccessCallback, onErrorCallback) {
				$http.get('getCompany.action', { cache: true}).then(
					function successCallback(response) {
						onSuccessCallback(response);
					}, 
					function errorCallback(response) {
						// Optionally, provide a dedicated exception component (to achieve a perfect component-tree architecture :))!
						onErrorCallback(response);
					});
		    },
		    getEmployee: function (onEmpSuccessCallback, onEmpErrorCallback){
		  		$http.get('getEmployee.action', { cache: true}).then(
						function successCallback(response) {
							onEmpSuccessCallback(response);
						}, 
						function errorCallback(response) {
							// Optionally, provide a dedicated exception component (to achieve a perfect component-tree architecture :))!
							onEmpErrorCallback(response);
						});
		  	},
		  	getEmployeesFormFormat: function (onFormFormatsCallback, onFormFormatsErrorCallback){
		  		$http.get('getEmployeesFormFormat.action', { cache: true}).then(
						function successCallback(response) {
							$log.info(response);
							onFormFormatsCallback(response);
						}, 
						function errorCallback(response) {
							$log.error(response);
							// Optionally, provide a dedicated exception component (to achieve a perfect component-tree architecture :))!
							onFormFormatsErrorCallback(response);
						});
		  	}
		  };
	}]);
})(window.angular);