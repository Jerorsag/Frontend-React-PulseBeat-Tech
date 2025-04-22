import React from 'react';
import './Chat.scss';

const ChatSuggestion = ({ text, onClick }) => {
  return (
    <button 
      className="suggestion-button"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ChatSuggestion;