import React from 'react';
import EditorNode from '../components/EditorNode';
import FlowLines from '../components/FlowLines';

const Editor = ({ 
  nodes, 
  selectedNodeId, 
  handleNodeTextChange, 
  handleDragStart, 
  handleMouseMove, 
  handleMouseUp,
  setSelectedNodeId
}) => {
  return (
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
  );
};

export default Editor;
