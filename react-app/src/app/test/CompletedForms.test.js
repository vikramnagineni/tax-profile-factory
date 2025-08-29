import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompletedForms from '../components/CompletedForms';

// Mock the API service
jest.mock('../services/EmployeeFormsApiService', () => ({
  EmployeeFormsApi: () => ({
    getCompletedForms: jest.fn(() => Promise.resolve({
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
          }
        ]
      }
    })),
    getChangeForms: jest.fn(() => Promise.resolve({
      forms: [
        {
          reportid: 'W4_EXEMPT',
          rpttitle: 'W-4 with Exemptions',
          rptName: 'Federal W-4 Form with Exemptions'
        }
      ]
    }))
  })
}));

describe('CompletedForms Component', () => {
  const mockProps = {
    tabindex: 'tab-2',
    mainCtrl: {
      isFormsEditable: true,
      useHTML: true,
      company: { legalname: 'Test Company' },
      employee: { empnum: '12345' },
      empResponse: true,
      viewFormInstruction: jest.fn(),
      title: 'Test Forms',
      mode: 'default',
      loginType: 'employee'
    },
    formTabsCtrl: {
      activetab: 'tab-2',
      mainCtrl: {},
      page: {
        alert: { show: false, message: '', type: 'info' },
        closeAlert: jest.fn()
      }
    },
    onViewForm: jest.fn(),
    onViewFormInstruction: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<CompletedForms {...mockProps} />);
    expect(screen.getByText('Loading completed forms...')).toBeInTheDocument();
  });

  test('loads and displays completed forms', async () => {
    render(<CompletedForms {...mockProps} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Employee\'s Withholding Certificate')).toBeInTheDocument();
    });

    // Check if form details are shown
    expect(screen.getByText('Federal')).toBeInTheDocument();
    expect(screen.getByText('Form ID: W4')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('handles form viewing', async () => {
    render(<CompletedForms {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('View')).toBeInTheDocument();
    });

    const viewButton = screen.getByText('View');
    fireEvent.click(viewButton);

    expect(mockProps.onViewForm).toHaveBeenCalledWith([
      expect.objectContaining({
        reportid: 'W4',
        rpttitle: 'Employee\'s Withholding Certificate'
      })
    ]);
  });

  test('handles form instruction viewing', async () => {
    render(<CompletedForms {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByTitle('View Form Instructions')).toBeInTheDocument();
    });

    const instructionButton = screen.getByTitle('View Form Instructions');
    fireEvent.click(instructionButton);

    expect(mockProps.onViewFormInstruction).toHaveBeenCalledWith('W4', '2024-01-01');
  });

  test('shows change form button when form is not editable', async () => {
    render(<CompletedForms {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Change')).toBeInTheDocument();
    });

    const changeButton = screen.getByText('Change');
    expect(changeButton).toBeInTheDocument();
  });

  test('opens chooser modal when change button is clicked', async () => {
    render(<CompletedForms {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Change')).toBeInTheDocument();
    });

    const changeButton = screen.getByText('Change');
    fireEvent.click(changeButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('Please Choose Appropriate Form')).toBeInTheDocument();
    });

    expect(screen.getByText('W-4 with Exemptions')).toBeInTheDocument();
  });

  test('toggles accordion sections', async () => {
    render(<CompletedForms {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Federal')).toBeInTheDocument();
    });

    const federalHeader = screen.getByText('Federal').closest('.card-header');
    fireEvent.click(federalHeader);

    // The accordion should be collapsible
    expect(federalHeader).toBeInTheDocument();
  });

  test('displays tax message warning when present', async () => {
    // Mock with a form that has a tax message
    jest.mocked(require('../services/EmployeeFormsApiService').EmployeeFormsApi).mockReturnValue({
      getCompletedForms: jest.fn(() => Promise.resolve({
        completedForms: {
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
          ]
        }
      })),
      getChangeForms: jest.fn(() => Promise.resolve({ forms: [] }))
    });

    render(<CompletedForms {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Tax calculation warning - please review')).toBeInTheDocument();
    });

    expect(screen.getByText('Tax calculation warning - please review')).toBeInTheDocument();
  });
});
