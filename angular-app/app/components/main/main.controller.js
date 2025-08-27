(function(angular) {
    'use strict';
    
    angular.module('myForms').controller('MainCtrl', ['$log', 'Common', 'Questionnaire', 'FormViewerService','$routeParams','$location','$attrs', function ($log, Common, Questionnaire, FormViewerService, $routeParams,$location,$attrs) {
           var ctrl = this;           
           ctrl.questionnaire = true;        
           ctrl.useHTML = true; //def fmt HTML
           var mode = $attrs.mode;
           ctrl.page = {			
                   mode: {
                       approval: 'approval',
                       approve_review_taxes:'approve_review_taxes'
                   }
           };
           ctrl.isFormsEditable= $attrs.formseditable;
           ctrl.empResponse = false;
           //opens pdf of firefox and ie in a new window. (In chrome) the PDF downloads if pdf viewer plugin is disabled.
           ctrl.viewFormInstruction = function(repoId,effDate){   
                  var link = 'ViewPDFFormInstruction?reportId='+repoId+'&effectiveDate='+effDate;
                  var title='Instructions For: ' + repoId;
                  var html = "<html><head><title>" + title + "</title>";
                      html += "</head><body style='margin: 0;'>";                   
                      html += "<iframe height='100%' id='iframe1' width='100%' src='" + link +"''></iframe>";
                      html += "</body></html>";
                      var  title='View Instruction: ' + repoId;
                      var  w='1000';
                      var  h='700';
                      var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
                      var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
                      var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                      var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                      var left = ((width / 2) - (w / 2)) + dualScreenLeft;
                      var top = ((height / 2) - (h / 2)) + dualScreenTop;
                      var newWindow = window.open("", title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
                      newWindow.document.write(html);
                      // Puts focus on the newWindow
                      if (window.focus) {
                          newWindow.focus();
                      }
                      newWindow.document.close ();         
           };
           
           // Get company!
           var callbackOnSuccess = function(response) {
                  ctrl.company = response.data;
           };            
           var callbackOnError = function(response) {
                  // Propagate error here to error component!
           };
           
           Common.getCompany(callbackOnSuccess, callbackOnError);
           
           if(mode === ctrl.page.mode.approval){
                  ctrl.questionnaire = false; 
                  ctrl.formapprovals = true;
                               
                  ctrl.useHTML = false;
                  // Get Employee for title purpose
                  var callbackOnEmpSuccess = function(response) {
                        ctrl.employee = response.data;
                        ctrl.empResponse = true;

                            ctrl.title = "Form Approval - "+"Employee "+ctrl.employee.empnum;                           	

                  };
                  var callbackOnEmpError = function(response) {
                        ctrl.empResponse = false;
                        log.error("Error in loading emp data");
                  };
                  Common.getEmployee(callbackOnEmpSuccess, callbackOnEmpError);
           }else if(mode === ctrl.page.mode.approve_review_taxes){
               ctrl.questionnaire = false; 
               ctrl.formapprovals = false;
               ctrl.reviewapprovetaxes = true;
               // Get Employee for title purpose
               var callbackOnEmpSuccess = function(response) {
                     ctrl.employee = response.data;
                     ctrl.empResponse = true;
                     console.log(response.data);
                         ctrl.title = "Approve Review Taxes - "+"Employee "+ctrl.employee.empnum;                        	

               };
               var callbackOnEmpError = function(response) {
                     ctrl.empResponse = false;
                     log.error("Error in loading emp data");
               };
               Common.getEmployee(callbackOnEmpSuccess, callbackOnEmpError);
           }else{
                  // Check if questions applye to route accordingly!
                  var callbackQuestionsApplyOnSuccess = function(response) {
                        var questionsData = response.data;                    
                        if (questionsData) {
                               ctrl.questionnaire = true;
                                      if(ctrl.empResponse)
                                      {  
                                                  ctrl.title = "Questionnaire - " +"Employee "+ctrl.employee.empnum;  
                                      }else{
                                             ctrl.title = "Questionnaire";
                                      }      
                        } else {
                               ctrl.questionnaire = false;
                               if(!ctrl.empResponse)
                               {
                                            ctrl.title = "My Forms ";
                                   }else{
                                            ctrl.title = "My Forms - " +"Employee "+ctrl.employee.empnum;                                      }                  
                        }
                  };            
                  var callbackQuestionsApplyOnError = function(response) {
                        // Propagate error here to error component!
                  };            
                  Questionnaire.checkIfQuestionsApply(callbackQuestionsApplyOnSuccess, callbackQuestionsApplyOnError); 
                  
                  //get supported formats...        
                  var callbackFFOnSuccess = function(response) {
                        var suppFmts = response.data;            
                        ctrl.useHTML=true;
                        if(suppFmts == 'HTML')
                               ctrl.useHTML = true;
                        else
                               ctrl.useHTML=false;
                        $log.debug("can use HTML: " + ctrl.useHTML);                         
                  };            
                  var callbackFFOnError = function(response) {
                        // Propagate error here to error component!
                  };     
                  Common.getEmployeesFormFormat(callbackFFOnSuccess,callbackFFOnError);
                  // Get Employee for title purpose
                  var callbackOnEmpSuccess = function(response) {
                        ctrl.employee = response.data;
                        ctrl.empResponse = true;
                  };
                  
                  var callbackOnEmpError = function(response) {
                        
                        ctrl.empResponse = false;
                        log.error("Error in loading emp data");
                  };
                  Common.getEmployee(callbackOnEmpSuccess, callbackOnEmpError);
           }
    }]);
})(window.angular);
