
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Y = require('yjs');
const { setupWSConnection } = require('y-websocket/bin/utils');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active documents and user sessions
const documents = new Map();
const userSessions = new Map();
const connectedUsers = new Map();

// User management
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining a document
  socket.on('join-document', ({ documentId, user }) => {
    console.log(`User ${user.name} joining document ${documentId}`);
    
    // Store user session
    const userWithId = { ...user, id: socket.id };
    userSessions.set(socket.id, { user: userWithId, documentId });
    
    // Join the document room
    socket.join(documentId);
    
    // Initialize document users set if not exists
    if (!connectedUsers.has(documentId)) {
      connectedUsers.set(documentId, new Map());
    }
    
    const documentUsers = connectedUsers.get(documentId);
    documentUsers.set(socket.id, userWithId);
    
    // Send current users to the new user
    const currentUsers = Array.from(documentUsers.values()).filter(u => u.id !== socket.id);
    socket.emit('current-users', currentUsers);
    
    // Notify other users about the new user
    socket.to(documentId).emit('user-joined', userWithId);
    
    console.log(`Document ${documentId} now has ${documentUsers.size} users`);
  });

  // Handle cursor updates
  socket.on('cursor-update', ({ documentId, cursor, selection }) => {
    const userSession = userSessions.get(socket.id);
    if (userSession) {
      socket.to(documentId).emit('cursor-update', {
        userId: socket.id,
        cursor,
        selection,
        user: userSession.user
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const userSession = userSessions.get(socket.id);
    if (userSession) {
      const { documentId } = userSession;
      
      // Remove user from document
      const documentUsers = connectedUsers.get(documentId);
      if (documentUsers) {
        documentUsers.delete(socket.id);
        socket.to(documentId).emit('user-left', { userId: socket.id });
        
        // Clean up empty document user lists
        if (documentUsers.size === 0) {
          connectedUsers.delete(documentId);
        }
      }
      
      userSessions.delete(socket.id);
    }
  });
});

// Yjs WebSocket server for document synchronization
server.on('upgrade', (request, socket, head) => {
  // Handle Yjs WebSocket connections
  setupWSConnection(socket, request);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Collaborative Code Editor Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time collaboration`);
});
