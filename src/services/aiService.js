import axios from 'axios';
import { findAnswer } from './knowledgeBase';

const API_URL = "/api/hf/v1/chat/completions";
const API_TOKEN = import.meta.env.VITE_HF_TOKEN;
const MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct";

export const aiService = {
    /**
     * Chat with the AI, using KB context if available.
     * @param {string} userMessage - The user's input message.
     * @param {Array} history - Previous message history (optional).
     * @returns {Promise<string>} - The AI's response.
     */
    /**
     * Chat with the AI, using KB context if available.
     * @param {string} userMessage - The user's input message.
     * @param {Array} history - Previous message history (optional).
     * @param {string} language - 'en' or 'hi' (default 'en').
     * @returns {Promise<string>} - The AI's response.
     */
    async chatWithAI(userMessage, history = [], language = 'en') {
        // 1. Check Knowledge Base first (only for English for now, or simple keyword match)
        const kbAnswer = findAnswer(userMessage);
        if (kbAnswer) {
            // In future, we could translate this too. For now, return as is.
            return kbAnswer;
        }

        // 2. Fallback to API
        if (!API_TOKEN) {
            return "⚠️ API Token is missing. Please add VITE_HF_TOKEN to your .env file.";
        }

        try {
            let systemPrompt = "You are a helpful AI assistant for Indian artisans. You help them with banking, selling products, and storytelling. Keep answers simple and encouraging.";

            if (language === 'hi') {
                systemPrompt += " Reply in Hindi (Devanagari script). Keep the language simple and conversational.";
            }

            const messages = [
                { role: "system", content: systemPrompt },
                ...history,
                { role: "user", content: userMessage }
            ];

            const response = await axios.post(
                API_URL,
                {
                    model: MODEL_ID,
                    messages: messages,
                    max_tokens: 350,
                    temperature: 0.7
                },
                {
                    headers: {
                        "Authorization": `Bearer ${API_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("AI API Error:", error);
            if (error.response) {
                return `Error: ${error.response.status} - ${error.response.data.error?.message || "Unknown error"}`;
            }
            return "Sorry, I'm having trouble connecting to the AI server right now. Please try again later.";
        }
    },

    /**
     * Generate a creative story for a product.
     * @param {Object} details - Product details (craft, material, etc.).
     * @param {string} language - 'en' or 'hi' (default 'en').
     * @returns {Promise<string>} - Generated story.
     */
    async generateStory(details, language = 'en') {
        if (!API_TOKEN) {
            return "⚠️ API Token is missing. Please add VITE_HF_TOKEN to your .env file.";
        }

        const { artisanName, craftType, location, materials, inspiration } = details;

        let systemMessage = "You are an expert storyteller for handmade crafts. Write short, emotional, marketing-focused product stories.";

        if (language === 'hi') {
            systemMessage += " Write the story in Hindi (Devanagari script). Use emotional and poetic words suitable for Indian handicrafts.";
        }

        const userPrompt = `Write a story for a handmade product with these details:
    - Artisan: ${artisanName}
    - Craft: ${craftType}
    - Location: ${location}
    - Materials: ${materials}
    - Inspiration: ${inspiration}
    
    The story should highlight the effort, tradition, and cultural value. Keep it under 150 words.`;

        try {
            const response = await axios.post(
                API_URL,
                {
                    model: MODEL_ID,
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: userPrompt }
                    ],
                    max_tokens: 400,
                    temperature: 0.8
                },
                {
                    headers: {
                        "Authorization": `Bearer ${API_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error("Story Generation Error:", error);
            return "Could not generate story automatically. Please check your internet connection or API token.";
        }
    }
};
