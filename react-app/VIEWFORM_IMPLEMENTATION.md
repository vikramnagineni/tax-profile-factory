# ViewForm Functionality Implementation

## Overview

This document describes the implementation of the `viewForm` functionality in the React app, equivalent to the Angular `ng-click="$ctrl.viewForm(form)"` functionality.

## Angular Implementation Analysis

In the Angular app, the `viewForm` function:

1. **Location**: `angular-app/app/components/formslist/formslist.controller.js` (line 152-156)
2. **Functionality**: 
   ```javascript
   ctrl.viewForm = function(form) {
       var testforms = [];
       testforms.push(form);
       FormViewerService.setFormsToFill(testforms, ctrl.loadFormsList, true);		
   };
   ```
3. **Purpose**: Opens a form viewer modal to display and edit a specific form
4. **Parameters**: 
   - `form`: The form object to be viewed
   - `ctrl.loadFormsList`: Callback function to refresh forms list after viewing
   - `true`: Submission mode (editable)

## React Implementation

### 1. FormViewerService (`react-app/src/app/services/FormViewerService.js`)

**Purpose**: React equivalent of Angular's FormViewerService
- Manages form viewing state using React patterns
- Provides hooks for components to subscribe to state changes
- Maintains singleton pattern for global state management

**Key Methods**:
- `setFormsToFill(forms, callback, submissionMode)`: Sets forms to be viewed
- `useFormViewerService()`: React hook for components to access service

### 2. FormViewer Component (`react-app/src/app/components/FormViewer.js`)

**Purpose**: Modal component that displays forms for viewing/editing
- Watches FormViewerService for forms to display
- Handles form navigation (next/previous for multiple forms)
- Manages form submission and progress
- Provides form wizard functionality

**Key Features**:
- Modal-based form display
- Progress tracking for multiple forms
- Form submission simulation
- Responsive design with Bootstrap components

### 3. Integration in EmployeeForms (`react-app/src/app/components/EmployeeForms.js`)

**Changes Made**:
1. **Imports**: Added FormViewer component and FormViewerService
2. **Handlers**: 
   ```javascript
   const handleViewForm = (forms) => {
       FormViewerService.setFormsToFill(forms, () => {
           console.log('Form viewing completed');
       }, true);
   };
   ```
3. **MainCtrl**: Added `onViewForm` and `onViewFormWizard` callbacks
4. **JSX**: Added `<FormViewer mainCtrl={mainCtrl} />` component

### 4. EmployeeFormsList Integration

**Existing Implementation**: The `handleViewForm` function was already correctly implemented:
```javascript
const handleViewForm = (form) => {
    if (onViewForm) {
        onViewForm([form]);
    }
};
```

**Usage**: Connected to form links in the JSX:
```jsx
<button
    className="btn btn-link text-primary p-0 text-left font-weight-bold"
    onClick={() => handleViewForm(form)}
>
    {form.rpttitle}
</button>
```

## Flow Comparison

### Angular Flow:
1. User clicks form link with `ng-click="$ctrl.viewForm(form)"`
2. `viewForm()` creates array with single form
3. Calls `FormViewerService.setFormsToFill()`
4. FormViewer component watches service and opens modal
5. User interacts with form, submits or closes
6. Callback (`ctrl.loadFormsList`) refreshes the forms list

### React Flow:
1. User clicks form button with `onClick={() => handleViewForm(form)}`
2. `handleViewForm()` calls `onViewForm([form])`
3. `onViewForm` handler calls `FormViewerService.setFormsToFill()`
4. FormViewer component (via `useFormViewerService` hook) detects change
5. Modal opens automatically with form content
6. User interacts with form, submits or closes
7. Callback function can refresh forms list

## Key Differences

1. **State Management**: 
   - Angular: Service with direct property watching
   - React: Hook-based state management with listeners

2. **Component Communication**:
   - Angular: Direct service injection and `$scope.$watch`
   - React: Props and callbacks with hook subscriptions

3. **Modal Management**:
   - Angular: UI-Bootstrap modal service
   - React: Reactstrap Modal component with state

## Testing

A test file has been created at `react-app/src/app/test/FormViewer.test.js` to verify:
- Component renders without errors
- Service integration works correctly
- Form viewing flow matches Angular behavior

## Usage

To use the viewForm functionality:

1. **In a component**: Call the `onViewForm` prop with an array of forms
2. **Example**:
   ```jsx
   <button onClick={() => onViewForm([formObject])}>
       View Form
   </button>
   ```

The implementation maintains full compatibility with the Angular version while using React best practices and patterns.
