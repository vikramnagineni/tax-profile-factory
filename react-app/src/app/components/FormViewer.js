import React, { useState, useEffect, useRef } from 'react';
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
  Input,
  Badge
} from 'reactstrap';
import { useFormViewerService } from '../services/FormViewerService';
import { EmployeeFormsApi } from '../services/EmployeeFormsApiService';

const FormViewer = ({ mainCtrl }) => {
  const { formsToFill, viewingDone, submissionMode, clearForms } = useFormViewerService();
  const employeeFormsApi = EmployeeFormsApi();
  
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [currentForm, setCurrentForm] = useState(null);
  const [wizardMode, setWizardMode] = useState(false);
  const [canCloseOrSkip, setCanCloseOrSkip] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form parameters for effective date selection
  const [formParams, setFormParams] = useState({
    initDone: false,
    showEffDateSel: false,
    initDate: '',
    minDate: '',
    maxDate: '',
    taxEffDate: '',
    showWeeks: false,
    currIdx: 0
  });

  // Progress tracking
  const [progress, setProgress] = useState({
    label: '',
    skiplabel: '',
    value: 0,
    skipvalue: 0,
    filled: 0,
    skipped: 0,
    total: 0
  });

  // Form status checking
  const [formStatusChecker, setFormStatusChecker] = useState(null);
  const iframeRef = useRef(null);

  // Watch for forms to fill changes
  useEffect(() => {
    if (formsToFill && formsToFill.length > 0) {
      setIsOpen(true);
      setCurrentFormIndex(0);
      setWizardMode(formsToFill.length > 1);
      resetFormParams();
      initializeProgress();
      loadCurrentForm();
    } else {
      setIsOpen(false);
    }
  }, [formsToFill]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (formStatusChecker) {
        clearInterval(formStatusChecker);
      }
    };
  }, [formStatusChecker]);

  // Initialize progress tracking
  const initializeProgress = () => {
    if (formsToFill && formsToFill.length > 0) {
      setProgress({
        label: '',
        skiplabel: '',
        value: 0,
        skipvalue: 0,
        filled: 0,
        skipped: 0,
        total: formsToFill.length
      });
    }
  };

  // Reset form parameters
  const resetFormParams = () => {
    setFormParams({
      initDone: false,
      showEffDateSel: false,
      initDate: '',
      minDate: '',
      maxDate: '',
      taxEffDate: '',
      showWeeks: false,
      currIdx: currentFormIndex
    });
  };

  // Load current form
  const loadCurrentForm = () => {
    if (formsToFill && formsToFill.length > currentFormIndex) {
      const form = formsToFill[currentFormIndex];
      setCurrentForm(form);
      setIsSubmitted(form.onbStatus === 3 || form.onbStatus === 4);
      
      if (mainCtrl.useHTML) {
        if (submissionMode) {
          getEffectiveDateParams(form, () => loadHTMLFormInViewer(form));
        } else {
          setFormParams(prev => ({
            ...prev,
            showEffDateSel: false,
            initDone: true
          }));
          loadHTMLFormInViewer(form);
        }
      } else {
        if (submissionMode) {
          getEffectiveDateParams(form, () => loadPDFFormInViewer(form));
        } else {
          setFormParams(prev => ({
            ...prev,
            showEffDateSel: false,
            initDone: true
          }));
          loadPDFFormInViewer(form);
        }
      }
    }
  };

  // Get effective date parameters
  const getEffectiveDateParams = async (form, callback) => {
    try {
      const data = await employeeFormsApi.getEffDateParams(form.reportid);
      
      if (data.bypassSelection) {
        const defaultDate = getDateFromString(data.defaulDate);
        setFormParams(prev => ({
          ...prev,
          initDate: defaultDate,
          showEffDateSel: false,
          initDone: true
        }));
        if (callback) callback(form);
      } else {
        const defaultDate = getDateFromString(data.defaulDate);
        const minDate = getDateFromString(data.minSelDate);
        const maxDate = getDateFromString(data.maxSelDate);
        
        setFormParams(prev => ({
          ...prev,
          initDate: defaultDate,
          minDate: minDate,
          maxDate: maxDate,
          showEffDateSel: true,
          initDone: true
        }));
      }
    } catch (error) {
      console.error('Error getting effective date params:', error);
      setAlert({
        show: true,
        message: 'Error loading form parameters. Please try again.',
        type: 'danger'
      });
    }
  };

  // Convert date string to Date object
  const getDateFromString = (dateStr) => {
    if (dateStr) {
      const parts = dateStr.split('/');
      return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    return new Date();
  };

  // Format date for URL parameters
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // Get URL parameters for form
  const getURLParams = (form, isHTML = true) => {
    let url = `?obx=0&reportId=${form.reportid}&effective=${form.effectiveDate}`;
    
    if (isHTML && !submissionMode) {
      url += '&ro=1';
    }
    
    if (formParams.taxEffDate) {
      url += `&taxEffDate=${formParams.taxEffDate}`;
    } else if (formParams.initDate) {
      url += `&taxEffDate=${getFormattedDate(formParams.initDate)}`;
    }
    
    if (form.onbStatus !== -1) {
      url += `&onBStatus=${form.onbStatus}`;
    } else {
      url += '&onBStatus=-1';
    }
    
    if (form.runDate && form.runTime) {
      url += `&runDate=${form.runDate}&runTime=${form.runTime}`;
    } else {
      url += '&runDate=&runTime=';
    }
    
    if (form.empNum) {
      url += `&empNum=${form.empNum}`;
    }
    
    if (form.LT) {
      url += `&LT=${form.LT}`;
    } else {
      url += '&LT=EE';
    }
    
    if (!isHTML) {
      if (form.MINVER) {
        url += `&MINVER=${form.MINVER}`;
      } else {
        url += '&MINVER=11';
      }
    }
    
    return url;
  };

  // Load HTML form in viewer
  const loadHTMLFormInViewer = (form) => {
    setIsSubmitted(form.onbStatus === 3 || form.onbStatus === 4);
    setCanCloseOrSkip(false);
    setAlert({ show: false, message: '', type: 'info' });
    
    const url = `htmlForm.jsp${getURLParams(form, true)}`;
    
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
    
    setCanCloseOrSkip(true);
  };

  // Load PDF form in viewer
  const loadPDFFormInViewer = (form) => {
    setCanCloseOrSkip(false);
    setAlert({ show: false, message: '', type: 'info' });
    
    const url = `showPDF.action${getURLParams(form, false)}`;
    
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
    
    // Start form status checking for PDF forms
    if (submissionMode) {
      startFormStatusCheck(form);
    }
    
    setCanCloseOrSkip(true);
  };

  // Start form status checking
  const startFormStatusCheck = (form) => {
    const checker = setInterval(async () => {
      try {
        const status = await employeeFormsApi.checkFormStatus(form.reportid, form.effectiveDate);
        
        if (status === 'SUBMIT_SUCCESS') {
          clearInterval(checker);
          formSubmitted();
        } else if (status === 'SUBMIT_FAILED') {
          clearInterval(checker);
          formSubmitted();
        }
      } catch (error) {
        console.error('Error checking form status:', error);
      }
    }, 1000);
    
    setFormStatusChecker(checker);
  };

  // Stop form status checking
  const stopFormStatusCheck = () => {
    if (formStatusChecker) {
      clearInterval(formStatusChecker);
      setFormStatusChecker(null);
    }
  };

  // Handle effective date selection
  const handleEffectiveDateSelect = (date) => {
    const formattedDate = getFormattedDate(date);
    setFormParams(prev => ({
      ...prev,
      taxEffDate: formattedDate,
      showEffDateSel: false
    }));
    
    if (mainCtrl.useHTML) {
      loadHTMLFormInViewer(currentForm);
    } else {
      loadPDFFormInViewer(currentForm);
    }
  };

  // Close modal and cleanup
  const handleClose = () => {
    setIsOpen(false);
    stopFormStatusCheck();
    clearForms();
    if (viewingDone) {
      viewingDone();
    }
  };

  // Skip current form
  const handleSkipForm = () => {
    if (wizardMode) {
      setProgress(prev => ({
        ...prev,
        skipped: prev.skipped + 1
      }));
      formSubmitted(true);
    }
  };

  // Check if not last form
  const isNotLastForm = () => {
    return wizardMode && (currentFormIndex + 1) !== formsToFill.length;
  };

  // Handle form submission
  const formSubmitted = (skipped = false) => {
    const callback = viewingDone;
    setCanCloseOrSkip(true);
    
    if (!wizardMode) {
      if (callback) callback();
      handleClose();
    } else {
      // Prepare next form
      setAlert({ show: false, message: '', type: 'info' });
      
      if (!skipped) {
        setProgress(prev => ({
          ...prev,
          filled: prev.filled + 1
        }));
      }
      
      setFormParams(prev => ({
        ...prev,
        currIdx: prev.currIdx + 1
      }));
      
      if (currentFormIndex + 1 < formsToFill.length) {
        const nextFormIndex = currentFormIndex + 1;
        setCurrentFormIndex(nextFormIndex);
        resetFormParams();
        loadCurrentForm();
      } else {
        if (callback) callback();
        handleClose();
      }
    }
  };

  // Submit current form
  const handleSubmitForm = async () => {
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
        formSubmitted();
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

  // Show PDF view
  const handleShowPDF = () => {
    if (currentForm) {
      const url = `showPDF.action?OBx=0&reportId=${currentForm.reportid}&effective=${currentForm.effectiveDate}&onBStatus=${currentForm.onbStatus}&empNum=${currentForm.empNum || ''}&runDate=${currentForm.runDate || ''}&runTime=${currentForm.runTime || ''}&LT=ER`;
      
      const windowName = `${currentForm.reportid}${currentForm.effectiveDate}${currentForm.empNum || ''}`;
      window.open(url, windowName, 'location=0,status=0,toolbar=0,menubar=0,directories=0,resizable=1,scrollbars=1');
    }
  };

  // Get modal title
  const getModalTitle = () => {
    if (!currentForm) return 'Form Viewer';
    
    if (wizardMode) {
      return `Form ${currentFormIndex + 1} of ${formsToFill.length}: ${currentForm.rpttitle}`;
    }
    
    return currentForm.rpttitle;
  };

  // Update progress labels and values
  useEffect(() => {
    if (progress.total > 0) {
      const newProgress = { ...progress };
      
      if (newProgress.filled > 0) {
        newProgress.label = `${newProgress.filled}/${newProgress.total} Complete.`;
      } else {
        newProgress.label = '';
      }
      newProgress.value = (newProgress.filled / newProgress.total) * 100;
      
      if (newProgress.skipped > 0) {
        newProgress.skiplabel = `${newProgress.skipped}/${newProgress.total} Skipped.`;
      } else {
        newProgress.skiplabel = '';
      }
      newProgress.skipvalue = (newProgress.skipped / newProgress.total) * 100;
      
      setProgress(newProgress);
    }
  }, [progress.filled, progress.skipped, progress.total]);

  if (!currentForm) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      toggle={handleClose}
      size="xl"
      backdrop="static"
      keyboard={false}
      className="modal-verylg"
    >
      <ModalHeader toggle={handleClose}>
        <div className="d-flex justify-content-between align-items-center w-100">
          <span>{getModalTitle()}</span>
          {wizardMode && (
            <Badge color="info">
              {currentFormIndex + 1} / {formsToFill.length}
            </Badge>
          )}
        </div>
      </ModalHeader>

      <ModalBody style={{ minHeight: '500px' }}>
        {/* Progress Bar for Wizard Mode */}
        {wizardMode && (
          <div className="mb-4">
            <Row>
              <Col md={8} className="offset-md-2">
                <div className="mb-2">
                  <small className="text-muted">Form Progress</small>
                </div>
                <Progress 
                  value={progress.value} 
                  color="success" 
                  className="mb-2"
                >
                  {progress.label}
                </Progress>
                {progress.skipvalue > 0 && (
                  <Progress 
                    value={progress.skipvalue} 
                    color="warning"
                  >
                    {progress.skiplabel}
                  </Progress>
                )}
              </Col>
            </Row>
          </div>
        )}

        {/* Alert */}
        {alert.show && (
          <Row>
            <Col md={8} className="offset-md-2">
              <Alert color={alert.type} className="mb-4">
                <div className="text-center">
                  <strong>{alert.message}</strong>
                  {alert.detail && <em>{alert.detail}</em>}
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Effective Date Selection */}
        {formParams.showEffDateSel && (
          <div className="mb-4">
            <Row>
              <Col md={4} className="offset-md-4">
                <div className="text-center">
                  <h4>Please Choose A Date Between</h4>
                  <h4>
                    <em>
                      {formParams.minDate?.toLocaleDateString()} - {formParams.maxDate?.toLocaleDateString()}
                    </em>
                  </h4>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={4} className="offset-md-4">
                <div className="well well-sm text-center">
                  <FormGroup>
                    <Label for="effectiveDate">Effective Date</Label>
                    <Input
                      type="date"
                      id="effectiveDate"
                      value={formParams.initDate?.toISOString().split('T')[0] || ''}
                      min={formParams.minDate?.toISOString().split('T')[0]}
                      max={formParams.maxDate?.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setFormParams(prev => ({ ...prev, initDate: date }));
                      }}
                    />
                  </FormGroup>
                  <div className="mt-3">
                    <h4>
                      <strong>You Chose: </strong>
                      <em>{formParams.initDate?.toLocaleDateString()}</em>
                    </h4>
                    <Button 
                      color="info" 
                      size="lg"
                      onClick={() => handleEffectiveDateSelect(formParams.initDate)}
                      disabled={!formParams.initDate}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Form Content */}
        {formParams.initDone && !formParams.showEffDateSel && (
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

                {/* Form Body */}
                <div className="form-content border rounded bg-white">
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
                    <div className="embed-responsive embed-responsive-form">
                      <iframe
                        ref={iframeRef}
                        id="formcontents"
                        className="embed-responsive-item"
                        style={{ width: '100%', height: '400px', border: 'none' }}
                        title="Form Content"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Loading State */}
        {!formParams.initDone && (
          <div className="text-center py-5">
            <Spinner color="primary" size="lg" className="mb-3" />
            <p className="text-muted">Loading form...</p>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="d-flex justify-content-between">
        <div>
          {/* Previous Button */}
          {wizardMode && currentFormIndex > 0 && (
            <Button 
              color="secondary" 
              onClick={() => {
                setCurrentFormIndex(currentFormIndex - 1);
                resetFormParams();
                loadCurrentForm();
              }}
              disabled={isSubmitting}
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Previous
            </Button>
          )}
        </div>

        <div>
          {/* Action Buttons */}
          {mainCtrl.useHTML && isSubmitted && (
            <Button 
              color="warning" 
              onClick={handleShowPDF}
              className="mr-2"
            >
              <strong>View PDF</strong>
            </Button>
          )}
          
          {wizardMode && canCloseOrSkip && isNotLastForm() && (
            <Button 
              color="success" 
              onClick={handleSkipForm}
              className="mr-2"
            >
              <i className="fas fa-forward mr-1"></i>
              <strong>Skip Form</strong>
            </Button>
          )}
          
          {submissionMode && !isSubmitting && (
            <Button 
              color="success" 
              onClick={handleSubmitForm}
              className="mr-2"
            >
              <i className="fas fa-check mr-2"></i>
              {wizardMode ? 'Submit & Next' : 'Submit Form'}
            </Button>
          )}
          
          {/* Close Button */}
          {canCloseOrSkip && (
            <Button 
              color="secondary" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please Wait...' : 'Close'}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default FormViewer;
