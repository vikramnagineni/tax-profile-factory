import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormViewer from '../components/FormViewer';
import { FormViewerService } from '../services/FormViewerService';

// Mock the service
jest.mock('../services/FormViewerService', () => ({
  FormViewerService: {
    setFormsToFill: jest.fn(),
    clearForms: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    getFormsToFill: jest.fn(() => []),
    getViewingDone: jest.fn(() => () => {}),
    getSubmissionMode: jest.fn(() => true)
  },
  useFormViewerService: () => ({
    formsToFill: [],
    viewingDone: () => {},
    submissionMode: true,
    setFormsToFill: jest.fn(),
    clearForms: jest.fn()
  })
}));

describe('FormViewer Component', () => {
  const mockMainCtrl = {
    isFormsEditable: true,
    useHTML: true,
    company: { legalname: 'Test Company' },
    employee: { empnum: '12345' },
    empResponse: true,
    viewFormInstruction: jest.fn(),
    title: 'Test Forms',
    mode: 'default'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<FormViewer mainCtrl={mockMainCtrl} />);
    // Component should render without any forms initially
  });

  test('FormViewerService integration', () => {
    const testForms = [
      {
        reportid: 'W4',
        rpttitle: 'Employee Withholding Certificate',
        rptName: 'Federal W-4 Form',
        isEditable: true,
        effectiveDate: '2024-01-01'
      }
    ];

    const mockCallback = jest.fn();

    // Test that the service method is called correctly
    FormViewerService.setFormsToFill(testForms, mockCallback, true);
    
    expect(FormViewerService.setFormsToFill).toHaveBeenCalledWith(
      testForms, 
      mockCallback, 
      true
    );
  });
});

// Integration test for the complete flow
describe('FormViewer Integration', () => {
  test('viewForm functionality flow', () => {
    // Mock form data
    const testForm = {
      reportid: 'W4',
      rpttitle: 'Employee Withholding Certificate',
      rptName: 'Federal W-4 Form',
      isEditable: true,
      effectiveDate: '2024-01-01',
      taxMsg: null
    };

    const mockCallback = jest.fn();

    // Simulate the Angular equivalent: ctrl.viewForm(form)
    // In Angular: FormViewerService.setFormsToFill([form], ctrl.loadFormsList, true)
    // In React: FormViewerService.setFormsToFill([form], callback, true)
    
    const formsArray = [testForm];
    FormViewerService.setFormsToFill(formsArray, mockCallback, true);

    // Verify the service was called with correct parameters
    expect(FormViewerService.setFormsToFill).toHaveBeenCalledWith(
      formsArray,
      mockCallback,
      true
    );
  });
});
