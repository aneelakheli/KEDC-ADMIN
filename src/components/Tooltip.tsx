// components/Tooltip.js
import React, { useState } from 'react';

export default function Tooltip({ children, content,className="", position = 'right' }) {
  const [isVisible, setIsVisible] = useState(false);
  const MouseEnter = ()=>{
    console.log("Entered")
    setIsVisible(true)
  }

  const MouseLeft = ()=>{
    console.log("Lft")
    setIsVisible(false)
  }
  let tooltipPosition;
  switch (position) {
    case 'top':
      tooltipPosition = 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      break;
    case 'right':
      tooltipPosition = 'left-full top-full transform ml-2';
      break;
    case 'bottom':
      tooltipPosition = 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      break;
    case 'left':
      tooltipPosition = 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      break;
    default:
      tooltipPosition = 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
  }

  return (
    <div
      className={`relative flex items-center ${className}`}
      onMouseEnter={() => MouseEnter()}
      onMouseLeave={() => MouseLeft()}
    >
      {isVisible && (
        <div className={`absolute z-10 p-2 bg-gray text-black text-sm rounded shadow-lg${tooltipPosition}`}>
          {content}
        </div>
      )}
      {children}
    </div>
  );
}
