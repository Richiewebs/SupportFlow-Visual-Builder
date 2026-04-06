import React, { useState } from 'react';
import flowData from '../flow_data.json';
import Editor from './pages/Editor';
import Preview from './pages/Preview';

function App() {
  const [nodes, setNodes] = useState(flowData.nodes);
  const [mode, setMode] = useState('editor'); // 'editor' or 'preview'
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e, nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId) return;
    
    setNodes(nodes.map(node => {
      if (node.id === draggingNodeId) {
        return {
          ...node,
          position: {
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
          }
        };
      }
      return node;
    }));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleNodeTextChange = (id, newText) => {
    setNodes(nodes.map(node => node.id === id ? { ...node, text: newText } : node));
  };

  return (
    <>
      <div className="top-bar">
        <div className="header-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          SupportFlow Builder
        </div>
        <div className="mode-toggle">
          <button 
            className={`mode-btn ${mode === 'editor' ? 'active' : ''}`}
            onClick={() => setMode('editor')}
          >
            Editor
          </button>
          <button 
            className={`mode-btn ${mode === 'preview' ? 'active' : ''}`}
            onClick={() => { setMode('preview'); setSelectedNodeId(null); }}
          >
            Preview
          </button>
        </div>
      </div>

      {mode === 'editor' ? (
        <Editor 
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          handleNodeTextChange={handleNodeTextChange}
          handleDragStart={handleDragStart}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          setSelectedNodeId={setSelectedNodeId}
        />
      ) : (
        <Preview nodes={nodes} />
      )}
    </>
  );
}

export default App;
