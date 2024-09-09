# Its a Demo Code

# Collaborative Code Editor

## Overview

This project is a real-time collaborative code editor allowing up to 20 users to edit, debug, and manage code simultaneously. It includes features like version control, conflict resolution, and real-time communication.

### Technologies Used:

- Frontend: JavaScript, CodeMirror
- Backend: Node.js, Socket.IO, WebRTC
- Database: (Optional, for versioning)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend` directory.
2. Run `npm install` to install all dependencies.
3. Start the server by running `node server.js`.

### 2. Frontend Setup

1. Navigate to the `frontend` directory.
2. Open `index.html` in your browser to launch the editor.
3. Enter a session ID when prompted to start collaborating.

### 3. Project Structure

- `backend/`: Contains the server-side logic.
- `frontend/`: Contains the code for the user interface.

## Features

- **Real-Time Collaboration**: Code syncs across all users.
- **Version Control**: Save and load versions of code.
- **Conflict Resolution**: Handles conflicts when multiple users edit the same file.
