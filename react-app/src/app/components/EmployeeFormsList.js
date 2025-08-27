import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Container, Row, Col, Alert, Form, FormGroup, Label, Input, Card, CardHeader, CardBody, Collapse } from 'reactstrap';
import ProgressBar from './ProgressBar';

// Mock API service since the import path might not exist
const mockEmployeeFormsApi = () => ({
  getFormsToBeFilled: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      result: {
        'Federal': [
          {
            reportid: 'W4',
            rpttitle: 'Employee\'s Withholding Certificate',
            rptName: 'Federal W-4 Form',
            isEditable: true,
            effectiveDate: '2024-01-01',
            taxMsg: null
          }
        ],
        'California': [
          {
            reportid: 'CAW4',
            rpttitle: 'California Withholding Certificate',
            rptName: 'CA W-4 Form',
            isEditable: true,
            effectiveDate: '2024-01-01',
            taxMsg: 'Update required for 2024'
          }
        ]
      },
      totalForms: 2,
      totalFormsToBeFilled: 0
    };
  },
  checkFormsPreferences: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return 'Please complete all required forms by the end of the month.';
  },
  getFilteredForms: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        authName: 'Federal',
        forms: [
          {
            reportid: 'W4',
            rpttitle: 'Employee\'s Withholding Certificate',
            rptName: 'Federal W-4 Form',
            effectiveDate: '2024-01-01'
          },
          {
            reportid: 'I9',
            rpttitle: 'Employment Eligibility Verification',
            rptName: 'Federal I-9 Form',
            effectiveDate: '2024-01-01'
          }
        ]
      },
      {
        authName: 'California',
        forms: [
          {
            reportid: 'CAW4',
            rpttitle: 'California Withholding Certificate',
            rptName: 'CA W-4 Form',
            effectiveDate: '2024-01-01'
          }
        ]
      }
    ];
  },
  updateFormProgress: async (selectedForms) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('Updated forms:', selectedForms);
    return { success: true };
  }
});

