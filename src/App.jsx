import React, { useState, useEffect, useRef } from 'react';
import flowData from '../flow_data.json';

const EditorNode = ({ node, isSelected, onSelect, onChange, onDragStart, onDrag, onDragEnd }) => {
  const nodeRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.tagName.toLowerCase() === 'input') return; // Don't drag if clicking input
    onSelect(node.id);
    onDragStart(e, node.id);
  };

  return (
    <div
      ref={nodeRef}
      className={`node-card ${isSelected ? 'selected' : ''}`}
      style={{ left: node.position.x, top: node.position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className={`node-type-badge node-type-${node.type}`}>{node.type} node</div>
      
      {isSelected ? (
        <input 
          autoFocus
          className="node-text-input" 
          value={node.text}
          onChange={(e) => onChange(node.id, e.target.value)}
        />
      ) : (
        <div className="node-text">{node.text}</div>
      )}

      {node.options && node.options.length > 0 && (
        <div className="node-options">
          {node.options.map((opt, i) => (
            <div key={i} className="node-option" data-source-id={node.id} data-target-id={opt.nextId}>
              <span>{opt.label}</span>
              <span className="option-target">→ {opt.nextId}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FlowLines = ({ nodes }) => {
  // We need to calculate paths from each node's options to target nodes
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    const newLines = [];
    nodes.forEach(node => {
      if (!node.options) return;
      
      const sourceX = node.position.x + 280; // Right edge of source node (card width is 280)
      const sourceY = node.position.y + 100; // rough middle
      
      node.options.forEach(opt => {
        const targetNode = nodes.find(n => n.id === opt.nextId);
        if (targetNode) {
          const targetX = targetNode.position.x; // Left edge of target node
          const targetY = targetNode.position.y + 40; // rough top middle
          
          // Bezier curve path
          const path = `M ${sourceX} ${sourceY} C ${sourceX + 100} ${sourceY}, ${targetX - 100} ${targetY}, ${targetX} ${targetY}`;
          newLines.push({ id: `${node.id}-${opt.nextId}`, path });
        }
      });
    });
    setLines(newLines);
  }, [nodes]);

  return (
    <svg className="svg-layer">
      {lines.map(line => (
        <path key={line.id} className="line-path" d={line.path} />
      ))}
    </svg>
  );
};

const ChatPreview = ({ nodes }) => {
  const [history, setHistory] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);

  useEffect(() => {
    const startNode = nodes.find(n => n.type === 'start') || nodes[0];
    setCurrentNode(startNode);
    setHistory([{ type: 'bot', text: startNode.text }]);
  }, [nodes]);

  const handleOptionClick = (option) => {
    const nextNode = nodes.find(n => n.id === option.nextId);
    
    setHistory(prev => [
      ...prev, 
      { type: 'user', text: option.label }
    ]);

    setTimeout(() => {
      if (nextNode) {
        setHistory(prev => [
          ...prev, 
          { type: 'bot', text: nextNode.text }
        ]);
        setCurrentNode(nextNode);
      }
    }, 400); // Simulate bot typing delay
  };

  const handleRestart = () => {
    const startNode = nodes.find(n => n.type === 'start') || nodes[0];
    setCurrentNode(startNode);
    setHistory([{ type: 'bot', text: startNode.text }]);
  };

  if (!currentNode) return null;

  return (
    <div className="preview-container">
      <div className="chat-header">SupportFlow Bot</div>
      
      <div className="chat-history">
        {history.map((msg, i) => (
          <div key={i} className={`chat-bubble chat-${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-options">
        {currentNode.options && currentNode.options.length > 0 ? (
          currentNode.options.map((opt, i) => (
            <button key={i} className="chat-option-btn" onClick={() => handleOptionClick(opt)}>
              {opt.label}
            </button>
          ))
        ) : (
          <button className="chat-restart-btn" onClick={handleRestart}>
            ↺ Restart Conversation
          </button>
        )}
      </div>
    </div>
  );
};

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
        <div 
          className="canvas-container"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={(e) => {
            // Deselect if clicking on empty canvas
            if (e.target.classList.contains('canvas-container') || e.target.classList.contains('svg-layer')) {
              setSelectedNodeId(null);
            }
          }}
        >
          <FlowLines nodes={nodes} />
          
          {nodes.map(node => (
            <EditorNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={setSelectedNodeId}
              onChange={handleNodeTextChange}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      ) : (
        <ChatPreview nodes={nodes} />
      )}
    </>
  );
}

export default App;
