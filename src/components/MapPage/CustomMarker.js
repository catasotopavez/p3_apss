import React from 'react';
import './customMarker.css'


const CustomMarker = () => {
    const divStyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '18px',
        height: '18px',
        backgroundColor: '#000',
        border: '2px solid #fff',
        borderRadius: '100%',
        userSelect: 'none',
        transform: 'translate(-50%, -50%)',
      };
      
      // Inside your JSX component:
  return (
    <div className='pin2'></div>

    
  );
};

export default CustomMarker;
