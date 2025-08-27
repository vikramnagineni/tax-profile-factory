import { useState, useEffect, useCallback } from 'react';

/**
 * FormViewer Service - React equivalent of Angular FormViewerService
 * Manages form viewing state and form navigation
 */

class FormViewerServiceClass {
  constructor() {
    this.formsToFill = [];
    this.viewingDone = () => {};
    this.submissionMode = true;
    this.listeners = new Set();
  }

  // Set forms to be filled and configure viewing options
  setFormsToFill(formsToFill, callback, submissionMode = true) {
    this.formsToFill = formsToFill || [];
    this.viewingDone = callback || (() => {});
    this.submissionMode = submissionMode;
    
    // Notify all listeners
    this.notifyListeners();
  }

  // Get current forms to fill
  getFormsToFill() {
    return this.formsToFill;
  }

  // Get viewing done callback
  getViewingDone() {
    return this.viewingDone;
  }

  // Get submission mode
  getSubmissionMode() {
    return this.submissionMode;
  }

  // Clear forms
  clearForms() {
    this.formsToFill = [];
    this.viewingDone = () => {};
    this.submissionMode = true;
    this.notifyListeners();
  }

  // Add listener for state changes
  addListener(listener) {
    this.listeners.add(listener);
  }

  // Remove listener
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  // Notify all listeners of state changes
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener({
          formsToFill: this.formsToFill,
          viewingDone: this.viewingDone,
          submissionMode: this.submissionMode
        });
      } catch (error) {
        console.error('Error notifying FormViewer listener:', error);
      }
    });
  }
}

// Singleton instance
const formViewerServiceInstance = new FormViewerServiceClass();

// React hook to use the FormViewer service
export const useFormViewerService = () => {
  const [state, setState] = useState({
    formsToFill: formViewerServiceInstance.getFormsToFill(),
    viewingDone: formViewerServiceInstance.getViewingDone(),
    submissionMode: formViewerServiceInstance.getSubmissionMode()
  });

  const updateState = useCallback((newState) => {
    setState(newState);
  }, []);

  useEffect(() => {
    formViewerServiceInstance.addListener(updateState);
    
    return () => {
      formViewerServiceInstance.removeListener(updateState);
    };
  }, [updateState]);

  return {
    ...state,
    setFormsToFill: (forms, callback, submissionMode) => 
      formViewerServiceInstance.setFormsToFill(forms, callback, submissionMode),
    clearForms: () => formViewerServiceInstance.clearForms()
  };
};

// Export the service instance for direct access
export const FormViewerService = formViewerServiceInstance;
export default FormViewerService;
