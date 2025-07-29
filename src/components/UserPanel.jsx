
import React from 'react';

const UserPanel = ({ currentUser, users, isCollapsed, onToggle }) => {
  const totalUsers = users.length + 1;

  return (
    <div className={`users-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="panel-header">
        <div className="panel-title">
          <div className="users-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4H4zM10 18v-4h3v4h-3zM16 18v-4h3v4h-3zM4 12V8h3v4H4zM10 12V8h3v4h-3zM16 12V8h3v4h-3z"/>
            </svg>
          </div>
          <h3>Active Users</h3>
          <span className="user-count">{totalUsers}</span>
        </div>
        <button 
          className="toggle-btn"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <div className="user-list">
          <div className="user-item current-user">
            <div 
              className="user-avatar" 
              style={{ backgroundColor: currentUser.color }}
            >
              {currentUser.name[0]}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-badge">You</span>
            </div>
            <div className="user-status online"></div>
          </div>
          
          {users.map(user => (
            <div key={user.id} className="user-item">
              <div 
                className="user-avatar" 
                style={{ backgroundColor: user.color }}
              >
                {user.name[0]}
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
              </div>
              <div className="user-status online"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPanel;