const EmployeeFormsList = ({ 
  tabindex, 
  mainCtrl, 
  formTabsCtrl,
  onViewForm,
  onViewFormWizard,
  onViewFormInstruction 
}) => {
  const formsApi = mockEmployeeFormsApi();
  
  // State management
  const [formsToBeFilled, setFormsToBeFilled] = useState(null);
  const [otherForms, setOtherForms] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [showChooserModal, setShowChooserModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertSuccessMsg, setAlertSuccessMsg] = useState('');
  const [isFormsEditable, setIsFormsEditable] = useState(true);
  const [progress, setProgress] = useState({
    value: 0,
    label: '',
    type: 'success',
    className: 'progress-bar'
  });
  const [openAccordions, setOpenAccordions] = useState({});

  // Initialize component
  useEffect(() => {
    if (formTabsCtrl?.activetab === tabindex) {
      loadFormsList();
      checkFormsPrefs();
    }
  }, [formTabsCtrl?.activetab, tabindex]);

  // Progress calculation
  const updateProgress = (noSubmForms, noFormsToBeFilled) => {
    if (noSubmForms === noFormsToBeFilled) {
      setProgress({
        value: 0,
        label: '',
        type: 'success',
        className: 'progress-bar'
      });
    } else if (noSubmForms !== noFormsToBeFilled && noSubmForms > 0) {
      const progressValue = Math.floor(((noFormsToBeFilled - noSubmForms) / noFormsToBeFilled) * 100);
      setProgress({
        value: progressValue,
        label: `Forms ${progressValue}% Completed`,
        type: 'warning',
        className: 'progress-bar progress-bar-striped active'
      });
    }
  };

  // Toggle accordion
  const toggleAccordion = accordionId => {
    setOpenAccordions(prev => ({
      ...prev,
      [accordionId]: !prev[accordionId]
    }));
  };

  // Load forms list from API
  const loadFormsList = async () => {
    try {
      setProgress({
        value: 0,
        type: 'success',
        className: 'progress-striped active'
      });
      setFormsToBeFilled(null);
      setIsFormsEditable(String(formTabsCtrl?.mainCtrl?.isFormsEditable || true));

      const data = await formsApi.getFormsToBeFilled();
      
      setIsFormsEditable(mainCtrl?.isFormsEditable || true);
      setFormsToBeFilled(data.result);
      updateProgress(data.totalFormsToBeFilled, data.totalForms);
      
      // Mark all forms as not submitted initially
      if (data.result) {
        Object.keys(data.result).forEach(key => {
          data.result[key].forEach(form => {
            form.submitted = false;
          });
        });

        // Initialize first accordion to be open
        const firstAuthName = Object.keys(data.result)[0];
        if (firstAuthName) {
          const firstAccordionId = `accordion-${firstAuthName.replace(/\s+/g, '')}`;
          setOpenAccordions({ [firstAccordionId]: true });
        }
      }
    } catch (error) {
      console.error('Error loading forms:', error);
    }
  };

  // Check forms preferences
  const checkFormsPrefs = async () => {
    try {
      const data = await formsApi.checkFormsPreferences();
      
      if (data && data !== "") {
        // Show alert with preference message
        console.log('Forms preference message:', data);
      }
    } catch (error) {
      console.error('Error checking forms preferences:', error);
    }
  };

  // Handle form selection in chooser modal
  const handleFormSelection = (formId) => {
    setSelectedForms([formId]);
  };

  // Show chooser modal
  const handleShowChooserModal = async () => {
    setAlertSuccess(false);
    try {
      const data = await formsApi.getFilteredForms();
      setOtherForms(data);
      setShowChooserModal(true);
    } catch (error) {
      console.error('Error loading filtered forms:', error);
    }
  };

  // Close chooser modal
  const handleCloseChooserModal = () => {
    setShowChooserModal(false);
    setSelectedForms([]);
    setFilterQuery('');
  };

  // Choose selected forms
  const handleChooseSelectedForms = async () => {
    try {
      await formsApi.updateFormProgress(selectedForms);
      
      setSelectedForms([]);
      setAlertSuccess(true);
      setAlertSuccessMsg('Updated selected form successfully.');
      loadFormsList();
      handleCloseChooserModal();
    } catch (error) {
      console.error('Error updating form progress:', error);
    }
  };

  // View individual form
  const handleViewForm = (form) => {
    if (onViewForm) {
      onViewForm([form]);
    }
  };

  // View forms wizard
  const handleViewFormWizard = () => {
    if (!formsToBeFilled || Object.keys(formsToBeFilled).length === 0) {
      return;
    }

    const editableForms = [];
    Object.keys(formsToBeFilled).forEach(authName => {
      const forms = formsToBeFilled[authName];
      forms.forEach(form => {
        if (form.isEditable === true) {
          editableForms.push(form);
        }
      });
    });

    if (onViewFormWizard) {
      onViewFormWizard(editableForms);
    }
  };

  // Check if wizard can be used
  const canUseWizard = () => {
    return formTabsCtrl?.mainCtrl?.useHTML || false;
  };

  // Filter other forms based on query
  const filteredOtherForms = otherForms.filter(form => 
    form.authName?.toLowerCase().includes(filterQuery.toLowerCase()) || false
  );

  return (
    <div>
      {formsToBeFilled && (
        <div>
          {/* Progress Bar */}
          <div className="spacer mb-4">
            <ProgressBar
              percentage={progress.value}
              label={progress.label}
              progressColor={progress.type === 'success' ? '#28a745' : '#ffc107'}
              height="20px"
            />
          </div>

          {/* Forms Wizard Button */}
          { /* isFormsEditable === 'yes' && canUseWizard() && (
            <div className="text-center mb-4">
              <Button
                color="success"
                size="lg"
                onClick={handleViewFormWizard}
                title="Click To Complete All Forms"
              >
                <i className="fas fa-play mr-2"></i>
                Forms Wizard
              </Button>
            </div>
          ) */}

          {/*  Remove below code once api integration is done. use above code block */}
          <div className="text-center mb-4">
              <Button
                color="success"
                size="lg"
                onClick={handleViewFormWizard}
                title="Click To Complete All Forms"
              >
                <i className="fas fa-play mr-2"></i>
                Forms Wizard
              </Button>
            </div>

          {/* Success Alert */}
          {alertSuccess && (
            <Alert color="success" toggle={() => setAlertSuccess(false)}>
              {alertSuccessMsg}
            </Alert>
          )}

          {/* Forms Accordion */}
          <div>
            {Object.entries(formsToBeFilled).map(([authName, forms]) => {
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
                      <div className="mb-0 text-success">
                        <i className="fas fa-building mr-2"></i>
                        {authName}
                      </div>
                      <i className={`fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"} text-muted`}></i>
                    </div>
                  </CardHeader>
                  <Collapse isOpen={isOpen}>
                    <CardBody>
                      {forms.map((form, formIndex) => (
                        <div key={form.reportid} className="mb-1 p-1 border-success">
                          <div className="d-flex align-items-start">
                            {/* Warning Icon */}
                            {form.taxMsg && (
                              <i
                                className="fas fa-exclamation-triangle text-danger mr-2 mt-1"
                                title={form.taxMsg}
                                style={{ cursor: "help" }}
                              ></i>
                            )}

                            {/* Info Icon */}
                            <i
                              className="fas fa-info-circle text-info mr-2 mt-1"
                              title={form.rptName || form.rpttitle}
                              style={{ cursor: "help" }}
                            ></i>

                            <div className="ml-2 flex-grow-1">
                              <div className="font-weight-bold text-dark d-flex align-items-center">
                                {/* {isFormsEditable === 'yes' && form.isEditable === true ? ( */}
                                { true ? (   /* comment this line and use above line once api is integrated */
                                  <button
                                    className="btn btn-link text-primary p-0 text-left font-weight-bold"
                                    onClick={() => handleViewForm(form)}
                                    style={{ textDecoration: 'none' }}
                                  >
                                    {form.rpttitle}
                                  </button>
                                ) : (
                                  <span>{form.rpttitle}</span>
                                )}
                                {/* PDF Icon */}
                                <i
                                  className="far fa-file-pdf text-info ml-2"
                                  style={{ 
                                    cursor: "pointer", 
                                    fontSize: "1.1em",
                                    display: "none"
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onViewFormInstruction?.(form.reportid, form.effectiveDate);
                                  }}
                                  title="View PDF Instructions"
                                ></i>
                              </div>
                              {form.rptName && (
                                <small className="text-muted d-block mt-1">{form.rptName}</small>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardBody>
                  </Collapse>
                </Card>
              );
            })}
          </div>

          {/* Pick Other Forms Button */}
          <div className="d-flex justify-content-end mb-3">
            <Button
              color="primary"
              size="sm"
              onClick={handleShowChooserModal}
            >
              Pick Other Forms
            </Button>
          </div>
        </div>
      )}

      {/* No Forms Message */}
      {!formsToBeFilled && (
        <div className="spacer">
          <div className="d-flex justify-content-end mb-3">
            <Button
              color="primary"
              size="sm"
              onClick={handleShowChooserModal}
            >
              Pick Other Forms
            </Button>
          </div>
          
          <Alert color="info">
            <h4 className="alert-heading">Note!</h4>
            You have no forms required to be completed. You can access View/Change Completed Forms to change a previously filed form or Saved/Rejected Forms to finish forms in progress or Pick Other Forms to choose a form to be completed. Not all options may be available to you.
          </Alert>
        </div>
      )}

      {/* Form Chooser Modal */}
      <Modal 
        isOpen={showChooserModal} 
        toggle={handleCloseChooserModal}
        size="xl"
        centered
      >
        <ModalHeader toggle={handleCloseChooserModal}>
          Please Choose A Form
        </ModalHeader>
        
        <ModalBody>
          {/* Filter Input */}
          <Row className="mb-4">
            <Col md={10} className="mx-auto">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-filter"></i>
                </span>
                <Input
                  type="text"
                  placeholder="Type authority name to filter..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
              </div>
            </Col>
          </Row>

          {/* Filtered Forms */}
          <Row>
            <Col md={10} className="mx-auto">
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredOtherForms.map((frm, index) => {
                  const modalAccordionId = `modal-accordion-${frm.authName.replace(/\s+/g, '')}`;
                  const isModalOpen = openAccordions[modalAccordionId] !== false; // Default to open

                  return (
                    <Card key={frm.authName} className="mb-3 border">
                      <CardHeader
                        className="bg-light cursor-pointer"
                        onClick={() => toggleAccordion(modalAccordionId)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="mb-0 text-success">
                            <i className="fas fa-building mr-2"></i>
                            {frm.authName}
                          </div>
                          <i className={`fas ${isModalOpen ? "fa-chevron-up" : "fa-chevron-down"} text-muted`}></i>
                        </div>
                      </CardHeader>
                      <Collapse isOpen={isModalOpen}>
                        <CardBody>
                          {frm.forms?.map((form) => (
                            <div key={form.reportid} className="mb-1 p-1 border-success">
                              <FormGroup check className="mb-2">
                                <div className="d-flex align-items-start">
                                  {/* Info Icon */}
                                  <i
                                    className="fas fa-info-circle text-info mr-2 mt-1"
                                    title={form.rptName || form.rpttitle}
                                    style={{ cursor: "help" }}
                                  ></i>
                                  <Label check className="d-flex align-items-start justify-content-between">
                                    <div className="d-flex align-items-start">
                                      <Input
                                        type="radio"
                                        name={`formChoice-${index}`}
                                        value={form.reportid}
                                        onChange={() => handleFormSelection(form.reportid)}
                                        checked={selectedForms.includes(form.reportid)}
                                        className="mt-1"
                                      />
                                      <div className="ml-2 flex-grow-1">
                                        <div className="font-weight-bold text-dark d-flex align-items-center">
                                          {form.rpttitle}
                                          {/* PDF Icon */}
                                          <i
                                            className="far fa-file-pdf text-info ml-2"
                                            style={{ 
                                              cursor: "pointer", 
                                              fontSize: "1.1em"
                                            }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              onViewFormInstruction?.(form.reportid, form.effectiveDate);
                                            }}
                                            title="View PDF Instructions"
                                          ></i>
                                        </div>
                                        {form.rptName && (
                                          <small className="text-muted d-block mt-1">{form.rptName}</small>
                                        )}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              </FormGroup>
                            </div>
                          ))}
                        </CardBody>
                      </Collapse>
                    </Card>
                  );
                })}
              </div>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="success" onClick={handleChooseSelectedForms}>
            Choose Selected Form
          </Button>
          <Button color="warning" onClick={handleCloseChooserModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EmployeeFormsList;