import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Collapse
} from "reactstrap";
import ProgressBar from "./ProgressBar";
import { useQuestionnaireApi } from "../services/QuestionnaireApiService";
import { ViewPDF } from "bsiuilib";

const Questionnaire = ({ mainCtrl }) => {
  const questionnaireApi = useQuestionnaireApi();

  // State management
  const [liveWorkAddresses, setLiveWorkAddresses] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [groupsAnswered, setGroupsAnswered] = useState([]);
  const [progress, setProgress] = useState({
    value: 0,
    label: "",
    type: "warning",
    className: "progress-striped active"
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });
  const [isLoading, setIsLoading] = useState(true);
  const [showFormViewer, setShowFormViewer] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({ minDate: null, maxDate: null });
  const [openAccordions, setOpenAccordions] = useState({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [viewPdfMode, setViewPdfMode] = useState(false);
  const [pdfData, setPDFData] = useState();

  // Initialize component
  useEffect(() => {
    initializeQuestionnaire();
  }, []);

  // Initialize questionnaire data
  const initializeQuestionnaire = async () => {
    setIsLoading(true);
    try {
      // Load live/work addresses with questions
      const addressesData = await questionnaireApi.getLiveWorkStatesWithQuestions();
      setLiveWorkAddresses(addressesData);

      // Initialize first accordion to be open
      if (addressesData.length > 0) {
        const firstAccordionId = `accordion-${addressesData[0].id || 0}`;
        setOpenAccordions({ [firstAccordionId]: true });
      }

      // Load questionnaire message
      const messageData = await questionnaireApi.getQuestionnaireMessage();
      if (messageData) {
        showAlert(messageData, "info");
      }

      // Initialize progress
      setProgress({
        value: 0,
        label: "",
        type: "warning",
        className: "progress-striped active"
      });
    } catch (error) {
      console.error("Error initializing questionnaire:", error);
      showAlert("Error loading questionnaire data", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  // Update progress based on answered groups
  const updateProgress = groupId => {
    if (groupsAnswered.includes(groupId)) {
      return false;
    }

    const newGroupsAnswered = [...groupsAnswered, groupId];
    setGroupsAnswered(newGroupsAnswered);

    const totalGroups = liveWorkAddresses.length;
    const answeredCount = newGroupsAnswered.length;

    if (answeredCount < totalGroups) {
      const progressValue = (answeredCount / totalGroups) * 100;
      setProgress({
        value: Math.round(progressValue),
        label: `${Math.round(progressValue)}%`,
        type: "warning",
        className: "progress-striped active"
      });
    }

    if (answeredCount === totalGroups) {
      setProgress({
        value: 100,
        label: "Questionnaire Complete",
        type: "success",
        className: ""
      });
    }
  };

  // Handle form selection
  const handleFormSelection = (groupId, formId) => {
    // Update selected forms
    const newSelectedForms = [...selectedForms];
    const existingIndex = newSelectedForms.findIndex(f => f.groupId === groupId);

    if (existingIndex >= 0) {
      newSelectedForms[existingIndex] = { groupId, formId };
    } else {
      newSelectedForms.push({ groupId, formId });
    }

    setSelectedForms(newSelectedForms);
    updateProgress(groupId);
  };

  // Show alert
  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
  };

  // Close alert
  const closeAlert = () => {
    setAlert({ show: false, message: "", type: "info" });
  };

  // Fill forms action
  const fillForms = async () => {
    try {
      const response = await questionnaireApi.updateFormSnapshot(selectedForms);
      if (response.success) {
        // Transition to forms view
        if (mainCtrl.onQuestionnaireComplete) {
          mainCtrl.onQuestionnaireComplete();
        }
      }
    } catch (error) {
      console.error("Error updating form snapshot:", error);
      showAlert("Error saving form selections", "danger");
    }
  };

  // Show form viewer
  const viewForm = form => {
    setCurrentForm(form);
    setShowFormViewer(true);
  };

  // Close form viewer
  const closeFormViewer = () => {
    setShowFormViewer(false);
    setCurrentForm(null);
  };

  // Handle date selection
  const handleDateSelection = date => {
    setSelectedDate(date);
  };

  // Confirm date selection
  const confirmDateSelection = () => {
    setShowDatePicker(false);
    // Process with selected date
    if (currentForm) {
      // Continue with form processing using selected date
      console.log("Processing form with date:", selectedDate);
    }
  };

  // Toggle accordion
  const toggleAccordion = accordionId => {
    setOpenAccordions(prev => ({
      ...prev,
      [accordionId]: !prev[accordionId]
    }));
  };

  // View PDF in new window
  const viewPdf = async (form) => {
    if (pdfLoading) return; // Prevent multiple clicks
    
    setPdfLoading(true);
    try {
      showAlert("Fetching PDF content from AI service...", "info");
      
      // Make AI call to get PDF blob data
      //const response = await questionnaireApi.getFormPdf(form.id);
      
     // if (response.success && response.blob) {
      if (true) {
        // setPDFData(response.blob);
       setViewPdfMode(true);

      } else {
        showAlert("Failed to fetch PDF content", "danger");
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      showAlert("Error fetching PDF content", "danger");
    } finally {
      setPdfLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="mt-3">Retrieving Employee Data to Complete This Action</div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col className="mx-auto">
          {/* Alert */}
          {alert.show && (
            <Alert color={alert.type} toggle={closeAlert} className="mb-4" style={{ color: 'green' }}>
              {alert.message}
            </Alert>
          )}

          {/* Progress Bar */}
          {selectedForms.length > 0 && (<div className="mb-4">
            <ProgressBar
              percentage={progress.value}
              label={progress.label || "Questionnaire Progress"}
              progressColor={progress.type === "success" ? "#28a745" : "#ffc107"}
              striped={progress.className.includes("striped")}
              animated={progress.className.includes("active")}
            />
          </div> )}

          {/* Questionnaire Content */}
          <Card>
            <CardHeader>
              <div className="mb-0">
                <i className="fas fa-clipboard-list mr-2"></i>
                Tax Withholding Questionnaire
              </div>
            </CardHeader>
            <CardBody>
              {liveWorkAddresses.length === 0 ? (
                <Alert color="info">
                  <h4 className="alert-heading">No Questions Available</h4>
                  <p>There are currently no questionnaire items to display.</p>
                </Alert>
              ) : (
                <div>
                  <p className="mb-4">
                    Please complete the questionnaire by selecting the appropriate forms for your tax situation.
                  </p>

                  {liveWorkAddresses.map((addressGroup, index) => {
                    const accordionId = `accordion-${addressGroup.id || index}`;
                    const isOpen = openAccordions[accordionId] || false;

                    return (
                      <Card key={addressGroup.id || index} className="mb-3 border">
                        <CardHeader
                          className="bg-light cursor-pointer"
                          onClick={() => toggleAccordion(accordionId)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="mb-0 text-success">
                              <i className="fas fa-map-marker-alt mr-2"></i>
                              {addressGroup.stateName || `State ${index + 1}`}
                            </div>
                            <i className={`fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"} text-muted`}></i>
                          </div>
                        </CardHeader>
                        <Collapse isOpen={isOpen}>
                          <CardBody>
                            <p className="mb-3 text-muted">{addressGroup.description}</p>

                            {addressGroup.forms &&
                              addressGroup.forms.map(form => (
                                <div key={form.id} className="mb-1 p-1 border-success">
                                  <FormGroup check className="mb-2">
                                    <div className="d-flex align-items-start">
                                      {/* Information icon with tooltip */}
                                      <i
                                        className="fas fa-info-circle text-info mr-2 mt-1"
                                        title={form.rptName || form.title}
                                        style={{ cursor: "help" }}
                                      ></i>
                                      <Label check className="d-flex align-items-start justify-content-between">
                                        <div className="d-flex align-items-start">
                                          <Input
                                            type="radio"
                                            name={`group-${addressGroup.id}`}
                                            value={form.id}
                                            onChange={() => handleFormSelection(addressGroup.id, form.id)}
                                            checked={selectedForms.some(
                                              sf => sf.groupId === addressGroup.id && sf.formId === form.id
                                            )}
                                            className="mt-1"
                                          />
                                          <div className="ml-2 flex-grow-1">
                                            <div className="font-weight-bold text-dark d-flex align-items-center">
                                              {form.title}
                                              {form.hasInstructions && (
                                                 <i
                                                  className={`far fa-file-pdf text-info ml-2 ${pdfLoading ? 'text-muted' : ''}`}
                                                  style={{ 
                                                    cursor: pdfLoading ? "wait" : "pointer", 
                                                    fontSize: "1.1em",
                                                    opacity: pdfLoading ? 0.6 : 1
                                                  }}
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    viewPdf(form)
                                                  }}
                                                  title={pdfLoading ? "Loading PDF..." : "View PDF Instructions"}
                                                ></i>
                                              )}
                                            </div>
                                            {form.description && (
                                              <small className="text-muted d-block mt-1">{form.description}</small>
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

                  {/* Fill Forms Button */}
                  {selectedForms.length > 0 && (
                    <div className="text-center mt-4">
                      <Button color="success" size="lg" onClick={fillForms} className="px-5">
                        <i className="fas fa-edit mr-2"></i>
                        Fill Forms ({selectedForms.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Form Viewer Modal */}
          <Modal isOpen={showFormViewer} toggle={closeFormViewer} size="lg" centered>
            <ModalHeader toggle={closeFormViewer}>
              <i className="fas fa-file-alt mr-2"></i>
              Form Information
            </ModalHeader>
            <ModalBody>
              {currentForm && (
                <div>
                  <h5>{currentForm.title}</h5>
                  <p className="text-muted">{currentForm.formType}</p>

                  {currentForm.description && (
                    <div className="mb-3">
                      <h6>Description:</h6>
                      <p>{currentForm.description}</p>
                    </div>
                  )}

                  {currentForm.instructions && (
                    <div className="mb-3">
                      <h6>Instructions:</h6>
                      <div dangerouslySetInnerHTML={{ __html: currentForm.instructions }} />
                    </div>
                  )}

                  <Alert color="info">
                    <h6 className="alert-heading">Next Steps</h6>
                    <p className="mb-0">
                      After completing the questionnaire, you'll be able to fill out the selected forms.
                    </p>
                  </Alert>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={closeFormViewer}>
                Close
              </Button>
            </ModalFooter>
          </Modal>

          {/* Date Picker Modal */}
          <Modal isOpen={showDatePicker} toggle={() => setShowDatePicker(false)} centered>
            <ModalHeader toggle={() => setShowDatePicker(false)}>
              <i className="fas fa-calendar-alt mr-2"></i>
              Select Effective Date
            </ModalHeader>
            <ModalBody>
              <div className="text-center mb-4">
                <h5>Please Choose A Date Between</h5>
                <p className="text-muted">
                  {dateRange.minDate && new Date(dateRange.minDate).toLocaleDateString()} -{" "}
                  {dateRange.maxDate && new Date(dateRange.maxDate).toLocaleDateString()}
                </p>
              </div>

              <FormGroup>
                <Label>Selected Date:</Label>
                <Input
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={e => handleDateSelection(new Date(e.target.value))}
                  min={dateRange.minDate}
                  max={dateRange.maxDate}
                />
              </FormGroup>

              <div className="text-center mt-3">
                <p>
                  <strong>You Chose: </strong>
                  <em>{selectedDate.toLocaleDateString()}</em>
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => setShowDatePicker(false)}>
                Cancel
              </Button>
              <Button color="info" onClick={confirmDateSelection}>
                Continue
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
      <ViewPDF view={viewPdfMode} handleHidePDF={() => {setViewPdfMode(false)}} pdfData={{ docData: pdfData}} />
    </Container>
  );
};

export default Questionnaire;
