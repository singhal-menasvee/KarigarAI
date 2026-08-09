export const aiService = {
    chatWithAI: async (message, previousInteractionId = null, language) => {
      try {
        const response = await fetch('/api/chatbot/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            previousInteractionId,
            language,
          }),
        });
  
        if (response.status === 429) {
          throw new Error('Too many messages sent. Please wait 60 seconds.');
        }
  
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to get response');
        }
  
        const data = await response.json();
        return {
          text: data.reply,
          interactionId: data.interactionId || null,
          tier: data.tier,
          responseTime: data.responseTime,
        };
      } catch (error) {
        console.error('Chat AI Service Error:', error);
        throw error;
      }
    }
  };