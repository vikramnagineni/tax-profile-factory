(function(angular) {
	'use strict';
	
	//must load and manange the lifecycle of the forms in this area. 
	angular.module('myForms').controller('RejectedFormsCtrl', ['$scope','$rootScope','$log','Forms', 'FormViewerService',  function ($scope,$rootScope, $log,Forms,FormViewerService) {		
		var ctrl = this;	
		ctrl.completedForms = null;
		ctrl.isFormsEditable=true;
		this.$onInit = function() {	
			ctrl.page = this.formTabsCtrl.page;
			ctrl.mainCtrl = this.mainCtrl;
			ctrl.formTabsCtrl = this.formTabsCtrl;
			var tabActive = function(){return ctrl.formTabsCtrl.activetab;};
			$scope.$watch(tabActive, function(newVal, oldVal){
				$log.debug("active tab: " + newVal);	
				if(ctrl.tabindex == newVal)
				{			
					ctrl.page.closeAlert();
					ctrl.loadFormsList();
					//test remove later
					//ctrl.page.alert.msg = 'Test Message From -> Completed Forms';
				}
				
			});
		}
		
		//load forms, intialize list.
		ctrl.loadFormsList = function(){
			$log.debug("resetting/loading tab data for tab at index: " + ctrl.tabindex);
			ctrl.isFormsEditable = String(ctrl.formTabsCtrl.mainCtrl.isFormsEditable);
			rejAndSavedForms();		
			
		}
		
		ctrl.deleteForm=function(delReportId,delEffDate,delRunDate,delRunTime){
			// Get Pending/submitted Forms
			var callbackOnSuccessDelForm = function(
					response) {
				ctrl.loadFormsList();
				
			};
			var callbackOnErrorDelForm = function(response) {
				// Propagate error here to error component!
			};
			var delForm = function(delReportId,delEffDate,delRunDate,delRunTime) {
				Forms.deleteForm(delReportId,delEffDate,delRunDate,delRunTime,
						callbackOnSuccessDelForm,
						callbackOnErrorDelForm);
			}	
			
			delForm(delReportId,delEffDate,delRunDate,delRunTime);
		}
		
		//
		ctrl.loadForm = function(form) {
			var testforms =[];
			testforms.push(form);
			FormViewerService.setFormsToFill(testforms,ctrl.loadFormsList,true);		
		};	
		
		// Get Pending/submitted Forms
		var callbackOnSuccessRejForms = function(
				response) {
			ctrl.rejAndSavedForms = response.data;
			$rootScope.conversionLogout(response.data); //Logs out only if the conversion happened and session expired because of it.
		};
		var callbackOnErrorRejForms = function(response) {
			// Propagate error here to error component!
		};
		var rejAndSavedForms = function() {
			Forms.getRejAndSavedForms(
					callbackOnSuccessRejForms,
					callbackOnErrorRejForms);
		}
		
	
				
	
	}]);
})(window.angular);