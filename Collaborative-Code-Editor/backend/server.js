const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // For versioning
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store the code versions and sessions
let codeVersions = {}; 
let sessions = {};

app.use(express.static(path.join(__dirname, '../frontend')));

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Join a session
    socket.on('joinSession', (sessionId) => {
        if (!sessions[sessionId]) {
            sessions[sessionId] = { users: [], code: '' };
        }
        socket.join(sessionId);
        sessions[sessionId].users.push(socket.id);

        // Send current code state to the newly joined user
        socket.emit('updateCode', sessions[sessionId].code);

        socket.on('codeChange', (newCode) => {
            sessions[sessionId].code = newCode;
            io.to(sessionId).emit('updateCode', newCode);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id);
            sessions[sessionId].users = sessions[sessionId].users.filter(user => user !== socket.id);
        });
    });

    // Version control and conflict resolution (simplified)
    socket.on('saveVersion', (sessionId) => {
        const versionId = uuidv4();
        codeVersions[sessionId] = { ...codeVersions[sessionId], [versionId]: sessions[sessionId].code };
        socket.emit('versionSaved', versionId);
    });

    socket.on('getVersion', (sessionId, versionId) => {
        socket.emit('loadVersion', codeVersions[sessionId][versionId]);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
