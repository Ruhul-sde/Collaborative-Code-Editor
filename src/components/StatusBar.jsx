
import React from 'react';

const StatusBar = ({ isConnected, documentId, lastSaved }) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <div className="indicator-dot"></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="document-info">
          <span>Document: {documentId}</span>
        </div>
      </div>
      
      <div className="status-right">
        <div className="save-status">
          {lastSaved && (
            <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
