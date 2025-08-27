// API service for Main component
// Replace these mock implementations with actual API calls in production

export const EmployeeFormsApiService = {
    // Get company information
    getCompany: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        legalname: "TPF Dev & Data, Inc.",
        id: "12345",
        address: {
          street: "123 Business Ave",
          city: "Indianapolis",
          state: "IN",
          zip: "46240"
        },
        taxId: "12-3456789"
      };
    },
  
    // Get employee information
    getEmployee: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 250));
      
      return {
        empnum: "42151",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@tpfdev.com",
        department: "Engineering",
        hireDate: "2023-01-15",
        status: "Active"
      };
    },
  
    // Check if questionnaire questions apply to the employee
    checkIfQuestionsApply: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Return true if questionnaire should be shown, false for direct forms
      // This could be based on employee status, previous submissions, etc.
      return false; // Mock: questionnaire applies
    },
  
    // Get supported form formats for the employee
    getEmployeesFormFormat: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Return supported format: 'HTML' or 'PDF'
      return 'HTML'; // Mock: HTML forms are supported
    },
  
    // Get form instruction PDF URL
    getFormInstructionUrl: (reportId, effectiveDate) => {
      return `ViewPDFFormInstruction?reportId=${reportId}&effectiveDate=${effectiveDate}`;
    },
  
    // Additional utility methods
    validateSession: async () => {
      // Simulate session validation
      await new Promise(resolve => setTimeout(resolve, 100));
      return { valid: true, expires: new Date(Date.now() + 3600000) }; // 1 hour from now
    },
  
    // Get user permissions
    getUserPermissions: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        canEditForms: true,
        canViewApprovals: false,
        canApproveReviewTaxes: false,
        useWizard: true,
        viewInstructions: true
      };
    },
  
    // Log user activity
    logActivity: async (activity, details = {}) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      console.log('Activity logged:', {
        activity,
        details,
        timestamp: new Date().toISOString(),
        user: 'current_user'
      });
      
      return { success: true };
    }
  };
  
  // React hook for easier usage in components
  export const EmployeeFormsApi = () => {
    return {
      getCompany: EmployeeFormsApiService.getCompany,
      getEmployee: EmployeeFormsApiService.getEmployee,
      checkIfQuestionsApply: EmployeeFormsApiService.checkIfQuestionsApply,
      getEmployeesFormFormat: EmployeeFormsApiService.getEmployeesFormFormat,
      getFormInstructionUrl: EmployeeFormsApiService.getFormInstructionUrl,
      validateSession: EmployeeFormsApiService.validateSession,
      getUserPermissions: EmployeeFormsApiService.getUserPermissions,
      logActivity: EmployeeFormsApiService.logActivity
    };
  };
  