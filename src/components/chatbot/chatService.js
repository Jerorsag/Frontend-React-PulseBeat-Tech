import api from "../../api";

export const sendMessage = async (message, sessionId) => {
  try {
    const response = await api.post('/api/chat/', {
      message,
      session_id: sessionId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return {
      response: "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde. 🙇",
      source: "error",
      session_id: sessionId
    };
  }
};

export const sendFeedback = async (messageId, isPositive, sessionId) => {
  try {
    const response = await api.post('/api/chat/', {
      message_id: messageId,
      feedback: isPositive,
      session_id: sessionId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al enviar feedback:', error);
    throw error;
  }
};