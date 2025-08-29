(function(angular) {
	'use strict';
	 angular.module('myForms').controller('ApproveReviewTaxesCtrl', ['$scope','$log','$interval','$confirm', 'ApproveReview',  function ($scope, $log,$interval,$confirm,ApproveReview) {
		var ctrl = this;
		var pendingApproval = [];
		ctrl.dataAvailable = null;
		ctrl.page = {			
				alert: {
					type: 'success',
					msg: '',
					typewarning:'warning',
					warningmsg:'',
					typedanger:'danger',
					dangermsg:'BSI disclaims any and all liability arising from the customer adding and/or deleting employee taxes.'
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
				checkModel : {
					YES: 'YES',
					NO: 'NO'
				},
				radiotoggle: {
					active:'active',
					inactive:''
				},
				closeAlert:function(indx){
					$log.debug("index: "+indx);
					this.alert.msg=null;
				},
				closeAlertDel:function(indx){
					$log.debug("index: "+indx);
					this.alert.warningmsg=null;
				},
				adbtnstatus:{
					enabled: "enabled",
					disabled: "disabled"
				},
				upbtn:{
					status: "disabled"
				},
				
				
		};
		ctrl.rescodes = [{'name': 'Live', 'value': '0'},{'name': 'Work','value': '1'}, {'name': 'Live/Work','value': '3'}];
		ctrl.selected
		ctrl.mapToListOfAttribute = function (list, property) {
			var result = [];
			for(var i=0; i<list.length; i++) {
				var elem = list[i][property];
				if(elem===undefined) {
					elem = "";
				}
				elem = elem.trim();
				if (property == "formNames") {
					var rowForms = elem.split(',');
					for (var j = 0; j < rowForms.length; j++) {
						var form = rowForms[j].trim();
						if (result.indexOf(form) < 0) {
							result.push(form);
						}
					}
				}
				else if (result.indexOf(elem) < 0) {
					result.push(elem);
				}
			}
			var result=result.sort();
			result.unshift("All");
			return result;
		}
		$scope.authFilter = "All";
		$scope.taxNameFilter = "All";
		$scope.residencyFilter = "All";
		$scope.formsFilter = "All";
		$scope.changedFilter = function(filter, newVal) {
			$scope[filter] = newVal;
		}
		ctrl.checkHide = function(row) {
			var authName = row.authName===undefined?"":row.authName.trim();
			var taxName = row.taxName===undefined?"":row.taxName.trim();
			var rescodeDesc = row.rescodeDesc===undefined?"":row.rescodeDesc.trim();
			var formNames = row.formNames===undefined?"":row.formNames.trim();
			return !((authName===$scope.authFilter || ($scope.authFilter!=='' && authName.indexOf($scope.authFilter)>-1) || $scope.authFilter=="All") &&
			         (taxName===$scope.taxNameFilter || ($scope.taxNameFilter!=='' && taxName.indexOf($scope.taxNameFilter)>-1) || $scope.taxNameFilter=="All") &&
				     (rescodeDesc===$scope.residencyFilter || ($scope.residencyFilter!=='' && rescodeDesc.indexOf($scope.residencyFilter)>-1) || $scope.residencyFilter=="All") &&
				     (formNames===$scope.formsFilter || ($scope.formsFilter!=='' && formNames.indexOf($scope.formsFilter)>-1) || $scope.formsFilter=="All")
			);
		}
		ctrl.selectResCode = function(itemsel,taxtype){
			$log.debug(itemsel+", "+taxtype);
			angular.forEach(ctrl.authorityTaxDatas, function(item, index) {
				if(taxtype === item.taxtype){
	    			ctrl.authorityTaxDatas[index].btnstatus = ctrl.page.adbtnstatus.enabled;
	    			ctrl.authorityTaxDatas[index].rescode   = itemsel.name;
	    		}
			});
		}
		ctrl.approveTaxes = function(){
			var callbackOnSuccessapt  = function(response){
				$log.debug(response);
				ctrl.dataAvailable = true;
				ctrl.deletetaxes =[];
				ctrl.authorityTaxDatas=[];
				$log.info("Inside Approve Taxes");
				ctrl.popover ='Taxes approved'
				ctrl.page.alert.msg = 'Employee Taxes Approved';
				ctrl.loadApproveReviewTaxes();
			};
			var callbackOnErrorapt = function() {
				ctrl.dataAvailable = true;
			};
			$confirm({text: 'You have approved taxes for this employee. The employee is marked ready to export.', title: 'Approve', ok: 'OK', cancel: 'Cancel'})
		        .then(function() {
		        	ApproveReview.approveEmployeeTaxes(callbackOnSuccessapt, callbackOnErrorapt);
		    });
		}
		ctrl.addTax = function addTax(addedTax){
			$log.debug("Added tax : "+addedTax)
			var callbackOnSuccessat = function(response){
				$log.debug(response);
				ctrl.dataAvailable = true;
				ctrl.deletetaxes =[];
				ctrl.authorityTaxDatas=[];
				ctrl.loadApproveReviewTaxes();
				ctrl.popover ='Taxes added'
				ctrl.page.alert.msg='You have added an employee tax. Please select Approve for Export to export added tax to payroll.';
			};
			var callbackOnErrorat = function() {
				ctrl.dataAvailable = true;
				//Update error alert with the errors details returned by server as JSON!
			};
			ApproveReview.processAddTax(addedTax,callbackOnSuccessat, callbackOnErrorat)
		};
		ctrl.deletetaxesModel=[];
		ctrl.deletetaxes=[];
		ctrl.toggleSelection = function toggleSelection(tax) {
			$log.debug('=======> '+ctrl.deletetaxesModel[tax.seqNum]);
			if(ctrl.deletetaxesModel[tax.seqNum] == ctrl.page.checkModel.NO){
				var idx = ctrl.deletetaxes.indexOf(tax);
				//is currently selected
				if (idx > -1) {
					ctrl.deletetaxes.splice(idx, 1);
				}
			}
			if(ctrl.deletetaxesModel[tax.seqNum] == ctrl.page.checkModel.YES){
				var idx = ctrl.deletetaxes.indexOf(tax);
				//is currently selected
				if (idx > -1) {
					//ctrl.deletetaxes.splice(idx, 1);
				}// is newly selected
				else {
					ctrl.deletetaxes.push(tax);
				}
			}
		  };
		ctrl.deleteEmpTaxes = function(){
			//$log.debug('ctrl.deletetaxes : '+ctrl.deletetaxes);
			var deletetaxesforser=[]; 
			var approvalOnSuccessPdt = function(response){
				//$log.debug(response);
				ctrl.dataAvailable = true;
				ctrl.deletetaxes =[];
				ctrl.popover ='Taxes deleted';
				ctrl.page.alert.warningmsg='You have manually deleted taxes. To keep systems in sync, please delete this employee\'s tax in your payroll system.';
				ctrl.loadApproveReviewTaxes();
			};
			var approvalOnErrorPdt = function() {
				ctrl.dataAvailable = true;
				  //Update error alert with the errors details returned by server as JSON!
			};
			angular.forEach(ctrl.deletetaxes, function(tax, index) {
					var taxSelected = { "dsId" :tax.dsId,"empNum": tax.empNum, "compId" :tax.compId, "bsiauth":tax.bsiauth,"taxtype":tax.taxtype,"onbstat":tax.onbstat, "startDate":tax.startDate,"seqNum":tax.seqNum,"sourceType":tax.sourceType,"authName":tax.authName,"taxName":tax.taxName};
					deletetaxesforser.push(tax);
			});
			ApproveReview.processDeleteTaxes(deletetaxesforser, approvalOnSuccessPdt, approvalOnErrorPdt)
		};
		ctrl.selUndoDeleteModel=[]; 
		ctrl.selUndoDeleteEmptaxes=[];     
		ctrl.toggleUndoDeleteSelection = function toggleUndoDeleteSelection(unddtax) {
			if(ctrl.selUndoDeleteModel[unddtax.seqNum] == ctrl.page.checkModel.NO){
				var idxundo = ctrl.selUndoDeleteEmptaxes.indexOf(unddtax);
				if (idxundo > -1) {
					ctrl.selUndoDeleteEmptaxes.splice(idxundo, 1);
				}
			}
			if(ctrl.selUndoDeleteModel[unddtax.seqNum] == ctrl.page.checkModel.YES){
			    var idxundo = ctrl.selUndoDeleteEmptaxes.indexOf(unddtax);
			    if (idxundo > -1) {
			    }else {
			      //
				  ctrl.selUndoDeleteEmptaxes.push(unddtax);
			    }
			}
		  };

		  ctrl.undoDeleteTaxes = function(){
			  var undoTaxes =[];
				$log.debug('ctrl.selUndoDeleteEmptaxes : '+ctrl.selUndoDeleteEmptaxes);
				var approvalOnSuccessPundt = function(response){
					$log.debug(response);
					ctrl.dataAvailable = true;
					ctrl.selUndoDeleteEmptaxes =[];
					ctrl.page.alert.warningmsg='';
					ctrl.loadApproveReviewTaxes();
				};
				var approvalOnErrorPundt = function() {
					ctrl.dataAvailable = true;
					  //Update error alert with the errors details returned by server as JSON!
				};
				angular.forEach(ctrl.selUndoDeleteEmptaxes, function(unddtax, index) {
					var taxUdoSelected = { "dsId" :unddtax.dsId,"empNum": unddtax.empNum, "compId" :unddtax.compId, "bsiauth":unddtax.bsiauth,"taxtype":unddtax.taxtype,"onbstat":unddtax.onbstat, "startDate":unddtax.startDate,"seqNum":unddtax.seqNum,"sourceType":unddtax.sourceType,"authName":unddtax.authName,"taxName":unddtax.taxName};
					undoTaxes.push(taxUdoSelected);
				});
				ApproveReview.processUndoDeleteTaxes(undoTaxes, approvalOnSuccessPundt, approvalOnErrorPundt)
			};
		  
		this.$onInit = function() {	
			ctrl.title = this.mainCtrl.title;
			ctrl.loadApproveReviewTaxes();
		};
		ctrl.onAuthSelect = function ($item, $model, $label) {
			   // $log.debug("$item "+$item+", $model : "+$model+", $label : "+$label+", bsiauth : "+$model.bsiauth);
			    var callbackOnSuccessGt = function(response){
			    	ctrl.authorityTaxDatas = response.data;
			    	angular.forEach(ctrl.authorityTaxDatas, function(item, index) {
			    		ctrl.authorityTaxDatas[index].btnstatus = ctrl.page.adbtnstatus.disabled;
					});
				};
				var callbackOnErrorGt = function() {
					ctrl.dataAvailable = true;
				};
				ApproveReview.getTaxesForAuthorities($model.bsiauth,callbackOnSuccessGt, callbackOnErrorGt); 
		};
		ctrl.loadApproveReviewTaxes = function(){
			$log.debug("reloading tab data for loadApproveReviewTaxes: ");
			/*ctrl.page.alert.msg = 'Testing';
			ctrl.page.alert.type='warning';*/
			ctrl.dataAvailable = false
			ctrl.taxesForReviewNApproval = null;//reset
			ApproveReview.getApproveReviewTaxes(
				function(response) {
					//if(response.data.taxesForReviewNApproval){
						ctrl.taxesForReviewNApproval = response.data.taxesForReviewNApproval;
						$scope.authChoices = ctrl.mapToListOfAttribute(ctrl.taxesForReviewNApproval, "authName");
						$scope.taxNameChoices = ctrl.mapToListOfAttribute(ctrl.taxesForReviewNApproval, "taxName");
					    $scope.residencyChoices = ctrl.mapToListOfAttribute(ctrl.taxesForReviewNApproval, "rescodeDesc");
					    $scope.formsChoices = ctrl.mapToListOfAttribute(ctrl.taxesForReviewNApproval, "formNames");
						ctrl.deletedEmpTaxes = response.data.deletedEmpTaxes;
						ctrl.authData = response.data.authorityData;
						ctrl.canEditTaxData =  response.data.canEditTaxes;
						ctrl.canApproveTaxes = response.data.canApproveTaxes;
						ctrl.exportsWithholdingFormsOnly = response.data.exportsWithholdingFormsOnly;
						/*angular.forEach(ctrl.taxesForReviewNApproval, function(item, index) {
							
						});*/
					//}
					ctrl.greetingMessage = response.data.greetingMessage;
					ctrl.dataAvailable = true;
				}, 
				function(response) {
					ctrl.dataAvailable = true;
					$log.error("Error: " + response);
				})
			};
	}]).filter('capitalize', function() {
	    return function(x) {
		var i, txt = "";
		for (i = 0; i < x.length; i++) {
			if (x[i] == " ") {
				i++;
				txt += " " + x[i].toUpperCase();
			} else {
				txt += x[i];
			}
		}
		txt = txt.substring(0, 1).toUpperCase() + txt.substring(1);
		return txt;
	}
	});
})(window.angular);