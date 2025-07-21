import React from 'react';

const AgGridLoader: React.FC = () => {
  return (
    <div className="ag-overlay-panel">
      <div className="ag-overlay-wrapper ag-overlay-loading-wrapper">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mr-3" />
            <span className="text-gray-600 text-sm">Loading data...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgGridLoader;
