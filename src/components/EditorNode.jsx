import React, { useRef } from 'react';

const EditorNode = ({ node, isSelected, onSelect, onChange, onDragStart }) => {
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

export default EditorNode;
