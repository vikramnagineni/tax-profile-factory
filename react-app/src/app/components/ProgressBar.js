import React from 'react';
import { Progress } from 'reactstrap';

const ProgressBar = ({ 
  percentage = 0, 
  label = "Progress", 
  showPercentage = true,
  height = "16px",
  backgroundColor = "#e9ecef",
  progressColor = "#28a745",
  textColor = "#495057",
  className = "",
  striped = false,
  animated = false
}) => {
  // Ensure percentage is between 0 and 100
//   const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  const containerStyle = {
    width: '100%'
  };

  const labelStyle = {
    color: textColor,
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <div style={containerStyle} className={className}>
      {/* <div style={labelStyle}>
        <span>{label}</span>
        {showPercentage && (
          <span className="text-muted" style={{ fontSize: '12px' }}>
            {normalizedPercentage}%
          </span>
        )}
      </div> */}
      <Progress 
        value={percentage}
        color={progressColor === '#28a745' ? 'success' : 
               progressColor === '#ffc107' ? 'warning' : 
               progressColor === '#dc3545' ? 'danger' : 
               progressColor === '#17a2b8' ? 'info' : 'primary'}
        striped={striped}
        animated={animated}
        style={{ height: height }}
      >
        {label}
      </Progress>
    </div>
  );
};

export default ProgressBar;
