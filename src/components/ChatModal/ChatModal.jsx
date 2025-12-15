import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';
import { aiService } from '../../services/aiService';

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
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
  }

  const handleStartListening = () => {
    if (!recognition) {
      alert("Voice input is not supported in this browser. Try Chrome/Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage((prev) => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
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

    let reply = await aiService.chatWithAI(newMessage, [], language);

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
        sx: { borderRadius: 2, height: '600px', display: 'flex', flexDirection: 'column' }
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
            <Box>
              <Typography variant="h6">AI Chat Assistant</Typography>
              <Typography variant="body2" color="text.secondary">
                Ask me anything / पूछें कुछ भी
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" variant="standard" sx={{ minWidth: 80 }}>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disableUnderline
              >
                <MenuItem value="en">🇺🇸 Eng</MenuItem>
                <MenuItem value="hi">🇮🇳 हिंदी</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={onClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* Messages */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f5f5f5' }}>
          <List>
            {messages.map((m) => (
              <ListItem
                key={m.id}
                sx={{
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                  alignItems: 'flex-start'
                }}
              >
                {m.sender !== 'user' && (
                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main', fontSize: '0.8rem' }}>AI</Avatar>
                )}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    maxWidth: '75%',
                    bgcolor: m.sender === 'user' ? 'primary.main' : 'white',
                    color: m.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: m.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    border: m.sender !== 'user' ? 1 : 0,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{m.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1, opacity: 0.7 }}>
                    {m.timestamp}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
            {loading && (
              <ListItem>
                <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">Thinking...</Typography>
                  </Box>
                </Paper>
              </ListItem>
            )}
          </List>
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder={language === 'hi' ? "अपना संदेश टाइप करें..." : "Type your message..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <Tooltip title={isListening ? "Listening..." : "Voice Input"}>
                    <IconButton
                      onClick={handleStartListening}
                      color={isListening ? "error" : "default"}
                      edge="end"
                    >
                      {isListening ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                  </Tooltip>
                )
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              color="primary"
              disabled={!newMessage.trim() || loading}
              sx={{ alignSelf: 'flex-end', bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
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
