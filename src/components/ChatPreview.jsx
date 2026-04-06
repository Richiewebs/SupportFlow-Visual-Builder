import React, { useState, useEffect } from 'react';

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

export default ChatPreview;
