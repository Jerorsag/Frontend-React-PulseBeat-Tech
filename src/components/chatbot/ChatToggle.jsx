import React from 'react';
import './Chat.scss';

const ChatToggle = ({ isOpen, onClick }) => {
  return (
    <button 
      className={`chat-toggle ${isOpen ? 'open' : ''}`} 
      onClick={onClick}
      aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
    >
      {isOpen ? (
        <span className="close-icon">×</span>
      ) : (
        <>
          <img src="/chat-icon.png" alt="" className="chat-icon" />
          <span className="chat-label">¿Necesitas ayuda? 🤔</span>
          <span className="pulse-animation"></span>
        </>
      )}
    </button>
  );
};

export default ChatToggle;