(function(angular) {
	'use strict';
	/* Load questions, save responses.*/
	angular.module('myForms').controller('QuestionnaireCtrl', ['$location','$scope','$log', 'Common', 'Questionnaire', function ($location, $scope, $log, Common, Questionnaire) {
		var ctrl = this;
		$scope.$on('globalErrorCheckEvent', function (event, args) {
			 ctrl.page.alert.msg = args.message;
			 
			 });
		this.$onInit = function() {		
			ctrl.mainCtrl = this.mainCtrl;
		}
		
		ctrl.page = {
			title: "Questionnaire",
			alert: {
				type: 'warning',
				msg: ''
			},
			alertTypes : {
				success: 'success',
				info: 'info',
				danger: 'danger',
				warning: 'warning'
			},
			closeAlert:function(){
				this.alert.msg=null;
			}
		};		
		
		// Get live/work addresses!
		var callbackOnSuccess = function(response) {
			ctrl.page.liveWorkAddressesWithQuestions = response.data;
			ctrl.page.noAddrsWithQuests = ctrl.page.liveWorkAddressesWithQuestions.length;
			
			
			ctrl.page.selforms = [];
			
			// Progressbar 
			ctrl.page.noQuestsAnswrd = 0;
			ctrl.page.progressbar = {};
			ctrl.page.progressbar.value = 0;    	
			ctrl.page.progressbar.type = 'warning';
			ctrl.page.progressbar.className = 'progress-striped active';
			ctrl.page.groupsAnswered = [];
			//
			ctrl.page.updateProgress = function(grpId) {
				if (ctrl.page.groupsAnswered.indexOf(grpId) != -1) {
					return false;
				}

				ctrl.page.groupsAnswered.push(grpId);

				if (ctrl.page.noQuestsAnswrd < ctrl.page.noAddrsWithQuests) {
					ctrl.page.noQuestsAnswrd += 1;
					ctrl.page.progressbar.value = (ctrl.page.noQuestsAnswrd / ctrl.page.noAddrsWithQuests) * 100;
					ctrl.page.progressbar.label = ctrl.page.progressbar.value + '%';    			
				}

				if (ctrl.page.noQuestsAnswrd === ctrl.page.noAddrsWithQuests) {
					ctrl.page.progressbar.value = 100;
					ctrl.page.progressbar.label = 'Questionnaire Complete';
					ctrl.page.progressbar.type = 'success';
					ctrl.page.progressbar.className = '';
				}
			};
			
			//
			ctrl.page.handleAnswers = function(grpId) {
				ctrl.page.updateProgress(grpId);
				// More logic here if needed!
			};
			//on button click, save responses update snapshot.
			ctrl.page.fillForms = function() {				
				var selFormsSavedSuccess = function(response) {					
					ctrl.mainCtrl.questionnaire = false;							
				};
				var selFormsSavedError = function() {
				// Update error alert with the errors details returned by server as JSON!
				};
				Questionnaire.updateFormSnapshot(ctrl.page.selforms, selFormsSavedSuccess, selFormsSavedError);
		
			}
		};
		
		var callbackOnError = function(response) {
			// Propagate error here to error component!
		};
		
		Questionnaire.getLiveWorkStatesWithQuestions(callbackOnSuccess, callbackOnError);
		var callbackOnQMsgSuccess = function(response) {
			ctrl.page.alert.type=ctrl.page.alertTypes.info;
			ctrl.page.alert.msg =response.data;
		};
		var callbackOnQMsgError = function(response) {
			// Propagate error here to error component!
		};
		Questionnaire.getQuestionnaireMessge(callbackOnQMsgSuccess, callbackOnQMsgError);
	}]);
})(window.angular);