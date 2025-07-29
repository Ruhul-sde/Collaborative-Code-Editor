import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import UserPanel from './components/UserPanel';
import CodeEditor from './components/CodeEditor';
import StatusBar from './components/StatusBar';
import './App.css';

const COLORS = [
  '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', 
  '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'
];

export default function App() {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser] = useState({
    name: `Developer${Math.floor(Math.random() * 1000)}`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  });
  const [isConnected, setIsConnected] = useState(false);
  const [documentId] = useState('demo-document');
  const [cursors, setCursors] = useState(new Map());
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    // Initialize Socket.io connection
    const newSocket = io('ws://0.0.0.0:5000', {
      transports: ['websocket']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setLastSaved(Date.now());
      // Join the document room
      newSocket.emit('join-document', {
        documentId,
        user: currentUser
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('user-joined', (user) => {
      setUsers(prev => [...prev, user]);
    });

    newSocket.on('current-users', (userList) => {
      setUsers(userList);
    });

    newSocket.on('user-left', ({ userId }) => {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(userId);
        return newCursors;
      });
    });

    newSocket.on('cursor-update', ({ userId, cursor, selection, user }) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.set(userId, { cursor, selection, user });
        return newCursors;
      });
    });

    return () => {
      newSocket.close();
    };
  }, [documentId, currentUser]);

  const handleCursorUpdate = ({ cursor, selection }) => {
    if (socket && isConnected) {
      socket.emit('cursor-update', {
        documentId,
        cursor,
        selection
      });
    }
  };

  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  return (
    <div className="app">
      <Header 
        currentUser={currentUser}
        isConnected={isConnected}
        userCount={users.length + 1}
      />

      <div className="app-body">
        <UserPanel 
          currentUser={currentUser}
          users={users}
          isCollapsed={isPanelCollapsed}
          onToggle={togglePanel}
        />

        <div className="main-content">
          <CodeEditor 
            documentId={documentId}
            socket={socket}
            isConnected={isConnected}
            onCursorUpdate={handleCursorUpdate}
            cursors={cursors}
          />
        </div>
      </div>

      <StatusBar 
        isConnected={isConnected}
        documentId={documentId}
        lastSaved={lastSaved}
      />
    </div>
  );
}