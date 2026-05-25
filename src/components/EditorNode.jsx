import React, { useRef } from 'react';

const EditorNode = ({
  node,
  isSelected,
  onSelect,
  onChange,
  onOptionLabelChange,
  onDragStart,
  addNode,
  deleteNode
}) => {
  const nodeRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.tagName.toLowerCase() === 'input' || e.target.closest('.node-controls')) return;
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
              {isSelected ? (
                <input
                  className="option-label-input"
                  value={opt.label}
                  onChange={(e) => onOptionLabelChange(node.id, i, e.target.value)}
                  placeholder="Edit option"
                />
              ) : (
                <span>{opt.label}</span>
              )}
              <span className="option-target">→ {opt.nextId}</span>
            </div>
          ))}
        </div>
      )}

      {isSelected && (
        <div className="node-controls">
          <button className="control-btn add-btn" onClick={() => addNode(node.id)} title="Add child node">+</button>
          {node.id !== 'start' &&
            <button className="control-btn delete-btn" onClick={() => deleteNode(node.id)} title="Delete node">-</button>
          }
        </div>
      )}
    </div>
  );
};

export default EditorNode;
