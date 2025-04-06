import React from 'react';

const Loading = () => {
   return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-50" style={{ zIndex: 1050 }}>
         <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
         </div>
      </div>
   );
};

export default Loading;
