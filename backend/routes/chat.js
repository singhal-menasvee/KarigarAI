import express from 'express';
import { z } from 'zod';

/* global process */

const router = express.Router();
const schema = z.object({
  message: z.string().trim().min(1).max(4000),
  language: z.enum(['en', 'hi']).default('en'),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) })).max(20).default([]),
});

const instructions = `You are Karigar Sahayak, a practical adviser for Indian artisans.
Help with pricing, profit, costs, marketing, e-commerce, packaging, exports, banking, government schemes, training, cooperatives, and relevant organisations.
- Never invent schemes, eligibility, rates, deadlines, offices, phone numbers, or URLs.
- Search the web for government schemes, laws, tax, loans, grants, deadlines, and organisations. Prefer official Indian government, regulator, and bank sources.
- Give a checked-as-of date for changing facts and cite sources. If a fact cannot be verified, say so; do not guess.
- For profit questions, give an actionable calculation or checklist and label assumptions.
- Ask for state, craft, costs/revenue, or business stage only when it materially changes the answer.
- Recommend professional verification for high-stakes legal, tax, credit, or safety decisions.
- Be concise, respectful, and easy to understand. Reply in the user's language; use simple Devanagari Hindi when appropriate.`;

const send = (res, event) => res.write(`data: ${JSON.stringify(event)}\n\n`);

router.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Please send a valid message.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'The assistant is not configured. Add OPENAI_API_KEY to backend/.env and restart it.' });

  const { message, history, language } = parsed.data;
  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-5.4-mini',
        instructions: `${instructions}\nInterface language: ${language}. Today: ${new Date().toISOString().slice(0, 10)}.`,
        input: [...history, { role: 'user', content: message }],
        tools: [{ type: 'web_search' }],
        tool_choice: 'auto',
        max_output_tokens: 1200,
        stream: true,
      }),
      signal: AbortSignal.timeout(90000),
    });
    if (!upstream.ok) {
      const body = await upstream.json().catch(() => ({}));
      console.error('[chat] OpenAI error:', upstream.status, body.error?.message);
      return res.status(upstream.status === 429 ? 429 : 502).json({ error: body.error?.message || 'The AI provider rejected the request.' });
    }

    res.set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' });
    res.flushHeaders();
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() || '';
      for (const block of blocks) {
        const line = block.split('\n').find((item) => item.startsWith('data: '));
        if (!line || line === 'data: [DONE]') continue;
        try {
          const event = JSON.parse(line.slice(6));
          if (event.type === 'response.output_text.delta') send(res, { type: 'delta', text: event.delta });
          if (event.type === 'response.completed') {
            const annotations = event.response?.output?.flatMap((item) => item.content || []).flatMap((item) => item.annotations || []) || [];
            const sources = annotations.filter((item) => item.type === 'url_citation' && item.url)
              .map(({ title, url }) => ({ title: title || url, url }))
              .filter((source, index, all) => all.findIndex((item) => item.url === source.url) === index).slice(0, 6);
            send(res, { type: 'done', sources });
          }
          if (event.type === 'error' || event.type === 'response.failed') send(res, { type: 'error', error: event.error?.message || 'The response failed.' });
        } catch { /* skip malformed upstream events */ }
      }
    }
    return res.end();
  } catch (error) {
    console.error('[chat] request failed:', error);
    if (res.headersSent) { send(res, { type: 'error', error: 'The connection was interrupted. Please try again.' }); return res.end(); }
    return res.status(502).json({ error: 'The assistant is temporarily unavailable. Please try again.' });
  }
});

export default router;
