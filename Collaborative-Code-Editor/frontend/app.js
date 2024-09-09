const editor = CodeMirror(document.getElementById('editor'), {
    lineNumbers: true,
    mode: "javascript",
    theme: "monokai"
});

const socket = io();

const sessionId = prompt('Enter Session ID:'); // Simple session setup
socket.emit('joinSession', sessionId);

socket.on('updateCode', (code) => {
    editor.setValue(code);
});

editor.on('change', () => {
    const code = editor.getValue();
    socket.emit('codeChange', code);
});

document.getElementById('saveVersionBtn').addEventListener('click', () => {
    socket.emit('saveVersion', sessionId);
});

socket.on('versionSaved', (versionId) => {
    alert(`Version ${versionId} saved!`);
});
