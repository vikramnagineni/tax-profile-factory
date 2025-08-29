(function(angular) {
	'use strict';
	 angular.module('myForms').controller('ApprovalFormsCtrl', ['$scope','$log','$interval','Forms', 'FormViewerService',  function ($scope, $log,$interval,Forms,FormViewerService) {		
		var ctrl = this;
		var pendingApproval = [];
		ctrl.dataAvailable = null;
		ctrl.page = {			
				alert: {
					type: 'info',
					msg: '',
					tamsg:''
				},
				alertTypes : {
					success: 'success',
					info: 'info',
					danger: 'danger',
					warning: 'warning'
				},
				frmstatus : {
					approve: 'glyphicon glyphicon-ok',
					reject: 'glyphicon glyphicon-remove',
					clear: 'clear'
				},
				radioModel : {
					approve: 'Approved',
					reject: 'Rejected',
					clear: 'Clear'
				},
				radiotoggle: {
					active:'active',
					inactive:''
				},
				closeAlert:function(indx){
					$log.debug("index: "+indx);
					this.alert.msg=null;
				},
				btnstatus:{
					enabled: "enabled",
					disabled: "disabled"
				},
				upbtn:{
					status: "disabled"
				}
		};
		
		this.$onInit = function() {	
			ctrl.title = this.mainCtrl.title;
			ctrl.loadFormsForApproval();
			
		};
		ctrl.loadFormsForApproval = function(){
			$log.debug("reloading tab data for loadFormsForApproval: ");
			ctrl.page.alert.msg = 'Testing';
			ctrl.page.alert.tamsg='';
			ctrl.page.alert.type='warning';
			ctrl.page.approvedForms = [];
			ctrl.radioModel = [];
			ctrl.reasonModel = [];
			ctrl.formsForApproval = null;//reset
			ctrl.alertCount=0;
			ctrl.recentAlerts=null;
			Forms.getPendingApproval(
					function(response) { // On Success Callback!
						if(response.data.formsPending.length > 0){
							ctrl.formsForApproval = response.data.formsPending;
							angular.forEach(ctrl.formsForApproval, function(item, index) {
								ctrl.formsForApproval[index].uistat = ctrl.page.frmstatus.clear;
								ctrl.formsForApproval[index].active = ['','','']; 
								ctrl.formsForApproval[index].effectiveDate = item.effective;
								ctrl.formsForApproval[index].runDate = item.rundate;
								ctrl.formsForApproval[index].onbStatus=item.onbstatus;
								ctrl.formsForApproval[index].LT='ER'
							});
						}
						ctrl.greetingMessage = response.data.greetingMessage;
						ctrl.alertCount = response.data.alertCount;
						ctrl.recentAlerts = response.data.recentAlerts;
						ctrl.employeeNeedsTaxReview = response.data.employeeNeedsTaxReview;
						if(ctrl.employeeNeedsTaxReview >0){
							ctrl.page.alert.tamsg='Employee requires tax approval';
						}
						ctrl.checkForApproval();
						ctrl.dataAvailable = true;
					},
					function(response) { // On Error Callback!
						ctrl.dataAvailable = true;
						$log.error("Error: " + response);
					}
			);
		};
		ctrl.viewForm = function(form) {
			var testforms =[];
			testforms.push(form);
			FormViewerService.setFormsToFill(testforms,function(){},false);		
		};
		ctrl.approveSelected = function(form){
			angular.forEach(ctrl.formsForApproval, function(item, index) {
				if(form.frmName == item.frmName && ctrl.radioModel[form.reportid] == ctrl.page.radioModel.approve){
					ctrl.formsForApproval[index].uistat = ctrl.page.frmstatus.approve;
					ctrl.formsForApproval[index].active =[ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.active,ctrl.page.radiotoggle.inactive];
					ctrl.updateClear(item);
					ctrl.updateApprovalData(item, ctrl.page.radioModel.approve, '');
					ctrl.checkForApproval();
				}
			});
			
		};
		ctrl.rejectSelected = function(form){
			angular.forEach(ctrl.formsForApproval, function(item, index) {
				if(form.frmName == item.frmName && ctrl.radioModel[form.reportid] == ctrl.page.radioModel.reject){
					ctrl.formsForApproval[index].uistat = ctrl.page.frmstatus.reject;
					ctrl.formsForApproval[index].active =[ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.active];
					ctrl.updateClear(item);
					ctrl.updateApprovalData(item, ctrl.page.radioModel.reject, ctrl.reasonModel[item.reportid]);
					ctrl.checkForApproval();
				}
			});
		};
		ctrl.clearSelected = function(form){
			angular.forEach(ctrl.formsForApproval, function(item, index) {
				if(form.frmName == item.frmName && ctrl.radioModel[form.reportid] == ctrl.page.radioModel.clear){
					ctrl.formsForApproval[index].uistat = ctrl.page.frmstatus.clear;
					ctrl.formsForApproval[index].active =[ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.inactive];
					ctrl.updateClear(item);
					ctrl.checkForApproval();
					//ctrl.updateApprovalData(item, ctrl.page.radioModel.clear,'');
				}
			});
		};
		ctrl.approveAllForms = function(){
			pendingApproval=[];
			angular.forEach(ctrl.formsForApproval, function(item, index) {
				ctrl.formsForApproval[index].uistat = ctrl.page.frmstatus.approve;
				ctrl.formsForApproval[index].active =[ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.active,ctrl.page.radiotoggle.inactive];
				ctrl.updateApprovalData(item, ctrl.page.radioModel.approve, '');
				ctrl.checkForApproval();
			});
		};
		ctrl.rejectAllForms = function(){
			pendingApproval=[];
			angular.forEach(ctrl.formsForApproval, function(item, index) {
				ctrl.formsForApproval[index].uistat = ctrl.page.frmstatus.reject;
				ctrl.formsForApproval[index].active =[ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.active];
				ctrl.updateApprovalData(item, ctrl.page.radioModel.reject, ctrl.reasonModel[item.reportid]);
				ctrl.checkForApproval();
			});
		};
		ctrl.clearAllForms = function(){
			pendingApproval=[];
			angular.forEach(ctrl.formsForApproval, function(item, index) {
				ctrl.formsForApproval[index].uistat = ctrl.page.frmstatus.clear;
				ctrl.formsForApproval[index].active =[ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.inactive,ctrl.page.radiotoggle.inactive];
				ctrl.checkForApproval();
			});
		};
		ctrl.updateStatus=function(){
			ctrl.dataAvailable = null;
			$log.debug('TOTOTOTO: '+pendingApproval);
			angular.forEach(pendingApproval, function(item, index) {
					if(ctrl.reasonModel[item.reportid]){
						var res = ctrl.reasonModel[item.reportid];
						if(res.indexOf('#') != -1){
							for(index= res.indexOf('#'); index != -1; index=res.indexOf('#')){
								res = res.substr(0,index) + "zpoundsignz" + res.substr(index+1,res.length);
								item.reason=res;
							}
						}else
							item.reason=res;
							$log.debug(' '+item.reason);
						}
				else{
					item.reason='';
				}
			});
			$log.debug('OTOTOTO: '+pendingApproval);
			var approvalOnSuccessPap = function(response){
				$log.debug(response);
				ctrl.dataAvailable = true;
				pendingApproval =[];
				ctrl.loadFormsForApproval();
				ctrl.checkForApproval();
			};
			var approvalOnErrorPap = function() {
				ctrl.dataAvailable = true;
				  //Update error alert with the errors details returned by server as JSON!
			};
			Forms.processPendingApproval(pendingApproval,approvalOnSuccessPap, approvalOnErrorPap);
		}; 
		ctrl.updateClear =function(itm){
			var index = 0;
			var found;
			var entry;
			for (index = 0; index < pendingApproval.length; ++index) {
			    entry = pendingApproval[index];
			    if (entry.reportid == itm.reportid) {
			        found = entry;
			        pendingApproval.splice(index, 1);
			        break;
			    }
			}
		};
		ctrl.checkForApproval= function(){
			if(pendingApproval.length ==0){
				ctrl.page.upbtn.status = ctrl.page.btnstatus.disabled;
			}else{
				ctrl.page.upbtn.status = ctrl.page.btnstatus.enabled;
			}
		}
		ctrl.updateApprovalData = function(form,status,reason){
			/*var index = 0;
			var found;
			var entry;
			for (index = 0; index < pendingApproval.length; ++index) {
			    entry = pendingApproval[index];
			    if (entry.reportid == form.reportid) {
			        found = entry;
			        pendingApproval.splice(index, 1);
			        break;
			    }
			}*/
			var p1 = { "reportid" :form.reportid, "status" :status, "reason":reason, effective:form.effective};
			pendingApproval.push(p1);
			$log.debug('pendingApproval: '+pendingApproval.toString());
		};
	}]);
})(window.angular);