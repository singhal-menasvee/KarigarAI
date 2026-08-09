import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Fuse from 'fuse.js';
import { GoogleGenAI } from '@google/genai';

// Resolve directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Knowledge Base JSON
const kbPath = path.join(__dirname, '../data/knowledge-base.json');
const knowledgeBase = JSON.parse(readFileSync(kbPath, 'utf-8'));

// Initialize Gemini SDK (reads GEMINI_API_KEY from environment)
const ai = new GoogleGenAI({});

// Tier 1: Fuse.js KB Matcher
const kbFuse = new Fuse(knowledgeBase.features, {
  keys: ['keywords', 'question'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
});

// Tier 2: Fuse.js Intent Matcher
const intentArray = Object.entries(knowledgeBase.intents).map(([id, data]) => ({
  id,
  ...data
}));

const intentFuse = new Fuse(intentArray, {
  keys: ['patterns'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
});

const isHindiMessage = (msg) => {
  const matches = msg.match(/[\u0900-\u097F]/g) || [];
  return matches.length > msg.length / 6;
};

// Tier 3: Call Gemini Interactions API SDK
const callGeminiInteractions = async (message, previousInteractionId) => {
  const systemInstruction = `You are KarigarAI Support Assistant. Help artisans and buyers with the KarigarAI platform. Be concise (max 100 words). If asked about payments, checkout, or order tracking, state clearly that these features are coming soon.`;

  const payload = {
    model: 'gemini-3.6-flash',
    input: message,
    system_instruction: systemInstruction,
  };

  // Attach previous interaction ID for stateful server-side context caching
  if (previousInteractionId) {
    payload.previous_interaction_id = previousInteractionId;
  }

  const interaction = await ai.interactions.create(payload);

  return {
    text: interaction.output_text || 'Sorry, I could not generate a response.',
    interactionId: interaction.id
  };
};

export const handleChat = async (req, res) => {
  const startTime = performance.now();
  const { message, previousInteractionId, language='en' } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message exceeds 500 character limit' });
  }

  const normalized = message.toLowerCase().trim();
  const forceHindi = language === 'hi' || isHindiMessage(normalized);

  try {
    // TIER 1: Fuzzy KB Lookup (<25ms)
    const kbMatch = kbFuse.search(normalized);
    if (kbMatch.length > 0 && kbMatch[0].score < 0.4) {
      const feature = kbMatch[0].item;
      const reply =
        isHindiMessage(normalized) && feature.hindi_answer
          ? feature.hindi_answer
          : feature.answer;

      return res.json({
        reply,
        tier: 'KB',
        responseTime: parseFloat((performance.now() - startTime).toFixed(2))
      });
    }

    // TIER 2: Fuzzy Intent Match (<20ms)
    const intentMatch = intentFuse.search(normalized);
    if (intentMatch.length > 0 && intentMatch[0].score < 0.4) {
      const responses = intentMatch[0].item.responses;
      const reply = responses[Math.floor(Math.random() * responses.length)];

      return res.json({
        reply,
        tier: 'INTENT',
        responseTime: parseFloat((performance.now() - startTime).toFixed(2))
      });
    }

    // TIER 3: LLM Fallback (Gemini Interactions API)
    if (process.env.GEMINI_API_KEY) {
      try {
        const result = await callGeminiInteractions(message, previousInteractionId);

        return res.json({
          reply: result.text,
          interactionId: result.interactionId,
          tier: 'LLM',
          responseTime: parseFloat((performance.now() - startTime).toFixed(2))
        });
      } catch (err) {
        console.error('[Chatbot Error] Gemini Interactions API Failed:', err.message);
        return res.json({
          reply: "I'm having trouble connecting right now. Please try asking again.",
          tier: 'LLM_ERROR',
          responseTime: parseFloat((performance.now() - startTime).toFixed(2))
        });
      }
    } else {
      return res.json({
        reply: "GEMINI_API_KEY is missing from backend environment variables.",
        tier: 'CONFIG_ERROR',
        responseTime: parseFloat((performance.now() - startTime).toFixed(2))
      });
    }
  } catch (error) {
    console.error('[Chatbot Controller Error]:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};