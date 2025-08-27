(function(angular) {
	'use strict';
	
	//must load and manange the lifecycle of the forms in this area. 
	angular.module('myForms').controller('FormsListCtrl', ['$scope','$rootScope','$log','$uibModal','Forms', 'FormViewerService',  function ($scope, $rootScope,$log,$uibModal,Forms,FormViewerService) {		
		var ctrl = this;	
		ctrl.currentForm = {};
		ctrl.submittedForms = [];
		ctrl.alertmsg = "nothing";
		ctrl.showChooserContent =true;
		ctrl.selectedformssend=[];
		ctrl.alertsuccess = false;
		ctrl.isFormsEditable=true;
		ctrl.progress = {
				type: 'warning',
				className: 'progress-bar progress-bar-striped active'			
		};
		ctrl.isFormsEditable=true;
		this.$onInit = function() {
			ctrl.mainCtrl = this.mainCtrl;
			ctrl.formTabsCtrl = this.formTabsCtrl;
			ctrl.page = this.formTabsCtrl.page;
			var tabActive = function(){return ctrl.formTabsCtrl.activetab;};
			$scope.$watch(tabActive, function(newVal, oldVal){
				$log.debug("active tab: " + newVal);	
				if(ctrl.tabindex == newVal)
				{	
					ctrl.page.closeAlert();
					ctrl.loadFormsList();				
					ctrl.checkFormsPrefs();
				}
				
			});
		};
		ctrl.updateProgress = function(noSubmForms, noFormsToBeFilled) {
			
			if (noSubmForms == noFormsToBeFilled) {
				ctrl.progress.value = 0;
				ctrl.progress.label = '';
				ctrl.progress.type = 'success';
				ctrl.progress.className = 'progress-bar';
			}else if(noSubmForms != noFormsToBeFilled && noSubmForms >0){
				ctrl.progress.value = Math.floor(((noFormsToBeFilled -noSubmForms) / noFormsToBeFilled) * 100);
				ctrl.progress.label = 'Forms ' + ctrl.progress.value + '% Completed';	
			}
		};
		ctrl.showChooserModal = function(){
			$log.debug("Inside chooser !");
			ctrl.alertsuccess =false;
			var callbackOnSuccessEFF = function(response){
				$log.debug("response : "+response);
				$rootScope.conversionLogout(response.data); //Logs out only if the conversion happened and session expired because of it.
				ctrl.chooserInstance = $uibModal.open({
				      animation: true,
				      templateUrl: 'chooserContentFroms.html',
				      controller: 'FormsListCtrl',
				      scope: $scope,
				      windowClass: 'modal-verylg'
				});
				ctrl.chooserInstance .result.then(function (result) {
				      //use result if needed
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
				ctrl.chooserInstance .rendered.then(function(){
					  ctrl.loadDataInChooser(response.data);
				});
			}
			var callbackOnErrorEFF = function(response) {
				// Propagate error here to error component!
			};	
			Forms.getEmpFilteredForms(callbackOnSuccessEFF, callbackOnErrorEFF);
			
			
		};
		ctrl.handleAnswers = function(frmId) {
			ctrl.selectedformssend=[];
			ctrl.selectedformssend.push(frmId);
			$log.debug("frmId selectedformssend : "+ctrl.selectedformssend);
			$log.debug("frmId selectedforms     : "+ctrl.selectedforms);
		};
		ctrl.loadDataInChooser = function(forms) {
			
			ctrl.otherForms = forms;
			$log.debug("Load Data in Chooser : "+forms);
		};
		ctrl.closeChooserModal = function(){
			 ctrl.chooserInstance.dismiss('cancel');
			  
		};
		ctrl.chooseSelectedForms = function(){
			$log.debug("Selected forms : "+ctrl.selectedforms);
			  var selFormsSavedSuccess = function(response) {
				  ctrl.selectedforms = [];
				  ctrl.alertsuccess = true;
				  ctrl.alertsuccessmsg ='Updated selcted form successfully.';
				  ctrl.loadFormsList();
				  ctrl.chooserInstance.dismiss('cancel');
			  };
			  var selFormsSavedError = function() {
				  //Update error alert with the errors details returned by server as JSON!
			  };
			  Forms.updateFormProgress(ctrl.selectedformssend, selFormsSavedSuccess, selFormsSavedError);
		};
		
		ctrl.checkFormsPrefs = function(){
			var chkEmpPrefSuccess = function(response){
				if(response.data!=""){
					ctrl.page.alert.msg = response.data;
					ctrl.page.alert.type='warning';
				}else{
					
				}
			};
			var chkEmpPrefError = function() {
				  //Update error alert with the errors details returned by server as JSON!
			};
			Forms.checkFormsPrefs(chkEmpPrefSuccess,chkEmpPrefError);
		};
		
		//load forms, intialize list.
		ctrl.loadFormsList = function(){
			$log.debug("resetting/loading tab data for tab at index: " + ctrl.tabindex);
			ctrl.progress = {};
			ctrl.progress.value = 0;
			ctrl.progress.type = 'success';
			ctrl.progress.className = 'progress-striped active';
			ctrl.formsToBeFilled = null;//reset
			ctrl.isFormsEditable = String(ctrl.formTabsCtrl.mainCtrl.isFormsEditable);
			//load from db			
			
			Forms.getFormsToBeFilled(
					function(response) { // On Success Callback!
						ctrl.isFormsEditable=ctrl.mainCtrl.isFormsEditable;
						ctrl.formsToBeFilled = response.data.result;
						ctrl.updateProgress(response.data.totalFormsToBeFilled, response.data.totalForms);
						$log.debug("getFormsToBeFilled : "+ctrl.formsToBeFilled);
						angular.forEach(ctrl.formsToBeFilled, function(item, index) {
							ctrl.formsToBeFilled[index].submitted = false; 
						});
						ctrl.origFormsToBeFilled = ctrl.formsToBeFilled;
						
					},
					function(response) { // On Error Callback!
						$log.error("Error: " + response);
					}
				);
			
		};		

		//
		ctrl.viewForm = function(form) {
			var testforms =[];
			testforms.push(form);
			FormViewerService.setFormsToFill(testforms,ctrl.loadFormsList,true);		
		};	
		
		ctrl.viewFormWizard = function() {
			var testforms =[];
			if(!ctrl.formsToBeFilled || ctrl.formsToBeFilled.length == 0)
				return;
			for (var prop in ctrl.formsToBeFilled) {
				if(ctrl.formsToBeFilled[prop]){
				 var tempfrms = ctrl.formsToBeFilled[prop];
				 var i = 0;
				  for(i=0;i<tempfrms.length;i++)
				  	if(tempfrms[i].isEditable===true) {
						testforms.push(tempfrms[i]);
					}
				}
				
			}			
			FormViewerService.setFormsToFill(testforms,ctrl.loadFormsList, true);		
		};	
		//
		ctrl.getTitle = function(isSubmitted) {
			return !isSubmitted ? 'Fill Form' : 'Form has been submitted!';
		};
		
		//
		//TOD update this logic
		ctrl.isFormSubmitted = function(candForm) {
			var result = false;
			angular.forEach(ctrl.submittedForms, function(submForm, index) {
				if (!result && candForm.reportid == submForm.reportid && candForm.effectiveDate == submForm.effectiveDate) {
					result = true;
				}
			});
			return result;
		};
		
		//wizard mode is available for html forms 
		ctrl.canUseWizard = function(){
			return ctrl.formTabsCtrl.mainCtrl.useHTML;
		};
	}]);
})(window.angular);