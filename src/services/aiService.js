import axios from 'axios';
import { findAnswer } from './knowledgeBase';

const API_URL = "/api/hf/v1/chat/completions";
const API_TOKEN = import.meta.env.VITE_HF_TOKEN;
const MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct";

export const aiService = {
    async chatWithAI(userMessage, history = [], language = 'en') {
        const kbAnswer = findAnswer(userMessage);
        if (kbAnswer) {
            return kbAnswer;
        }

        if (!API_TOKEN) {
            return "The API token is missing. Please ensure VITE_HF_TOKEN is correctly set in your environment configuration.";
        }

        try {
            let systemPrompt = "You are a helpful assistant for Indian artisans, assisting with banking queries, product sales, and storytelling. Please keep your responses clear and supportive.";

            if (language === 'hi') {
                systemPrompt += " Please reply in Hindi using the Devanagari script, keeping the language simple and conversational.";
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
                return `We encountered an issue: ${error.response.status} - ${error.response.data.error?.message || "An unknown error occurred."}`;
            }
            return "I am unable to connect to the server at the moment. Please try again in a little while.";
        }
    },

    async generateStory(details, language = 'en') {
        if (!API_TOKEN) {
            return "The API token is missing. Please ensure VITE_HF_TOKEN is correctly set in your environment configuration.";
        }

        const { artisanName, craftType, location, materials, inspiration } = details;

        let systemMessage = "You are an expert storyteller for handmade crafts. Please create short, emotionally engaging stories suitable for marketing.";

        if (language === 'hi') {
            systemMessage += " Please write the story in Hindi using the Devanagari script, utilizing emotional and poetic language suitable for Indian handicrafts.";
        }

        const userPrompt = `Write a story for a handmade product with these details:
    - Artisan: ${artisanName}
    - Craft: ${craftType}
    - Location: ${location}
    - Materials: ${materials}
    - Inspiration: ${inspiration}
    
    The story should highlight the effort, tradition, and cultural value. Please keep it under 150 words.`;

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
            return "I could not generate the story automatically. Please check your internet connection and try again.";
        }
    }
};
