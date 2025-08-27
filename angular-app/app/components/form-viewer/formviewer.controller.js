(function(angular) {
	'use strict';
	
	angular.module('myForms').controller('FormViewerCtrl', ['$log','$rootScope', '$scope','$interval','$uibModal','uibDateParser', 'FormViewerService','Forms', function ($log,$rootScope, $scope,$interval,$uibModal,uibDateParser,FormViewerService,Forms) {
		var ctrl = this;
		
		ctrl.wizardMode = false; //propagate to modal.
		ctrl.submissionMode = true; //propagate to modal.
		ctrl.canCloseOrSkip = true;
		ctrl.formsToFill = null;
		ctrl.alertmsg = "";
		ctrl.alertmsgdtl = "";
		ctrl.isSubmitting = "";
		ctrl.isSubmitted = false;
		ctrl.isIE = navigator.userAgent.toUpperCase().indexOf("TRIDENT/") != -1 || navigator.userAgent.toUpperCase().indexOf("MSIE") != -1;
		ctrl.pdfAlert = "Fill-in PDFs are not supported on this browser. If you want to update the form, please refer to 'System Requirements' in user help.";

		ctrl.progress = {
				label:'',
				skiplabel:'',
				value:0,
				skipvalue:0,
				filled:0,
				skipped:0,
				total:0,
				reset: function(){
					this.filled = 0;
					this.skipped = 0
					this.total = 0;
					this.label='';
					this.value=0;
					this.skipvalue = 0;
					this.skiplabel = ' ';
				},
				init:function(){
					if(ctrl.formsToFill){
						this.total = ctrl.formsToFill.length;
						this.filled = 0;
						this.value = 0;
						this.skipped = 0;
						this.skipvalue = 0;
						this.updateLabelAndValue();
						this.updateSkippedLabelAndValue();
					}
				},
				updateLabelAndValue:function(){					
					if(this.filled > 0)
						this.label = this.filled + '/' + this.total + ' Complete.';
					else
						this.label = ' ';
					//
					this.value = (this.filled/this.total)*100;
				},
				updateSkippedLabelAndValue:function(){					
					if(this.skipped > 0)
						this.skiplabel = this.skipped + '/' + this.total + ' Skipped.';
					else
						this.skiplabel = ' ';
					//
					this.skipvalue = (this.skipped/this.total)*100;
				}
				
		};	
		ctrl.progress_submit = {
				label:'Submitting Form, please wait...',
				value:0,	
				classz:'',
		};
		ctrl.currentFormParams = {
			initDone:false,
			showEffDateSel:false,
			initDate:'',
			minDate:'',
			maxDate:'',
			taxEffDate:'',
			showWeeks: false,
			currIdx:0,
			reset:function(){
				this.initDone = false;
				this.showEffDateSel = false;
				this.initDate  ='';
				this.minDate='';
				this.maxDate = '';
				this.taxEffDate = '';				
			}
		};
		
		this.$onInit = function() {		
			ctrl.mainCtrl = this.mainCtrl;
			ctrl.isSubmitting = "";
			$log.debug(FormViewerService.formsToFill);
			$scope.$watch(
					 function(){
						    return FormViewerService.formsToFill;
						},
	                 function ( model) {
						 $log.debug("FormViewerService.formsToFill value changed:", model );
						 if(model && model.length >=1){
							 $log.debug("FormViewerService.formsToFill initialized ! :" );
							 ctrl.alertmsg = '';
							 ctrl.currentFormParams.reset();	
							 ctrl.submissionMode = FormViewerService.submissionMode;
							 ctrl.showViewerModal(model);
						 }
	                 }
	             );
		};
		
		ctrl.getFormattedDate=function(date) {
			  var year = date.getFullYear();
			  var month = (1 + date.getMonth()).toString();
			  month = month.length > 1 ? month : '0' + month;
			  var day = date.getDate().toString();
			  day = day.length > 1 ? day : '0' + day;
			  return  ''+year + month + day ;
			};
		 
		 
		 
		
		
		/* show viewer modal - mode is set before modal is shown.*/
		ctrl.showViewerModal = function(formsToFill){
			
			$log.info('Launching modal...: ' + new Date());			
			ctrl.isSubmitting = "";
			if(formsToFill.length > 1)
				ctrl.wizardMode = true;
			else
				ctrl.wizardMode = false;
			//
			ctrl.formsToFill = formsToFill;
			//
			ctrl.viewerInstance = $uibModal.open({
			      animation: ctrl.mainCtrl.useHTML,
			      templateUrl: 'viewerContent.html',
			      controller: 'FormViewerCtrl',
			      scope: $scope,
			      windowClass: 'modal-verylg',
			      backdrop: false
			    });
			//
			ctrl.viewerInstance.result.then(function (result) {
			      //use result if needed
			    }, function () {
			      $log.info('Modal dismissed at: ' + new Date());
			      if(!ctrl.mainCtrl.useHTML){
			    	  ctrl.stopFormStatusCheck();
			      }
			    });
			
			ctrl.viewerInstance.opened.then(function() {
			      $log.info('Modal opened at: ' + new Date());
			      ctrl.alertmsgdtl="";
			      ctrl.alertmsg = 'Loading....';			      
			});
			
			 
		
		    ctrl.closeViewerModal = function(){
		      var callback = FormViewerService.viewingDone;
		      if(callback)
		    	  callback();
			  ctrl.viewerInstance.dismiss('cancel');			  
			 };
			
			ctrl.viewerInstance.rendered.then(function(){
				
				$log.debug('Modal rendered at: ' + new Date());		
				  if(ctrl.mainCtrl.useHTML && !ctrl.wizardMode) {					  
					  var form  = formsToFill[0];
					  ctrl.currentForm = form;	
					  $log.debug('Loading HTML form in viewer...' + angular.toJson(form));	
					  if(ctrl.submissionMode) {
						  ctrl.getEffDateParams(form,ctrl.loadHTMLFormInViewer);						 
					  }
					  else{
						  ctrl.currentFormParams.showEffDateSel=false;
						  ctrl.currentFormParams.initDone = true;	
						  ctrl.loadHTMLFormInViewer(form);
					  }
					 
					  //ctrl.loadHTMLFormInViewer(form);					  
				  }
				  else if (!ctrl.mainCtrl.useHTML) {
					  var form  = formsToFill[0];
					  ctrl.currentForm = form;		
					  $log.debug('Loading PDF form in viewer...' + angular.toJson(form));					 
					  if(ctrl.submissionMode) {
						  ctrl.getEffDateParams(form,ctrl.loadPDFFormInViewer);						 
					  }
					  else{
						  ctrl.currentFormParams.showEffDateSel=false;
						  ctrl.currentFormParams.initDone = true;	
						  ctrl.loadPDFFormInViewer(form);
					  }
				  }
				  else if(ctrl.mainCtrl.useHTML && ctrl.wizardMode){
					  //start in wizard mode.					  
					  var form  = formsToFill[0];
					  ctrl.formsToFill = formsToFill;
					  ctrl.progress.reset();
					  ctrl.progress.init();
					  ctrl.currentForm = form;	
					  ctrl.currentFormParams.currIdx=0;
					  $log.debug('Loading First HTML form in wizard...'  + angular.toJson(form));
					  ctrl.getEffDateParams(form,ctrl.loadHTMLFormInViewer);					 
				  }	
				 
			});		
			 
		  };
		  
		  ctrl.chooseEffDate = function(date){					
				 ctrl.currentFormParams.taxEffDate = ctrl.getFormattedDate(date);			 
				 ctrl.currentFormParams.showEffDateSel=false;
				 if(ctrl.mainCtrl.useHTML && !ctrl.wizardMode) {					  
					  ctrl.loadHTMLFormInViewer( ctrl.currentForm);					  
				  }
				  else if (!ctrl.mainCtrl.useHTML) {
					  ctrl.loadPDFFormInViewer( ctrl.currentForm);
				  }
				  else if(ctrl.mainCtrl.useHTML && ctrl.wizardMode){
					  ctrl.loadHTMLFormInViewer( ctrl.currentForm);					 
				  }	
			 }
		  
		  ctrl.getURLParams=function(form, html){
			  
			  var _url = '?obx=0&reportId='+form.reportid+'&effective='+form.effectiveDate;
			  if(html && !ctrl.submissionMode){
				  _url = _url+'&ro=1';
			  } 
			  if(ctrl.currentFormParams.taxEffDate)
			  {
				 _url = _url + '&taxEffDate='+ctrl.currentFormParams.taxEffDate;
			  }
			  else if(ctrl.currentFormParams.initDate)
			  {
				  _url = _url + '&taxEffDate='+ctrl.getFormattedDate(ctrl.currentFormParams.initDate);
				  
			   }
			  //
			  if(form.onbStatus != -1)
				  _url = _url + '&onBStatus='+form.onbStatus;
			  else
				  _url = _url + '&onBStatus=-1';
			  //
			  if(form.runDate && form.runTime)
				  _url = _url + '&runDate=' + form.runDate +'&runTime=' + form.runTime;
			  else
				  _url = _url + '&runDate=&runTime=';
			  //
			  if(form.empNum)
				  _url = _url + '&empNum=' + form.empNum;
			  //
			  if(form.LT)
				  _url = _url + '&LT=' + form.LT;
			  else
				  _url = _url + '&LT=EE';
			  //
			  if(!html){
				  if(form.MINVER)
					  _url = _url + '&MINVER=' + form.MINVER;
				  else
					  _url = _url + '&MINVER=11';	
			  }
			  
			  return _url;
		  }
		  
		  ctrl.showPdf = function(){
			  
			var url;	
			url = 'showPDF.action';
				
			url += '?OBx=0&reportId=' + ctrl.form.reportid;
			url += '&effective=' + ctrl.form.effectiveDate;
			url += '&onBStatus=' + ctrl.form.onbStatus;	
			url += '&empNum=' + ctrl.form.empNum;
			url += '&runDate=' + ctrl.form.runDate;
			url += '&runTime=' + ctrl.form.runTime;
			url += '&ie=' + ctrl.isIE;
			url += 'amp;LT=ER';
			
						
			var windowName = ctrl.form.reportid + ctrl.form.effectiveDate + ctrl.form.empNum;
			var h = window.open(url, windowName, 'location=0,status=0,toolbar=0,menubar=0,directories=0,resizable=1,scrollbars=1');
			if(ifAlert(form.onbStatus) && !ctrl.isIE){
				 h.alert(ctrl.pdfAlert);  
			}
		  }
		  
		  ctrl.loadHTMLFormInViewer = function(form) {
			  ctrl.isSubmitted = form.onbStatus === 3 || form.onbStatus === 4?true:false;
			  ctrl.form = form;
			  ctrl.canCloseOrSkip = false;
			  ctrl.alertmsg = '';
			  $log.debug('Displaying HTML Form : '+ angular.toJson(form));
			  var _url = 'htmlForm.jsp' + ctrl.getURLParams(form, true);
			  $('#formcontents').attr('src', _url);			 
			  ctrl.canCloseOrSkip = true;
			  
		  };		  
		  
		  function ifAlert(onbStatus){
			  return onbStatus === 2 || onbStatus === 1 || onbStatus === 0 || onbStatus === -1;
		  }
		  
		  ctrl.loadPDFFormInViewer = function(form) {	
			  ctrl.canCloseOrSkip = false;
			  ctrl.alertmsg = '';
			  $log.debug('Displaying PDF Form : '+ angular.toJson(form));			  
			  var _url = 'showPDF.action' +  ctrl.getURLParams(form, false) + "&ie="+ctrl.isIE;	
			  console.log(_url)
			  $('#formcontents').attr('src', _url);

			  if(ifAlert(form.onbStatus) && !ctrl.isIE){
				  setTimeout(function(){
					  alert(ctrl.pdfAlert);  
				  }, 200)
			  }
			  
			  //track status
			  if(ctrl.submissionMode){
			  		ctrl.pdfSubmissionChecker = $interval(ctrl.checkFormStatus, 1000);
		  		}
			  //			  
			  ctrl.canCloseOrSkip = true;
		  };
		  
		  ctrl.skipForm=function(){
			  if(ctrl.wizardMode){
				  ctrl.progress.skipped++;
				  ctrl.progress.updateSkippedLabelAndValue();
				  var currForm = ctrl.formsToFill[ctrl.currentFormParams.currIdx];				 
				  $log.debug('skipping form ' + currForm.rptName);
				  ctrl.formSubmitted(true);
			  }
		  }
		  
		  ctrl.isNotLastForm=function(){
			  return ctrl.wizardMode && ((ctrl.currentFormParams.currIdx+1) != ctrl.formsToFill.length); 
			  
		  }
		  
		  ctrl.formSubmitted = function(skipped){
			  var callback = FormViewerService.viewingDone;
			  ctrl.progress_submit.value = 100;
			  ctrl.canCloseOrSkip = true;
			  if(!ctrl.wizardMode){
				  if(callback)
					  callback();
				  ctrl.closeViewerModal();	
				  ctrl.mainCtrl.isSubmitInProgress = false;
			  }
			  else{
				  //prep next form.
				  $log.debug('preparing next form in the viewer.');
				  ctrl.alertmsg = 'Loading....';
				  if(!skipped){
					  ctrl.progress.filled++;
				  }
				  ctrl.progress.updateLabelAndValue();
				  ctrl.currentFormParams.reset();
				  ctrl.currentFormParams.currIdx++;
				  if(ctrl.currentFormParams.currIdx < ctrl.formsToFill.length)
				  {
					  var nextForm = ctrl.formsToFill[ctrl.currentFormParams.currIdx];
					  ctrl.currentForm = nextForm;
					  //ctrl.alertmsgdtl = nextForm.rptName;
					  $log.debug('next form is ' + angular.toJson(nextForm));
					  ctrl.isSubmitting ="";
					  ctrl.progress_submit.value = 0;
					  ctrl.getEffDateParams(nextForm,ctrl.loadHTMLFormInViewer);
				  }
				  else
				  {
					  if(callback)
						  callback();
					  ctrl.closeViewerModal();	
				  }
				  
			  }
			  
		  };
		  
		  ctrl.formSubmissionStarted = function(){
			  ctrl.mainCtrl.isSubmitInProgress = true;
			  ctrl.isSubmitting = true;
			  ctrl.progress_submit.value = 50;
			  ctrl.canCloseOrSkip = false;
		  };
		  
		  
		  
		  ctrl.checkFormStatus = function(){
			  
			    $log.debug("Checking Status Of Report ID :"+ctrl.currentForm.reportid);
			    Forms.checkFormStatus(ctrl.currentForm.reportid, ctrl.currentForm.effectiveDate, 
			    		function(data) {						
							if(data=='INPROGRESS'){
								$log.debug("form in progress..");
							}else if(data=='SUBMIT_SUCCESS'){							
								ctrl.formSubmitted();
							}else if(data=='SUBMIT_FAILED'){
								ctrl.formSubmitted();
							}
			    	},function(data){
			    		//alert('Unable to check form status!!');
			    		$log.debug('Unable to check form status!!');
			    		})			   
		  };		 
		  
		 ctrl.stopFormStatusCheck = function(){
			
			 if(ctrl.pdfSubmissionChecker)
			 {
				$interval.cancel(ctrl.pdfSubmissionChecker);
				ctrl.pdfSubmissionChecker=null;
			 }
			
		 };
		 
		 ctrl.getDateFromStr = function(dtStr)
			{
				if(dtStr)
				{
					var parts = dtStr.split('/');
					return new Date(parts[2], parts[0]-1, parts[1]);
				}		
		};

		 ctrl.getEffDateParams = function(form, callback){	
			 ctrl.currentFormParams.reset();
			 Forms.getEffDateParams(form.reportid,
			    		function(data) {
				 			 $rootScope.conversionLogout(data);
							 var json = angular.fromJson(data);		
							if(json)
							{
								//json.bypassSelection= true;
								if(json.bypassSelection)
								{									
									ctrl.currentFormParams.initDate  = ctrl.getDateFromStr(json.defaulDate);										
									ctrl.currentFormParams.showEffDateSel = false;
									ctrl.currentFormParams.initDone = true;	
									ctrl.alertmsgdtl = form.rptName;
									if(callback){ //render next visible item
										callback(form);
									}
								}
								else{
									ctrl.currentFormParams.initDate  = ctrl.getDateFromStr(json.defaulDate);
									ctrl.currentFormParams.minDate = ctrl.getDateFromStr(json.minSelDate);
									ctrl.currentFormParams.maxDate = ctrl.getDateFromStr(json.maxSelDate);	
									ctrl.currentFormParams.showEffDateSel = true;			
									ctrl.currentFormParams.initDone = true;
									ctrl.alertmsg = 'Please Choose A Change Effective Date For - ';
									ctrl.alertmsgdtl = form.rptName;
								}
								$log.debug("Form Params: " + angular.toJson(ctrl.currentFormParams));
								
							}
				 
							
			    	},function(data, status){alert('Unable to check form status!!');});		
			 			 
		 };
		 
		 ctrl.pickEffDate = function(){
			 return  ctrl.currentFormParams.initDone && ctrl.currentFormParams.showEffDateSel;
		 };
		 
		 ctrl.canDisplayForm = function(){
			 return ctrl.currentFormParams.initDone && !ctrl.currentFormParams.showEffDateSel;
		 };
			
			
		
	}]);
})(window.angular);