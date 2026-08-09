import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  IconButton,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon
} from '@mui/icons-material';
import { aiService } from '../../services/aiService';

const ChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your KarigarAI assistant. How can I help you today?\nनमस्ते! मैं आपका कारीगर AI सहायक हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
      sender: 'support',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [previousInteractionId, setPreviousInteractionId] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
      alert("Voice input is not supported in this browser. Try Chrome or Edge.");
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
        setNewMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
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
    if (!newMessage.trim() || loading) return;

    const userText = newMessage.trim();
    const currentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      timestamp: currentTimestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      // Call Interactions API through backend service
      const res = await aiService.chatWithAI(userText, previousInteractionId, language);

      // Save stateful interaction ID for the next turn
      if (res.interactionId) {
        setPreviousInteractionId(res.interactionId);
      }

      const botReply = {
        id: Date.now() + 1,
        text: res.text,
        sender: 'support',
        tier: res.tier,
        responseTime: res.responseTime,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      const errorReply = {
        id: Date.now() + 1,
        text: error.message || "Sorry, I ran into an error. Please try again.",
        sender: 'support',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderTierBadge = (tier, responseTime) => {
    if (!tier) return null;
    let label = '🤖 Gemini 3.6';
    let color = 'primary';

    if (tier === 'KB') {
      label = '⚡ Fast Cache';
      color = 'success';
    } else if (tier === 'INTENT') {
      label = '💬 Instant';
      color = 'info';
    }

    return (
      <Tooltip title={`Response time: ${responseTime || 0}ms`}>
        <Chip
          label={label}
          size="small"
          color={color}
          variant="outlined"
          sx={{ height: 18, fontSize: '0.65rem', ml: 1 }}
        />
      </Tooltip>
    );
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
            <Avatar sx={{ bgcolor: 'primary.main' }}>K</Avatar>
            <Box>
              <Typography variant="h6">KarigarAI Support</Typography>
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
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8f9fa' }}>
          <List disablePadding>
            {messages.map((m) => (
              <ListItem
                key={m.id}
                sx={{
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                  p: 0,
                  alignItems: 'flex-start'
                }}
              >
                {m.sender !== 'user' && (
                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                    AI
                  </Avatar>
                )}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    maxWidth: '75%',
                    bgcolor: m.isError ? '#ffebee' : m.sender === 'user' ? 'primary.main' : 'white',
                    color: m.isError ? 'error.main' : m.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: m.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    border: m.sender !== 'user' ? 1 : 0,
                    borderColor: m.isError ? 'error.light' : 'divider'
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                    {m.text}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                      {m.timestamp}
                    </Typography>
                    {m.sender !== 'user' && renderTierBadge(m.tier, m.responseTime)}
                  </Box>
                </Paper>
              </ListItem>
            ))}

            {loading && (
              <ListItem sx={{ p: 0, mb: 1 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                  AI
                </Avatar>
                <Paper sx={{ p: 1.5, bgcolor: 'white', borderRadius: '16px 16px 16px 0', border: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">Thinking...</Typography>
                </Paper>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>

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
              sx={{
                alignSelf: 'flex-end',
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
              }}
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