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
      return true; // Mock: questionnaire applies
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
    },

    // Get submitted forms pending employer approval
    getSubmittedForms: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        submittedForms: {
          'Federal': [
            {
              reportid: 'W4',
              description: 'Employee\'s Withholding Certificate',
              frmName: 'Federal W-4 Form',
              onbDateDisp: '2024-01-15',
              onbTimeDisp: '10:30 AM',
              effectiveDate: '2024-01-01',
              status: 'Pending Approval'
            },
            {
              reportid: 'I9',
              description: 'Employment Eligibility Verification',
              frmName: 'Federal I-9 Form',
              onbDateDisp: '2024-01-14',
              onbTimeDisp: '2:15 PM',
              effectiveDate: '2024-01-01',
              status: 'Pending Approval'
            }
          ],
          'California': [
            {
              reportid: 'CAW4',
              description: 'California Withholding Certificate',
              frmName: 'CA W-4 Form',
              onbDateDisp: '2024-01-13',
              onbTimeDisp: '9:45 AM',
              effectiveDate: '2024-01-01',
              status: 'Pending Approval'
            }
          ],
          'Indiana': [
            {
              reportid: 'INW4',
              description: 'Indiana Withholding Certificate',
              frmName: 'IN W-4 Form',
              onbDateDisp: '2024-01-12',
              onbTimeDisp: '11:20 AM',
              effectiveDate: '2024-01-01',
              status: 'Pending Approval'
            }
          ]
        },
        alertCount: 3,
        recentAlerts: 'You have 3 forms pending employer approval. Please wait for your manager to review and approve these submissions.'
      };
    },

    // Get completed forms
    getCompletedForms: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        completedForms: {
          'Federal': [
            {
              reportid: 'W4',
              rpttitle: 'Employee\'s Withholding Certificate',
              frmName: 'Federal W-4 Form',
              onbDateDisp: '2024-01-10',
              onbTimeDisp: '9:30 AM',
              effectiveDate: '2024-01-01',
              onbStatus: '10',
              isEditable: false,
              taxMsg: null
            },
            {
              reportid: 'I9',
              rpttitle: 'Employment Eligibility Verification',
              frmName: 'Federal I-9 Form',
              onbDateDisp: '2024-01-08',
              onbTimeDisp: '2:15 PM',
              effectiveDate: '2024-01-01',
              onbStatus: '10',
              isEditable: false,
              taxMsg: null
            }
          ],
          'California': [
            {
              reportid: 'CAW4',
              rpttitle: 'California Withholding Certificate',
              frmName: 'CA W-4 Form',
              onbDateDisp: '2024-01-05',
              onbTimeDisp: '11:45 AM',
              effectiveDate: '2024-01-01',
              onbStatus: '9',
              isEditable: false,
              taxMsg: 'Tax calculation warning - please review'
            }
          ],
          'Indiana': [
            {
              reportid: 'INW4',
              rpttitle: 'Indiana Withholding Certificate',
              frmName: 'IN W-4 Form',
              onbDateDisp: '2024-01-03',
              onbTimeDisp: '10:20 AM',
              effectiveDate: '2024-01-01',
              onbStatus: '10',
              isEditable: false,
              taxMsg: null
            }
          ]
        }
      };
    },

    // Get change forms for a specific report
    getChangeForms: async (reportId, effectiveDate) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        forms: [
          {
            reportid: 'W4_EXEMPT',
            rpttitle: 'W-4 with Exemptions',
            rptName: 'Federal W-4 Form with Exemptions'
          },
          {
            reportid: 'W4_MULTIPLE',
            rpttitle: 'W-4 Multiple Jobs',
            rptName: 'Federal W-4 Form for Multiple Jobs'
          },
          {
            reportid: 'W4_OTHER',
            rpttitle: 'W-4 Other Adjustments',
            rptName: 'Federal W-4 Form with Other Adjustments'
          }
        ]
      };
    },

    // Get effective date parameters for a form
    getEffDateParams: async (reportId) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        bypassSelection: false,
        defaulDate: '01/01/2024',
        minSelDate: '01/01/2024',
        maxSelDate: '12/31/2024'
      };
    },

    // Check form status
    checkFormStatus: async (reportId, effectiveDate) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mock status - in production this would check actual form status
      const statuses = ['INPROGRESS', 'SUBMIT_SUCCESS', 'SUBMIT_FAILED'];
      return statuses[Math.floor(Math.random() * statuses.length)];
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
      logActivity: EmployeeFormsApiService.logActivity,
      getSubmittedForms: EmployeeFormsApiService.getSubmittedForms,
      getCompletedForms: EmployeeFormsApiService.getCompletedForms,
      getChangeForms: EmployeeFormsApiService.getChangeForms,
      getEffDateParams: EmployeeFormsApiService.getEffDateParams,
      checkFormStatus: EmployeeFormsApiService.checkFormStatus
    };
  };
  