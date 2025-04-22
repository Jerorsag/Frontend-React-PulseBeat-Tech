import React from 'react';
import './Chat.scss';

const ChatBubble = ({ id, text, isBot, source, timestamp, feedback, onFeedback }) => {
  // Formatear la hora para mostrar en formato HH:MM
  const formattedTime = timestamp ? 
    timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
    '';
  
  // Determinar la clase CSS según quién envía el mensaje y su fuente
  const bubbleClass = `chat-bubble ${isBot ? 'bot' : 'user'} ${isBot && source ? `source-${source}` : ''}`;

  // Función para convertir enlaces a etiquetas <a>
  const parseLinks = (text) => {
    // Patrones para URLs, correos electrónicos, etc.
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    // Reemplazar URLs con etiquetas <a>
    return text.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  };
  
  // Función para resaltar texto en negrita
  const parseMarkdown = (text) => {
    // Convertir **texto** a <strong>texto</strong>
    let parsedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir URLs a links
    parsedText = parseLinks(parsedText);
    
    return parsedText;
  };

  const handleFeedback = (isPositive) => {
    if (onFeedback && id) {
      onFeedback(id, isPositive);
    }
  };

  return (
    <div className={bubbleClass}>
      {isBot && (
        <div className="avatar">
          <img src="/bot-avatar.png" alt="Bot" />
        </div>
      )}
      <div className="message">
        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} />
        
        {isBot && id && typeof feedback === 'undefined' && (
          <div className="feedback-buttons">
            <button 
              className="feedback-button thumbs-up" 
              onClick={() => handleFeedback(true)}
              aria-label="Feedback positivo"
            >
              👍
            </button>
            <button 
              className="feedback-button thumbs-down" 
              onClick={() => handleFeedback(false)}
              aria-label="Feedback negativo"
            >
              👎
            </button>
          </div>
        )}
        
        {isBot && typeof feedback !== 'undefined' && (
          <div className="feedback-given">
            {feedback ? '👍 Gracias por tu feedback' : '👎 Gracias por tu feedback'}
          </div>
        )}
        
        <div className="timestamp">{formattedTime}</div>
      </div>
    </div>
  );
};

export default ChatBubble;