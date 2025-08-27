(function(angular) {
	'use strict';
	
	angular.module('myForms')
		.factory('FormViewerService', ['$log',function($log) {
		  var model = {
				  formsToFill:[],
				  viewingDone:function(){}, //always called. in wizard mode called after wizard is closed or last form is handled.
				  submissionMode:true //false for readonly - applicable in non-wizard modes.
		  };
		  //must use this method to enable viewer, formsToFill attribute should above should not be used directly!
		  model.setFormsToFill = function(formsToFill, callback, subMode) {
			  model.formsToFill = formsToFill;		
			  model.viewingDone = callback;
			  model.submissionMode = subMode;
		  };	
		  
		  
		  return model;
	}]);
})(window.angular);