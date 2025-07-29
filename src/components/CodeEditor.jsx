
import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

const CodeEditor = ({ 
  documentId, 
  socket, 
  isConnected, 
  onCursorUpdate,
  cursors 
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const yjsDocRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);

  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (yjsDocRef.current) {
        yjsDocRef.current.destroy();
      }
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Initialize Yjs document
    yjsDocRef.current = new Y.Doc();
    
    // Connect to Yjs WebSocket provider
    providerRef.current = new WebsocketProvider(
      'ws://0.0.0.0:5000',
      documentId,
      yjsDocRef.current
    );

    const yText = yjsDocRef.current.getText('monaco');
    
    // Create Monaco binding
    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      providerRef.current.awareness
    );

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      if (socket && isConnected && onCursorUpdate) {
        const position = e.position;
        const selection = editor.getSelection();
        
        onCursorUpdate({
          cursor: {
            lineNumber: position.lineNumber,
            column: position.column
          },
          selection: {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn
          }
        });
      }
    });

    // Set editor theme and options
    monaco.editor.setTheme('vs-dark');
    monaco.editor.defineTheme('modern-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e6edf3',
        'editorCursor.foreground': '#7c3aed',
        'editor.selectionBackground': '#264f78',
        'editor.lineHighlightBackground': '#161b22'
      }
    });
    monaco.editor.setTheme('modern-dark');
  };

  const renderCursors = () => {
    if (!editorRef.current || !monacoRef.current) return null;

    return Array.from(cursors.entries()).map(([userId, data]) => {
      const { cursor, user } = data;
      if (!cursor) return null;

      return (
        <div
          key={userId}
          className="remote-cursor"
          style={{
            position: 'absolute',
            left: `${cursor.column * 7.22}px`,
            top: `${(cursor.lineNumber - 1) * 19}px`,
            backgroundColor: user.color,
            width: '2px',
            height: '19px',
            zIndex: 1000,
            pointerEvents: 'none',
            borderRadius: '1px'
          }}
        >
          <div
            className="cursor-label"
            style={{
              position: 'absolute',
              top: '-24px',
              left: '-4px',
              backgroundColor: user.color,
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            {user.name}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <div className="language-selector">
          <span className="language-label">JavaScript</span>
        </div>
        <div className="editor-actions">
          <button className="action-btn" title="Format Code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Welcome to CollabCode! 🚀\n// Start typing to see real-time collaboration in action.\n\nfunction welcomeMessage() {\n  console.log('Hello, collaborative world! 👋');\n  console.log('Multiple developers can edit this code simultaneously!');\n}\n\n// Try creating a function below:\nfunction yourFunction() {\n  // Your code here...\n}\n\nwelcomeMessage();"
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true }
          }}
        />
        <div className="cursors-overlay">
          {renderCursors()}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
