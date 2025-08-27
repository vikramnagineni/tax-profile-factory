(function(angular) {
	'use strict';

	// must load and manange the lifecycle of the forms in this area.
	angular
			.module('myForms')
			.controller(
					'SubmittedFormsCtrl',
					[
							'$scope',
							'$rootScope',
							'$log',
							'Forms',
							'FormViewerService',
							function($scope,$rootScope, $log, Forms, FormViewerService) {
								var ctrl = this;
								ctrl.completedForms = null;
								ctrl.recentAlerts=null;
								this.$onInit = function() {
									ctrl.page = this.formTabsCtrl.page;
									var tabActive = function() {
										return ctrl.formTabsCtrl.activetab;
									};
									$scope.$watch(tabActive, function(newVal,
											oldVal) {
										$log.debug("active tab: " + newVal);
										if (ctrl.tabindex == newVal) {
											ctrl.page.closeAlert();
											ctrl.loadFormsList();
										}

									});
								}

								// load forms, intialize list.
								ctrl.loadFormsList = function() {
									$log.debug("resetting/loading tab data for pending/submitted tab at index: "
													+ ctrl.tabindex);
									//subForms();
									ctrl.page.alert.type='warning';
									Forms.getSubmittedForms(
											function(response) { // On Success Callback!
												$rootScope.conversionLogout(response.data); //Logs out only if the conversion happened and session expired because of it.
												ctrl.submittedForms = response.data.submittedForms;
												ctrl.alertCount = response.data.alertCount;
												ctrl.page.alert.msg = response.data.recentAlerts;
												ctrl.page.alert.type='warning';
												
											},
											function(response) { 
												ctrl.dataAvailable = true;
												$log.error("Error: " + response);
											}
									);
								}

								ctrl.loadForm = function(form) {
									var testforms = [];
									testforms.push(form);
									FormViewerService.setFormsToFill(testforms);
								};

								// Get Pending/submitted Forms
								var callbackOnSuccessSubForms = function(
										response) {
									ctrl.submittedForms = response.data;
									
								};
								var callbackOnErrorSubForms = function(response) {
									// Propagate error here to error component!
								};
								var subForms = function() {
									Forms.getSubmittedForms(
											callbackOnSuccessSubForms,
											callbackOnErrorSubForms);
								}
								  
							} ]);

	
})(window.angular);