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
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { EmployeeFormsApi } from '../services/EmployeeFormsApiService';

const CompletedForms = ({ 
  tabindex, 
  mainCtrl, 
  formTabsCtrl,
  onViewForm,
  onViewFormInstruction 
}) => {
  const employeeFormsApi = EmployeeFormsApi();
  
  // State management
  const [completedForms, setCompletedForms] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  
  // Modal states
  const [chooserModal, setChooserModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [otherForms, setOtherForms] = useState([]);
  const [selectedFormToChange, setSelectedFormToChange] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [successReason, setSuccessReason] = useState('');

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

  // Load completed forms from API
  const loadFormsList = async () => {
    try {
      setIsLoading(true);
      
      // Call actual API
      const data = await employeeFormsApi.getCompletedForms();
      
      setCompletedForms(data.completedForms);
      setDataAvailable(true);
      
      // Initialize first accordion to be open
      if (data.completedForms && Object.keys(data.completedForms).length > 0) {
        const firstAuthName = Object.keys(data.completedForms)[0];
        const firstAccordionId = `accordion-${firstAuthName.replace(/\s+/g, '')}`;
        setOpenAccordions({ [firstAccordionId]: true });
      }
      
    } catch (error) {
      console.error('Error loading completed forms:', error);
      setDataAvailable(true);
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

  // Show chooser modal for form change
  const showChooserModal = async (reportId, effectiveDate) => {
    try {
      const changeForms = await employeeFormsApi.getChangeForms(reportId, effectiveDate);
      setOtherForms(changeForms.forms || []);
      setSelectedForm({ reportid: reportId, effectiveDate });
      setChooserModal(true);
    } catch (error) {
      console.error('Error loading change forms:', error);
    }
  };

  // Close chooser modal
  const closeChooserModal = () => {
    setChooserModal(false);
    setOtherForms([]);
    setSelectedForm(null);
    setSelectedFormToChange(null);
  };

  // Select form to change to
  const selectForm = (form) => {
    setSelectedFormToChange(form);
  };

  // Choose selected form
  const chooseForm = async () => {
    if (selectedFormToChange) {
      try {
        // Here you would implement the form change logic
        console.log('Changing form to:', selectedFormToChange);
        // await employeeFormsApi.changeForm(selectedForm.reportid, selectedForm.effectiveDate, selectedFormToChange);
        
        closeChooserModal();
        // Reload forms list
        loadFormsList();
      } catch (error) {
        console.error('Error changing form:', error);
      }
    }
  };

  // Show reject modal
  const showRejectModal = (form, authName) => {
    setSelectedForm({ ...form, authName });
    setRejectModal(true);
  };

  // Show success modal
  const showSuccessModal = (form, authName) => {
    setSelectedForm({ ...form, authName });
    setSuccessModal(true);
  };

  // Reject failed form
  const rejectFailedForm = async () => {
    if (selectedForm && rejectReason) {
      try {
        // Here you would implement the reject logic
        console.log('Rejecting form:', selectedForm, 'Reason:', rejectReason);
        // await employeeFormsApi.rejectFailedForm(selectedForm, rejectReason);
        
        setRejectModal(false);
        setRejectReason('');
        setSelectedForm(null);
        // Reload forms list
        loadFormsList();
      } catch (error) {
        console.error('Error rejecting form:', error);
      }
    }
  };

  // Success failed form
  const successFailedForm = async () => {
    if (selectedForm && successReason) {
      try {
        // Here you would implement the success logic
        console.log('Success form:', selectedForm, 'Reason:', successReason);
        // await employeeFormsApi.successFailedForm(selectedForm, successReason);
        
        setSuccessModal(false);
        setSuccessReason('');
        setSelectedForm(null);
        // Reload forms list
        loadFormsList();
      } catch (error) {
        console.error('Error successing form:', error);
      }
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
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
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
        <p className="text-muted">Loading completed forms...</p>
      </div>
    );
  }

  if (!dataAvailable) {
    return (
      <div className="text-center py-5">
        <h1>Loading <i className="fa fa-cog fa-spin"></i></h1>
      </div>
    );
  }

  return (
    <div>
      {/* Forms Accordion */}
      {completedForms && Object.keys(completedForms).length > 0 ? (
        <div>
          {Object.entries(completedForms).map(([authName, forms]) => {
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
                          
                          <Col md={3}>
                            <div className="font-weight-bold text-dark">
                              <a 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleViewForm(form);
                                }}
                                className="text-primary"
                              >
                                {form.rpttitle || form.description}
                              </a>
                            </div>
                            <small className="text-muted">
                              Form ID: {form.reportid}
                            </small>
                          </Col>
                          
                          <Col md={2}>
                            <Badge color={getStatusBadgeColor(form.onbStatus)}>
                              {form.onbStatus === '10' ? 'Completed' : form.onbStatus === '9' ? 'Pending' : 'Unknown'}
                            </Badge>
                          </Col>
                          
                          <Col md={3}>
                            <div className="text-muted">
                              <i className="fas fa-calendar mr-1"></i>
                              Filed: {formatDate(form.onbDateDisp)}
                            </div>
                            <div className="text-muted">
                              <i className="fas fa-clock mr-1"></i>
                              {form.onbTimeDisp}
                            </div>
                          </Col>
                          
                          <Col md={3} className="text-right">
                            {/* Tax Message Warning */}
                            {form.taxMsg && (
                              <div className="mb-2">
                                <i className="fas fa-exclamation-triangle text-danger mr-1"></i>
                                <small className="text-danger">{form.taxMsg}</small>
                              </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div> 
                              {/* Change Form Button - Only show if no tax message and not editable */}
                              {!form.taxMsg && !form.isEditable && (
                                <Button
                                  color="outline-warning"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => showChooserModal(form.reportid, form.effectiveDate)}
                                  title="Change Form"
                                >
                                  <i className="fas fa-exchange-alt mr-1"></i>
                                  Change
                                </Button>
                              )}
                              
                              {/* Override Buttons - Only for employer with tax messages */}
                              {form.taxMsg && (form.onbStatus === '10' || form.onbStatus === '9') && mainCtrl.loginType === 'employer' && (
                                <>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => showRejectModal(form, authName)}
                                    title="Override to Rejected"
                                  >
                                    Override to Rejected
                                  </Button>
                                  <Button
                                    color="success"
                                    size="sm"
                                    onClick={() => showSuccessModal(form, authName)}
                                    title="Override to Success"
                                  >
                                    Override to Success
                                  </Button>
                                </>
                              )}
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
            <i className="fas fa-check-circle fa-3x text-muted mb-3"></i>
            <h4>No Completed Forms</h4>
            <p className="text-muted">
              You don't have any completed forms to display.
              <br />
              Complete some forms first to see them here.
            </p>
          </div>
          <Alert color="info">
            <h4 className="alert-heading">Get Started</h4>
            Complete your tax forms to see them listed here for viewing and modification.
          </Alert>
        </div>
      )}

      {/* Chooser Modal for Form Change */}
      <Modal isOpen={chooserModal} toggle={closeChooserModal} size="lg">
        <ModalHeader toggle={closeChooserModal}>
          Please Choose Appropriate Form
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-10 offset-md-1">
              {otherForms.map((form, index) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-info-circle text-info mr-2" title={form.rptName}></i>
                    {mainCtrl.isFormsEditable ? (
                      <Input
                        type="radio"
                        name="chooseExemption"
                        className="mr-2"
                        onChange={() => selectForm(form)}
                      />
                    ) : null}
                    <span className="text-info">{form.rpttitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {mainCtrl.isFormsEditable && (
            <Button color="warning" onClick={chooseForm}>
              Choose Selected Form
            </Button>
          )}
          <Button color="secondary" onClick={closeChooserModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={rejectModal} toggle={() => setRejectModal(false)}>
        <ModalHeader toggle={() => setRejectModal(false)}>
          Enter your reason for rejection
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="reason">Rejection Reason</Label>
            <Input
              type="text"
              id="reason"
              placeholder="Enter your reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={rejectFailedForm}>
            Confirm
          </Button>
          <Button color="secondary" onClick={() => setRejectModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={successModal} toggle={() => setSuccessModal(false)}>
        <ModalHeader toggle={() => setSuccessModal(false)}>
          Enter your reason for Success
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="reasons">Success Reason</Label>
            <Input
              type="text"
              id="reasons"
              placeholder="Enter your reason for Success"
              value={successReason}
              onChange={(e) => setSuccessReason(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={successFailedForm}>
            Confirm
          </Button>
          <Button color="secondary" onClick={() => setSuccessModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CompletedForms;
