(function(angular) {
	'use strict';
	
	angular.module('myForms')
		.factory('Forms', ['$http', function($http) {
		  return {
			  getFormsToBeFilled: function(onSuccessCallback, onErrorCallback) {
				 
				$http.get('getFormsToBeFilled.action').then(
					function successCallback(response) {
						onSuccessCallback(response);
					}, 
					function errorCallback(response) {
						
						// Provide actual exception component!
							onErrorCallback(response);
					});
			  },
			  submitForm: function(form, onSuccessCallback, onErrorCallback) {
					$http.post('submitForm.action', form).then(
						function successCallback(response) {	        	    	
							onSuccessCallback(response);
						}, 
						function errorCallback(response) {
							// Provide actual exception component!
							onErrorCallback(response);
						});
			  }, getSubmittedForms: function(callbackOnSuccessPendingForms, callbackOnErrorPendingForms){
				  $http.get('getPendingForms.action').then(
						  function callbackOnSuccess(response) {	        	    	
							  callbackOnSuccessPendingForms(response);
						  }, 
						  function callbackOnError(response) {
							  // Provide actual exception component!
							  callbackOnErrorPendingForms(response);
						  });
			  },
			  getMyFormsTabsData: function(callbackOnSuccessFrmTabs, callbackOnErrorFrmTabs){
				  $http.get('getMyFormsTabsData.action',{
					  ignoreLoadingBar: true
				  }).then(
						  function successCallback(response) {	        	    	
							  callbackOnSuccessFrmTabs(response);
						  }, 
						  function errorCallback(response) {
							  // Provide actual exception component!
							  callbackOnErrorFrmTabs(response);
						  });
			  },
			  getEmpFilteredForms: function(callbackOnSuccessEFF, callbackOnErrorEFF){
				  $http.get('getEmpFilteredForms.action').then(
						  function successCallback(response) {	        	    	
							  callbackOnSuccessEFF(response);
						  }, 
						  function errorCallback(response) {
							  // Provide actual exception component!
							  callbackOnErrorEFF(response);
						  });
			  },
			  updateFormProgress:  function(selReportIDs,callbackOnSuccessEFP, callbackOnErrorEFP){
				  var config = {
						  headers : {
							  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						  }
				  }	            
			      $http.post('updateFormProgress.action?answerBasedReportIDs='+selReportIDs, null, config).then(
						  function successCallback(response) {	        	    	
							  callbackOnSuccessEFP(response);
						  }, 
						  function errorCallback(response) {
							  // Provide actual exception component!
							  callbackOnErrorEFP(response);
						  });
			  },
			  getCompletedForms: function( onSuccessCallback, onErrorCallback) { 
					$http.post('getCompletedForms.action').then(
						function successCallback(response) {	        	    	
							onSuccessCallback(response);
						}, 
						function errorCallback(response) {
							// Provide actual exception component!
							onErrorCallback(response);
						});
			  },
			  getLoginType: function( onSuccessCallback, onErrorCallback) { 
					$http.post('loginType.action').then(
						function successCallback(response) {	        	    	
							onSuccessCallback(response);
						}, 
						function errorCallback(response) {
							// Provide actual exception component!
							onErrorCallback(response);
						});
			  },
			  getChangeForms: function(reportId, effective,onSuccessCallback, onErrorCallback) { 
				  var config = {
						  headers : {
							  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						  }
				  }	            
			      $http.post('getChangeForms.action?selReportId='+reportId+','+effective,null, config).then(
						  function successCallback(response) {	        	    	
							  onSuccessCallback(response);
						  }, 
						  function errorCallback(response) {
							  // Provide actual exception component!
							  onErrorCallback(response);
						  });
			
			  },
			  checkFormStatus: function(reportId, rptEffDate,callbackOnSuccess, callbackOnError){
				   
				   
				    var url = 'CheckRefresh.action';
					url = url + "?ms=" + "'" + new Date().getTime() + "'";
					url = url + "&ajax=true";				
					var repeff = '&reportId=' + reportId;
					repeff += '&effective=' + rptEffDate;				
					url += repeff;
					
					$http.get(url,{
						  ignoreLoadingBar: true
					  }).success(
						function(data, status, headers, config) {						
							if(callbackOnSuccess)
								callbackOnSuccess(data);
					}).error(
						function(data, status, headers, config) {
							if(callbackOnError)
								callbackOnError(data, status);
					});
		},
			  getEffDateParams: function(reportid,callbackOnSuccess, callbackOnError){
				  
				  $http.get('getEffectiveDateParams.action?reportid='+reportid).success(
							function(data, status, headers, config) {						
								if(callbackOnSuccess)
									callbackOnSuccess(data);
						}).error(
							function(data, status, headers, config) {
								if(callbackOnError)
									callbackOnError(data, status);
						});	 	
			  },
			  getRejAndSavedForms: function(callbackOnSuccessRejAndSavedForms, callbackOnErrorRejAndSavedForms){
				  $http.get('getRejAndSavedForms.action').then(
						  function callbackOnSuccess(response) {	        	    	
							  callbackOnSuccessRejAndSavedForms(response);
						  }, 
						  function callbackOnError(response) {
							  // Provide actual exception component!
							  callbackOnErrorRejAndSavedForms(response);
						  });
			  },
			  checkFormsPrefs: function(callbackOnSuccessFrmPref, callbackOnErrorFrmPref){
				  $http.get('checkFormsPrefs.action').then(
						  function successCallback(response) {	        	    	
							  callbackOnSuccessFrmPref(response);
						  }, 
						  function errorCallback(response) {
							  // Provide actual exception component!
							  callbackOnErrorFrmPref(response);
						  }); 	
			  },
			  rejectFailedForm: function(rejectForm, successCallback, failedCallback){				  
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				}
					 
				var data = encodeURIComponent(JSON.stringify(rejectForm));
				var reject = btoa(data);
				
				$http
				.post(
						'rejectForm.action?pendingApprovalData='+reject
					, reject
					, config
				).then(
					function callbackOnSuccess(response) {	        	    	
						successCallback(response);
					}, 
					function callbackOnError(response) {
						failedCallback(response);
					}
				);		 
			 },
			 successFailedForm: function(successForm, successCallback, failedCallback){				  
				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				}
					 
				var data = encodeURIComponent(JSON.stringify(successForm));
				var success = btoa(data);
				$http
				.post(
						'successForm.action?pendingApprovalData='+success
					, success
					, config
				).then(
					function callbackOnSuccess(response) {	        	    	
						successCallback(response);
					}, 
					function callbackOnError(response) {
						failedCallback(response);
					}
				);		 
			 },
			 deleteForm: function(delReportId,delEffDate,delRunDate,delRunTime,callbackOnSuccessDelForm, callbackOnErrorDelForm){
				 
				 var config = {
						  headers : {
							  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						  }
				  }	
				 $http.post('deleteForm.action?delReportId='+delReportId+'&delEffDate='+delEffDate+'&delRunDate='+delRunDate+'&delRunTime='+delRunTime).then(
						  function callbackOnSuccess(response) {	        	    	
							  callbackOnSuccessDelForm(response);
						  }, 
						  function callbackOnError(response) {
							  // Provide actual exception component!
							  callbackOnErrorDelForm(response);
						  });
			  },
			  getPendingApproval: function(callbackOnSuccessFap, callbackOnErrorFap){
				  $http.get('getPendingApproval.action').then(
						  function successCallback(response) {	        	    	
							  callbackOnSuccessFap(response);
						  }, 
						  function errorCallback(response) {
							  // Provide actual exception component!
							  callbackOnErrorFap(response);
						  });
			  },
			  processPendingApproval: function(pendingApproval,callbackOnSuccessPap, callbackOnErrorPap){
				  var config = {
						  headers : {
							  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						  }
				  }
				  var data = encodeURIComponent(JSON.stringify(pendingApproval));
				  var str = btoa(data); // added to fix MOD security issue
				  //console.log(encodeURIComponent(data));
			      $http.post('processPendingApproval.action?pendingApprovalData='+str, str, config).then(
						  function successCallback(response) {	        	    	
							  callbackOnSuccessPap(response);
						  }, 
						  function errorCallback(response) {
							  // Provide actual exception component!
							  callbackOnErrorPap(response);
						  });
			  },
		  };
	}]);
	
	
})(window.angular);