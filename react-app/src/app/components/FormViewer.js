import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Alert, 
  Spinner,
  Progress,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { useFormViewerService } from '../services/FormViewerService';

const FormViewer = ({ mainCtrl }) => {
  const { formsToFill, viewingDone, submissionMode, clearForms } = useFormViewerService();
  
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [formParams, setFormParams] = useState({
    initDone: false,
    showEffDateSel: false,
    initDate: '',
    minDate: '',
    maxDate: '',
    taxEffDate: '',
    showWeeks: false
  });

  // Watch for forms to fill changes
  useEffect(() => {
    if (formsToFill && formsToFill.length > 0) {
      setIsOpen(true);
      setCurrentFormIndex(0);
      resetFormParams();
    } else {
      setIsOpen(false);
    }
  }, [formsToFill]);

  // Reset form parameters
  const resetFormParams = () => {
    setFormParams({
      initDone: false,
      showEffDateSel: false,
      initDate: '',
      minDate: '',
      maxDate: '',
      taxEffDate: '',
      showWeeks: false
    });
  };

  // Get current form
  const getCurrentForm = () => {
    return formsToFill && formsToFill.length > currentFormIndex ? formsToFill[currentFormIndex] : null;
  };

  // Close modal and cleanup
  const handleClose = () => {
    setIsOpen(false);
    clearForms();
    if (viewingDone) {
      viewingDone();
    }
  };

  // Navigate to next form
  const handleNextForm = () => {
    if (currentFormIndex < formsToFill.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1);
      resetFormParams();
    } else {
      // Last form completed
      handleClose();
    }
  };

  // Navigate to previous form
  const handlePreviousForm = () => {
    if (currentFormIndex > 0) {
      setCurrentFormIndex(currentFormIndex - 1);
      resetFormParams();
    }
  };

  // Submit current form
  const handleSubmitForm = async () => {
    const currentForm = getCurrentForm();
    if (!currentForm) return;

    setIsSubmitting(true);
    setSubmitProgress(0);

    try {
      // Simulate form submission progress
      const progressInterval = setInterval(() => {
        setSubmitProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAlert({
        show: true,
        message: `Form "${currentForm.rpttitle}" submitted successfully!`,
        type: 'success'
      });

      // Move to next form after short delay
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitProgress(0);
        setAlert({ show: false, message: '', type: 'info' });
        handleNextForm();
      }, 1500);

    } catch (error) {
      console.error('Error submitting form:', error);
      setAlert({
        show: true,
        message: 'Error submitting form. Please try again.',
        type: 'danger'
      });
      setIsSubmitting(false);
      setSubmitProgress(0);
    }
  };

  // Skip current form
  const handleSkipForm = () => {
    const currentForm = getCurrentForm();
    if (currentForm) {
      setAlert({
        show: true,
        message: `Form "${currentForm.rpttitle}" skipped.`,
        type: 'warning'
      });
      
      setTimeout(() => {
        setAlert({ show: false, message: '', type: 'info' });
        handleNextForm();
      }, 1000);
    }
  };

  // Get modal title
  const getModalTitle = () => {
    const currentForm = getCurrentForm();
    if (!currentForm) return 'Form Viewer';
    
    if (formsToFill.length > 1) {
      return `Form ${currentFormIndex + 1} of ${formsToFill.length}: ${currentForm.rpttitle}`;
    }
    
    return currentForm.rpttitle;
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    if (formsToFill.length <= 1) return 100;
    return Math.round(((currentFormIndex + 1) / formsToFill.length) * 100);
  };

  const currentForm = getCurrentForm();

  return (
    <Modal 
      isOpen={isOpen} 
      toggle={handleClose}
      size="xl"
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader toggle={handleClose}>
        <div className="d-flex justify-content-between align-items-center w-100">
          <span>{getModalTitle()}</span>
          {formsToFill.length > 1 && (
            <span className="badge badge-secondary">
              {currentFormIndex + 1} / {formsToFill.length}
            </span>
          )}
        </div>
      </ModalHeader>

      <ModalBody style={{ minHeight: '400px' }}>
        {/* Progress Bar for Multiple Forms */}
        {formsToFill.length > 1 && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Overall Progress</small>
              <small className="text-muted">{getProgressPercentage()}%</small>
            </div>
            <Progress value={getProgressPercentage()} color="success" />
          </div>
        )}

        {/* Alert */}
        {alert.show && (
          <Alert color={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        {/* Form Content */}
        {currentForm && (
          <Container fluid>
            <Row>
              <Col md={12}>
                <div className="form-viewer-content">
                  {/* Form Header */}
                  <div className="mb-4 p-3 border rounded bg-light">
                    <h5 className="mb-2 text-primary">
                      <i className="fas fa-file-alt mr-2"></i>
                      {currentForm.rpttitle}
                    </h5>
                    {currentForm.rptName && (
                      <p className="mb-1 text-muted">{currentForm.rptName}</p>
                    )}
                    {currentForm.effectiveDate && (
                      <small className="text-muted">
                        <i className="fas fa-calendar mr-1"></i>
                        Effective Date: {currentForm.effectiveDate}
                      </small>
                    )}
                    {currentForm.taxMsg && (
                      <Alert color="warning" className="mt-2 mb-0">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {currentForm.taxMsg}
                      </Alert>
                    )}
                  </div>

                  {/* Form Body - This would be replaced with actual form content */}
                  <div className="form-content border rounded p-4 bg-white">
                    {isSubmitting ? (
                      <div className="text-center py-5">
                        <Spinner color="primary" size="lg" className="mb-3" />
                        <h5>Submitting Form...</h5>
                        <p className="text-muted mb-3">Please wait while we process your form.</p>
                        <Progress 
                          value={submitProgress} 
                          color="success" 
                          className="mb-2" 
                          style={{ height: '10px' }}
                        />
                        <small className="text-muted">{submitProgress}% Complete</small>
                      </div>
                    ) : (
                      <div>
                        <h6 className="text-info mb-3">
                          <i className="fas fa-info-circle mr-2"></i>
                          Form Preview
                        </h6>
                        <p className="text-muted">
                          This is where the actual form content would be displayed. 
                          The form would be loaded based on the form type ({currentForm.reportid}) 
                          and effective date ({currentForm.effectiveDate}).
                        </p>
                        
                        {/* Sample form fields for demonstration */}
                        <Form>
                          <FormGroup>
                            <Label for="sampleField">Sample Field</Label>
                            <Input 
                              type="text" 
                              id="sampleField" 
                              placeholder="Enter sample data..."
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="sampleSelect">Sample Selection</Label>
                            <Input type="select" id="sampleSelect">
                              <option value="">Select an option</option>
                              <option value="option1">Option 1</option>
                              <option value="option2">Option 2</option>
                            </Input>
                          </FormGroup>
                        </Form>

                        <Alert color="info" className="mt-3">
                          <strong>Note:</strong> In a real implementation, this area would contain 
                          the actual form fields and validation logic specific to the tax form 
                          being viewed (e.g., W-4, I-9, etc.).
                        </Alert>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </ModalBody>

      <ModalFooter className="d-flex justify-content-between">
        <div>
          {/* Previous Button */}
          {formsToFill.length > 1 && currentFormIndex > 0 && (
            <Button 
              color="secondary" 
              onClick={handlePreviousForm}
              disabled={isSubmitting}
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Previous
            </Button>
          )}
        </div>

        <div>
          {/* Action Buttons */}
          {submissionMode && !isSubmitting && (
            <>
              {formsToFill.length > 1 && (
                <Button 
                  color="warning" 
                  onClick={handleSkipForm}
                  className="mr-2"
                >
                  Skip Form
                </Button>
              )}
              <Button 
                color="success" 
                onClick={handleSubmitForm}
                className="mr-2"
              >
                <i className="fas fa-check mr-2"></i>
                {formsToFill.length > 1 ? 'Submit & Next' : 'Submit Form'}
              </Button>
            </>
          )}
          
          {/* Close Button */}
          <Button 
            color="secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please Wait...' : 'Close'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default FormViewer;
