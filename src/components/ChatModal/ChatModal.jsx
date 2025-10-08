import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';

const knowledgeBase = [
  { q: "kyc", a: "KYC means Know Your Customer — banks use it to verify identity." },
  { q: "open account", a: "You can open an account online or at a branch with KYC documents." },
  { q: "interest rate", a: "Savings accounts earn 3.5% annual interest currently." },
  { q: "credit card", a: "You can apply for a credit card from your bank's portal once KYC is done." },
];

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B";
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN; 

const ChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'support',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const searchKnowledge = (query) => {
    const text = query.toLowerCase();
    for (const item of knowledgeBase) {
      if (text.includes(item.q)) return item.a;
    }
    return null;
  };

  const askModel = async (query) => {
    try {
      const res = await axios.post(
        HF_API_URL,
        { inputs: query },
        { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
      );
      return res.data?.[0]?.generated_text || "Sorry, I’m not sure about that.";
    } catch (e) {
      return "⚠️ There was an issue contacting the AI model.";
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    let reply = searchKnowledge(newMessage);
    if (!reply) reply = await askModel(newMessage);

    const botReply = {
      id: messages.length + 2,
      text: reply,
      sender: 'support',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, botReply]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, height: '600px', display: 'flex', flexDirection: 'column' },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
            <Box>
              <Typography variant="h6">AI Chat Assistant</Typography>
              <Typography variant="body2" color="text.secondary">
                Ask me anything or about your project
              </Typography>
            </Box>
          </Box>
          <Button onClick={onClose} color="inherit">
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* Messages */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
          <List>
            {messages.map((m) => (
              <ListItem
                key={m.id}
                sx={{
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: m.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: m.sender === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <ListItemText
                    primary={m.text}
                    secondary={
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {m.timestamp}
                      </Typography>
                    }
                  />
                </Paper>
              </ListItem>
            ))}
            {loading && (
              <ListItem>
                <Paper sx={{ p: 2, bgcolor: 'grey.100', color: 'text.primary' }}>
                  <Typography variant="body2">Typing...</Typography>
                </Paper>
              </ListItem>
            )}
          </List>
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
            />
            <IconButton
              onClick={handleSendMessage}
              color="primary"
              disabled={!newMessage.trim() || loading}
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
