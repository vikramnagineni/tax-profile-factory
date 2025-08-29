import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Collapse, 
  Alert, 
  Spinner,
  Badge,
  Row,
  Col
} from 'reactstrap';
import { useFormViewerService } from '../services/FormViewerService';
import { EmployeeFormsApi } from '../services/EmployeeFormsApiService';

const PendingEmployerApproval = ({ 
  tabindex, 
  mainCtrl, 
  formTabsCtrl,
  onViewForm,
  onViewFormInstruction 
}) => {
  const employeeFormsApi = EmployeeFormsApi();
  
  // State management
  const [submittedForms, setSubmittedForms] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const [recentAlerts, setRecentAlerts] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openAccordions, setOpenAccordions] = useState({});

  // Initialize component
  useEffect(() => {
    if (formTabsCtrl?.activetab === tabindex) {
      loadFormsList();
    }
  }, [formTabsCtrl?.activetab, tabindex]);

  // Toggle accordion
  const toggleAccordion = accordionId => {
    setOpenAccordions(prev => ({
      ...prev,
      [accordionId]: !prev[accordionId]
    }));
  };

  // Load submitted forms from API
  const loadFormsList = async () => {
    try {
      setIsLoading(true);
      
      // Call actual API
      const data = await employeeFormsApi.getSubmittedForms();
      
      setSubmittedForms(data.submittedForms);
      setAlertCount(data.alertCount);
      setRecentAlerts(data.recentAlerts);
      
      // Initialize first accordion to be open
      if (data.submittedForms && Object.keys(data.submittedForms).length > 0) {
        const firstAuthName = Object.keys(data.submittedForms)[0];
        const firstAccordionId = `accordion-${firstAuthName.replace(/\s+/g, '')}`;
        setOpenAccordions({ [firstAccordionId]: true });
      }
      
    } catch (error) {
      console.error('Error loading submitted forms:', error);
    } finally {
      setIsLoading(false);
    }
  };



  // Handle form viewing
  const handleViewForm = (form) => {
    if (onViewForm) {
      onViewForm([form]);
    }
  };

  // Handle form instruction viewing
  const handleViewFormInstruction = (reportId, effectiveDate) => {
    if (onViewFormInstruction) {
      onViewFormInstruction(reportId, effectiveDate);
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending approval':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" size="lg" className="mb-3" />
        <p className="text-muted">Loading submitted forms...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Alert Section */}
      {recentAlerts && (
        <Alert color="warning" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <strong>Pending Approval Notice:</strong> {recentAlerts}
            </div>
            {alertCount > 0 && (
              <Badge color="warning" pill>
                {alertCount} Forms
              </Badge>
            )}
          </div>
        </Alert>
      )}

      {/* Forms Accordion */}
      {submittedForms && Object.keys(submittedForms).length > 0 ? (
        <div>
          {Object.entries(submittedForms).map(([authName, forms]) => {
            const accordionId = `accordion-${authName.replace(/\s+/g, '')}`;
            const isOpen = openAccordions[accordionId] || false;

            return (
              <Card key={authName} className="mb-3 border">
                <CardHeader
                  className="bg-light cursor-pointer"
                  onClick={() => toggleAccordion(accordionId)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="mb-0 text-info">
                      <i className="fas fa-building mr-2"></i>
                      {authName}
                      <Badge color="info" className="ml-2">
                        {forms.length} {forms.length === 1 ? 'Form' : 'Forms'}
                      </Badge>
                    </div>
                    <i className={`fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"} text-muted`}></i>
                  </div>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                  <CardBody>
                    {forms.map((form, formIndex) => (
                      <div key={`${form.reportid}-${formIndex}`} className="mb-3 p-3 border rounded bg-light">
                        <Row className="align-items-center">
                          <Col md={1}>
                            {/* Info Icon */}
                            <i
                              className="fas fa-info-circle text-info"
                              title={form.frmName || form.description}
                              style={{ cursor: "help", fontSize: "1.2em" }}
                            ></i>
                          </Col>
                          
                          <Col md={4}>
                            <div className="font-weight-bold text-dark">
                              {form.description}
                            </div>
                            <small className="text-muted">
                              Form ID: {form.reportid}
                            </small>
                          </Col>
                          
                          <Col md={2}>
                            <Badge color={getStatusBadgeColor(form.status)}>
                              {form.status}
                            </Badge>
                          </Col>
                          
                          <Col md={3}>
                            <div className="text-muted">
                              <i className="fas fa-calendar mr-1"></i>
                              Submitted: {formatDate(form.onbDateDisp)}
                            </div>
                            <div className="text-muted">
                              <i className="fas fa-clock mr-1"></i>
                              {form.onbTimeDisp}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </CardBody>
                </Collapse>
              </Card>
            );
          })}
        </div>
      ) : (
        /* No Forms Message */
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-flag fa-3x text-muted mb-3"></i>
            <h4>No Forms Pending Approval</h4>
            <p className="text-muted">
              You don't have any forms currently pending employer approval.
              <br />
              All your submitted forms have been processed or are still being reviewed.
            </p>
          </div>
          <Alert color="info">
            <h4 className="alert-heading">All Caught Up!</h4>
            Your forms are either approved, rejected, or still in the review process.
            Check back later for updates on your submissions.
          </Alert>
        </div>
      )}
    </div>
  );
};

export default PendingEmployerApproval;
