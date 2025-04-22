import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import ChatSuggestion from './ChatSuggestion';
import { sendMessage, sendFeedback } from './chatService';
import './Chat.scss';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 'welcome',
      text: '¡Hola! 👋 Soy el asistente virtual de PulseBeat Tech. ¿En qué puedo ayudarte hoy?', 
      isBot: true,
      source: 'predefined',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [suggestions, setSuggestions] = useState([
    '¿Qué productos tienen?',
    '¿Cuáles son las categorías?',
    '¿Hay ofertas disponibles?',
    'Necesito ayuda con mi compra'
  ]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true);
  const messagesEndRef = useRef(null);

  // Generar un ID de sesión al cargar el componente
  useEffect(() => {
    const storedSessionId = localStorage.getItem('pb_chat_session_id');
    const newSessionId = storedSessionId || Math.random().toString(36).substring(2, 15);
    
    if (!storedSessionId) {
      localStorage.setItem('pb_chat_session_id', newSessionId);
    }
    
    setSessionId(newSessionId);
  }, []);

  // Desplazar al final cuando se añaden nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Si se abre el chat, hacer scroll al final
    if (!isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  };

  const toggleSuggestions = () => {
    setIsSuggestionsVisible(!isSuggestionsVisible);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessage = {
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Llamar al servicio de chat
      const response = await sendMessage(inputValue, sessionId);
      
      // Añadir respuesta del bot
      const botMessage = {
        id: response.message_id || `msg-${Date.now()}`,
        text: response.response,
        isBot: true,
        source: response.source || 'predefined',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Establecer sugerencias si existen
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
        setIsSuggestionsVisible(true); // Mostrar automáticamente si hay nuevas sugerencias
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mensaje de error
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde. 🙇",
        isBot: true,
        source: 'error',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // Enviar automáticamente la sugerencia
    setTimeout(() => {
      const button = document.querySelector('.chat-input-container button[type="submit"]');
      if (button) button.click();
    }, 100);
  };
  
  const handleFeedback = async (messageId, isPositive) => {
    try {
      // Solo si el mensaje tiene un ID válido del servidor
      if (messageId && !messageId.startsWith('msg-') && !messageId.startsWith('error-')) {
        await sendFeedback(messageId, isPositive, sessionId);
      }
      
      // Actualizar estado local independientemente de si se envió al servidor
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, feedback: isPositive } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error al enviar feedback:', error);
    }
  };

  return (
    <div className="chat-container">
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        {isOpen ? (
          <span className="close-icon">×</span>
        ) : (
          <>
            <img src="/chat-icon.png" alt="" className="chat-icon" />
            <span className="chat-label">¿Necesitas ayuda? 🤔</span>
          </>
        )}
      </button>
      
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-brand">
              <img src="/vite.svg" alt="PulseBeat Tech" className="chat-logo" />
              <h3>PulseBeat Tech</h3>
            </div>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <ChatBubble 
                key={index}
                id={message.id}
                text={message.text}
                isBot={message.isBot}
                source={message.source}
                timestamp={message.timestamp}
                feedback={message.feedback}
                onFeedback={handleFeedback}
              />
            ))}
            
            {isLoading && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {suggestions.length > 0 && (
            <div className="suggestions-wrapper">
              <div className="suggestions-tab" onClick={toggleSuggestions}>
                <span>{isSuggestionsVisible ? 'Ocultar sugerencias' : 'Mostrar sugerencias'}</span>
                <i className={`suggestions-arrow ${isSuggestionsVisible ? 'up' : 'down'}`}></i>
              </div>
              
              <div className={`suggestions-container ${isSuggestionsVisible ? 'visible' : 'hidden'}`}>
                {suggestions.map((suggestion, index) => (
                  <ChatSuggestion 
                    key={index}
                    text={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
              </div>
            </div>
          )}
          
          <form className="chat-input-container" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Escribe tu mensaje aquí..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()}>
              <i className="send-icon">➤</i>
            </button>
          </form>
          
          <div className="chat-footer">
            <span>Powered by PulseBeat Tech</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;