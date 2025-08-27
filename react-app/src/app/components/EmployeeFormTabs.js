import React, { useState, useEffect } from 'react';
import { Container, Nav, NavItem, NavLink, TabContent, TabPane, Alert } from 'reactstrap';
import EmployeeFormsList from './EmployeeFormsList';

const EmployeeFormTabs = ({ mainCtrl, activetab = 1 }) => {
  const [activeTab, setActiveTab] = useState(`tab-${activetab}`);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  // Tab configuration
  const tabs = [
    {
      key: 'tab-1',
      title: 'Forms To Complete',
      component: 'formsToComplete',
      tabindex: 'tab-1',
      icon: 'fa-edit'
    },
    {
      key: 'tab-2',
      title: 'View/Change Completed Forms',
      component: 'completedForms',
      tabindex: 'tab-2',
      icon: 'fa-check-circle'
    },
    {
      key: 'tab-3',
      title: 'Saved/Rejected Forms',
      component: 'savedRejectedForms',
      tabindex: 'tab-3',
      icon: 'fa-save'
    }
  ];

  // Enhanced main controller for child components
  const formTabsCtrl = {
    activetab: activeTab,
    mainCtrl: mainCtrl,
    page: {
      ...mainCtrl.page,
      alert: {
        ...alert,
        show: () => setAlert({ ...alert, show: true }),
        hide: () => setAlert({ ...alert, show: false }),
        closeAlert: () => setAlert({ show: false, message: '', type: 'info' })
      }
    },
    setActiveTab: (tabKey) => setActiveTab(tabKey)
  };

  // Handle form viewing
  const handleViewForm = (forms) => {
    console.log('View form:', forms);
    // This would typically trigger the FormViewer component
    // You can emit an event or call a callback to parent component
    if (mainCtrl.onViewForm) {
      mainCtrl.onViewForm(forms);
    }
  };

  // Handle form wizard
  const handleViewFormWizard = (forms) => {
    console.log('View form wizard:', forms);
    // This would typically start the form wizard process
    if (mainCtrl.onViewFormWizard) {
      mainCtrl.onViewFormWizard(forms);
    }
  };

  // Handle form instruction viewing
  const handleViewFormInstruction = (reportId, effectiveDate) => {
    if (mainCtrl.viewFormInstruction) {
      mainCtrl.viewFormInstruction(reportId, effectiveDate);
    }
  };

  // Toggle tab
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // Render tab content based on active tab
  const renderTabContent = (tabConfig) => {
    switch (tabConfig.component) {
      case 'formsToComplete':
        return (
          <EmployeeFormsList
            tabindex={tabConfig.tabindex}
            mainCtrl={mainCtrl}
            formTabsCtrl={formTabsCtrl}
            onViewForm={handleViewForm}
            onViewFormWizard={handleViewFormWizard}
            onViewFormInstruction={handleViewFormInstruction}
          />
        );
      
      case 'completedForms':
        return (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h4>Completed Forms</h4>
              <p className="text-muted">
                View and modify your previously completed tax forms.
                <br />
                This section would show completed forms with options to edit or resubmit.
              </p>
            </div>
            <Alert color="info">
              <h4 className="alert-heading">Coming Soon</h4>
              This functionality will allow you to view and modify completed forms.
            </Alert>
          </div>
        );
      
      case 'savedRejectedForms':
        return (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-save fa-3x text-warning mb-3"></i>
              <h4>Saved/Rejected Forms</h4>
              <p className="text-muted">
                Continue working on forms you've saved as drafts or review rejected submissions.
                <br />
                This section would show forms in progress and rejection reasons.
              </p>
            </div>
            <Alert color="warning">
              <h4 className="alert-heading">Coming Soon</h4>
              This functionality will allow you to manage draft and rejected forms.
            </Alert>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-5">
            <h4>Tab Content</h4>
            <p className="text-muted">Content for {tabConfig.title}</p>
          </div>
        );
    }
  };

  return (
    <Container fluid>
      {/* Global Alert */}
      {alert.show && (
        <Alert 
          color={alert.type} 
          toggle={() => setAlert({ show: false, message: '', type: 'info' })}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      {/* Remove this alert once the api integration is done. The above alert needs to be used. */}
      <Alert 
          color={'info'} 
          toggle={() => setAlert({ show: false, message: '', type: 'info' })}
          className="mb-4"
        >
          1) You have not set your form preferences. Go to Settings from the dashboard to save your preferences.
        </Alert>

      {/* Form Tabs Navigation */}
      <Nav tabs className="mb-4">
        {tabs.map((tab) => (
          <NavItem key={tab.key}>
            <NavLink
              className={activeTab === tab.key ? 'active' : ''}
              onClick={() => toggleTab(tab.key)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`fas ${tab.icon} mr-2`}></i>
              {tab.title}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      {/* Tab Content */}
      <TabContent activeTab={activeTab}>
        {tabs.map((tab) => (
          <TabPane key={tab.key} tabId={tab.key}>
            <div className="tab-content-wrapper">
              {renderTabContent(tab)}
            </div>
          </TabPane>
        ))}
      </TabContent>
    </Container>
  );
};

export default EmployeeFormTabs;
