import { useState, useEffect } from 'react';
import { Row, Badge, CardBody } from 'reactstrap';
import Questionnaire from './Questionnaire';
import EmployeeFormTabs from './EmployeeFormTabs';
import FormViewer from './FormViewer';
import { EmployeeFormsApi } from '../services/EmployeeFormsApiService';
import { FormViewerService } from '../services/FormViewerService';

const EmployeeForms = ({ 
  mode = 'default',
  formsEditable = 'yes'
}) => {
  const employeeFormsApi = EmployeeFormsApi();

  // State management
  const [questionnaire, setQuestionnaire] = useState(true);
  const [formApprovals, setFormApprovals] = useState(false);
  const [reviewApproveTaxes, setReviewApproveTaxes] = useState(false);
  const [useHTML, setUseHTML] = useState(true);
  const [isFormsEditable, setIsFormsEditable] = useState(formsEditable);
  const [company, setCompany] = useState({});
  const [employee, setEmployee] = useState({});
  const [empResponse, setEmpResponse] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Page modes
  const PAGE_MODES = {
    approval: 'approval',
    approveReviewTaxes: 'approve_review_taxes'
  };

  // Initialize component
  useEffect(() => {
    initializeComponent();
  }, []); // Remove mode dependency to prevent re-initialization



  // Main initialization function
  const initializeComponent = async () => {
    try {
      // Load company data
      await loadCompanyData();

      // Handle different modes
      if (mode === PAGE_MODES.approval) {
        await handleApprovalMode();
      } else if (mode === PAGE_MODES.approveReviewTaxes) {
        await handleApproveReviewTaxesMode();
      } else {
        await handleDefaultMode();
      }
    } catch (error) {
      console.error('Error initializing component:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load company data
  const loadCompanyData = async () => {
    try {
      const companyData = await employeeFormsApi.getCompany();
      setCompany(companyData);
    } catch (error) {
      console.error('Error loading company data:', error);
    }
  };

  // Load employee data
  const loadEmployeeData = async () => {
    try {
      const employeeData = await employeeFormsApi.getEmployee();
      setEmployee(employeeData);
      setEmpResponse(true);
      return employeeData;
    } catch (error) {
      console.error('Error loading employee data:', error);
      setEmpResponse(false);
      return null;
    }
  };

  // Handle approval mode
  const handleApprovalMode = async () => {
    setQuestionnaire(false);
    setFormApprovals(true);
    setUseHTML(false);

    const employeeData = await loadEmployeeData();
    if (employeeData) {
      setTitle(`Form Approval - Employee ${employeeData.empnum}`);
    }
  };

  // Handle approve review taxes mode
  const handleApproveReviewTaxesMode = async () => {
    setQuestionnaire(false);
    setFormApprovals(false);
    setReviewApproveTaxes(true);

    const employeeData = await loadEmployeeData();
    if (employeeData) {
      setTitle(`Approve Review Taxes - Employee ${employeeData.empnum}`);
    }
  };

  // Handle default mode
  const handleDefaultMode = async () => {
    try {
      // Check if questions apply
      const questionsApply = await employeeFormsApi.checkIfQuestionsApply();
      
      // Load employee data
      const employeeData = await loadEmployeeData();
      
      // Load supported form formats
      const formFormat = await employeeFormsApi.getEmployeesFormFormat();
      setUseHTML(formFormat === 'HTML');

      // Set questionnaire state and title
      if (questionsApply) {
        setQuestionnaire(true);
        setFormApprovals(false);
        setReviewApproveTaxes(false);
        if (empResponse && employeeData) {
          setTitle(`Questionnaire - Employee ${employeeData.empnum}`);
        } else {
          setTitle(`Questionnaire - Employee 11315`);
        }
      } else {
        setQuestionnaire(false);
        setFormApprovals(false);
        setReviewApproveTaxes(false);
        if (empResponse && employeeData) {
          setTitle(`My Forms - Employee ${employeeData.empnum}`);
        } else {
          setTitle('My Forms - Employee 11315');
        }
      }
    } catch (error) {
      console.error('Error in default mode setup:', error);
      // On error, default to questionnaire
      setQuestionnaire(true);
      setFormApprovals(false);
      setReviewApproveTaxes(false);
      setTitle('Questionnaire - Employee 11315');
    }
  };

  // View form instruction in new window
  const viewFormInstruction = (reportId, effectiveDate) => {
    const link = `ViewPDFFormInstruction?reportId=${reportId}&effectiveDate=${effectiveDate}`;
    const windowTitle = `Instructions For: ${reportId}`;
    
    const html = `
      <html>
        <head><title>${windowTitle}</title></head>
        <body style='margin: 0;'>
          <iframe height='100%' id='iframe1' width='100%' src='${link}'></iframe>
        </body>
      </html>
    `;

    const w = 1000;
    const h = 700;
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
    const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
    const left = ((width / 2) - (w / 2)) + dualScreenLeft;
    const top = ((height / 2) - (h / 2)) + dualScreenTop;

    const newWindow = window.open(
      '', 
      windowTitle, 
      `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`
    );
    
    newWindow.document.write(html);
    if (window.focus) {
      newWindow.focus();
    }
    newWindow.document.close();
  };

  // Handle form viewing - equivalent to Angular's viewForm functionality
  const handleViewForm = (forms) => {
    console.log('Opening form viewer for:', forms);
    FormViewerService.setFormsToFill(forms, () => {
      console.log('Form viewing completed');
      // Optionally refresh forms list or perform other actions
    }, true);
  };

  // Handle form wizard viewing
  const handleViewFormWizard = (forms) => {
    console.log('Opening form wizard for:', forms);
    FormViewerService.setFormsToFill(forms, () => {
      console.log('Form wizard completed');
      // Optionally refresh forms list or perform other actions
    }, true);
  };

  // Main controller object for child components
  const mainCtrl = {
    isFormsEditable: isFormsEditable === 'yes',
    useHTML,
    company,
    employee,
    empResponse,
    viewFormInstruction,
    onViewForm: handleViewForm,
    onViewFormWizard: handleViewFormWizard,
    title,
    mode,
    page: {
      mode: PAGE_MODES,
      alert: {
        msg: '',
        type: 'info'
      },
      closeAlert: () => {
        // Handle alert closing logic
      }
    }
  };

  return (
    <div>
      {/* Header Section */}
       <div className="card shadow mb-3">
        <CardBody className="row">          
          <div class="row col mr-2 card-detail">                  
            <div className="page-header mt-4 mb-4">
              <div className="text-primary d-flex justify-content-between align-items-center card-title">
                <span>
                  <i className="fas fa-folder-open mr-2"></i>
                  {title}
                </span>
                <Badge color="secondary">
                  <i className="fas fa-briefcase mr-2"></i>
                  {company.legalname || 'Loading...'}
                </Badge>
              </div>
            </div>                 
          </div>
        </CardBody>
      </div>
      <div class="card shadow mb-3">
        <div class="card-body">
          <Row>
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading forms...</p>
              </div>
            )}

            {/* Conditional Component Rendering - Only show when not loading */}
            {!isLoading && (
              <>
                {questionnaire && !formApprovals && !reviewApproveTaxes && (
                  <Questionnaire mainCtrl={mainCtrl} />
                )}

                {!questionnaire && !formApprovals && !reviewApproveTaxes && (
                  <EmployeeFormTabs mainCtrl={mainCtrl} activetab={1} />
                )}
              </>
            )}
          </Row>
        </div>
      </div>
      
 {/* Form Viewer Modal */}
      <FormViewer mainCtrl={mainCtrl} />
      
    </div>
  );
};

export default EmployeeForms;
