
import React from 'react';

const Header = ({ currentUser, isConnected, userCount }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1>CollabCode</h1>
        <span className="tagline">Real-time collaborative coding</span>
      </div>
      
      <div className="header-right">
        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {isConnected ? `${userCount} online` : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="current-user">
          <div 
            className="user-avatar" 
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.name[0]}
          </div>
          <span className="user-name">{currentUser.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
