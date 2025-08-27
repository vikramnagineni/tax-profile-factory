// API service for Questionnaire component
// Replace these mock implementations with actual API calls in production

export const QuestionnaireApiService = {
    // Get live/work states with questions
    getLiveWorkStatesWithQuestions: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return [
        {
          id: 1,
          stateName: 'CALIFORNIA',
          description: 'For the purposes of income tax withholding in CALIFORNIA, which form do you want to complete?',
          forms: [
            {
              id: 'CAW4',
              title: 'Employee\'s Withholding Allowance Certificate',
              formType: 'CA W-4',
              description: 'California state withholding certificate',
              hasInstructions: true,
              instructions: '<p>Complete this form to determine the correct California income tax withholding from your pay.</p><ul><li>Fill out personal information</li><li>Select filing status</li><li>Calculate allowances</li></ul>'
            },
            {
              id: 'CADE4',
              title: 'Employee\'s Withholding Allowance Certificate - Nonresident',
              formType: 'CA DE-4',
              description: 'For nonresident employees working in California',
              hasInstructions: true,
              instructions: '<p>Use this form if you are a nonresident of California but work in the state.</p>'
            }
          ]
        },
        {
          id: 2,
          stateName: 'INDIANA',
          description: 'For the purposes of income tax withholding in INDIANA, which form do you want to complete?',
          forms: [
            {
              id: 'INW4',
              title: 'Employee\'s Withholding Exemption and County Status Certificate',
              formType: 'Indiana WH-4',
              description: 'Indiana state withholding exemption certificate',
              hasInstructions: true,
              instructions: '<p>Complete this form to claim withholding exemptions for Indiana state income tax.</p><ul><li>Personal exemptions</li><li>County information</li><li>Additional withholding</li></ul>'
            }
          ]
        },
        {
          id: 3,
          stateName: 'FEDERAL',
          description: 'For federal income tax withholding, please select the appropriate form:',
          forms: [
            {
              id: 'W4',
              title: 'Employee\'s Withholding Certificate',
              formType: 'Federal W-4',
              description: 'Federal income tax withholding certificate',
              hasInstructions: true,
              instructions: '<p>Use this form to let your employer know how much federal income tax to withhold from your pay.</p><ul><li>Personal information</li><li>Multiple jobs worksheet</li><li>Claim dependents</li><li>Other adjustments</li></ul>'
            }
          ]
        }
      ];
    },
  
    // Get questionnaire message
    getQuestionnaireMessage: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Return message or null
      return 'Please complete the questionnaire by selecting the form applicable to your specific tax situation.';
    },
  
    // Update form snapshot with selected forms
    updateFormSnapshot: async (selectedForms) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      console.log('Updating form snapshot with:', selectedForms);
      
      return {
        success: true,
        message: 'Form selections saved successfully',
        selectedForms: selectedForms,
        nextStep: 'forms_completion'
      };
    },
  
    // Get form details by ID
    getFormDetails: async (formId) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const formDetails = {
        'CAW4': {
          id: 'CAW4',
          title: 'California Employee\'s Withholding Allowance Certificate',
          formType: 'CA W-4',
          effectiveDateRequired: true,
          minDate: '2024-01-01',
          maxDate: '2024-12-31',
          fields: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'ssn', label: 'Social Security Number', type: 'text', required: true },
            { name: 'filingStatus', label: 'Filing Status', type: 'select', required: true, options: ['Single', 'Married', 'Head of Household'] }
          ]
        },
        'INW4': {
          id: 'INW4',
          title: 'Indiana Employee\'s Withholding Exemption Certificate',
          formType: 'Indiana WH-4',
          effectiveDateRequired: true,
          minDate: '2024-01-01',
          maxDate: '2024-12-31',
          fields: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'county', label: 'County', type: 'select', required: true, options: ['Marion', 'Hamilton', 'Johnson', 'Other'] }
          ]
        },
        'W4': {
          id: 'W4',
          title: 'Federal Employee\'s Withholding Certificate',
          formType: 'Federal W-4',
          effectiveDateRequired: false,
          fields: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'ssn', label: 'Social Security Number', type: 'text', required: true },
            { name: 'filingStatus', label: 'Filing Status', type: 'select', required: true, options: ['Single', 'Married filing jointly', 'Married filing separately', 'Head of household'] }
          ]
        }
      };
  
      return formDetails[formId] || null;
    },
  
    // Check if questionnaire applies to current user
    checkIfQuestionsApply: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Return true if questionnaire should be shown
      return true;
    },
  
    // Get user's previous questionnaire responses
    getPreviousResponses: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        hasResponses: false,
        responses: []
      };
    },
  
    // Save questionnaire progress
    saveProgress: async (progressData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('Saving questionnaire progress:', progressData);
      
      return {
        success: true,
        message: 'Progress saved successfully'
      };
    }
  };
  
  // React hook for easier usage in components
  export const useQuestionnaireApi = () => {
    return {
      getLiveWorkStatesWithQuestions: QuestionnaireApiService.getLiveWorkStatesWithQuestions,
      getQuestionnaireMessage: QuestionnaireApiService.getQuestionnaireMessage,
      updateFormSnapshot: QuestionnaireApiService.updateFormSnapshot,
      getFormDetails: QuestionnaireApiService.getFormDetails,
      checkIfQuestionsApply: QuestionnaireApiService.checkIfQuestionsApply,
      getPreviousResponses: QuestionnaireApiService.getPreviousResponses,
      saveProgress: QuestionnaireApiService.saveProgress
    };
  };
  