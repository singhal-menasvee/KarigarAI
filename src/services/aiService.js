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
    },

    generateStory: async (formData, language = 'en') => {
      try {
        const response = await fetch('/api/chatbot/story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formData,
            language,
          }),
        });

        if (response.status === 429) {
          throw new Error('Too many requests sent. Please wait 60 seconds.');
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to generate story from server');
        }

        const data = await response.json();
        return data.story;
      } catch (error) {
        console.error('Story AI Service Error, utilizing local fallback:', error);
        
        // Client-side fallback template if server is unreachable
        const { artisanName, craftType, location, materials, techniques, inspiration, experience, productType } = formData || {};
        const name = artisanName || (language === 'hi' ? 'कारीगर' : 'The artisan');
        const craft = craftType || (language === 'hi' ? 'हस्तशिल्प' : 'traditional craft');
        const loc = location || (language === 'hi' ? 'भारत' : 'India');
        const mat = materials || (language === 'hi' ? 'स्थानीय सामग्री' : 'finest materials');
        const tech = techniques || (language === 'hi' ? 'पारंपरिक तकनीक' : 'traditional techniques');
        const insp = inspiration || (language === 'hi' ? 'सांस्कृतिक विरासत' : 'cultural heritage');
        const exp = experience ? `${experience}` : (language === 'hi' ? 'कई' : 'many');
        const prod = productType || (language === 'hi' ? 'कलाकृति' : 'craft pieces');

        if (language === 'hi') {
          return `${loc} से ${name}, ${exp} वर्षों के अनुभव के साथ ${craft} के विशेषज्ञ हैं। ${mat} का उपयोग करके और ${insp} से प्रेरणा लेते हुए, ${name} ${tech} की मदद से सुंदर ${prod} बनाते हैं। प्रत्येक रचना भारत की समृद्ध सांस्कृतिक विरासत की कहानी बयां करती है।`;
        }

        return `Meet ${name}, a dedicated master of ${craft} based in ${loc} with ${exp} years of experience. Working with ${mat} and employing ${tech}, ${name} crafts unique ${prod} that embody rich artistic tradition. Deeply inspired by ${insp}, every creation carries forward the timeless story of Indian heritage and meticulous craftsmanship.`;
      }
    }
  };