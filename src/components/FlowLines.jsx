import React, { useState, useEffect } from 'react';

const FlowLines = ({ nodes }) => {
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

export default FlowLines;