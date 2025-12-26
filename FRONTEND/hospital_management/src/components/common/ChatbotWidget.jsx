import React, { useState, useRef, useEffect } from 'react';
import { Fab, Badge, Tooltip, Paper, Box, Typography, IconButton, Divider, TextField, Button, Chip, Avatar } from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon, MedicalServices } from '@mui/icons-material';
import { chatbotAPI } from '../../services/api';

// Chatbot for basic medical assistance.
// Usage: <ChatbotWidget />

const containerStyle = {
  position: 'fixed',
  right: 24,
  bottom: 24,
  zIndex: 2000,
};

const panelStyle = {
  position: 'fixed',
  right: 24,
  bottom: 96,
  width: 360,
  maxWidth: '90vw',
  height: 460,
  maxHeight: '70vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
};

export default function ChatbotWidget({ role = 'patient' }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[ChatbotWidget] mounted with role=', role);
    }
  }, [role]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm0',
      from: 'bot',
      text:
        'Hi! I\'m your medical assistance helper. Ask me general health questions, symptom care tips, or when to seek care. If this is an emergency, call your local emergency number.',
    },
  ]);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (txt) => {
    const text = (txt ?? input).trim();
    if (!text) return;
    const userMsg = { id: `u-${Date.now()}`, from: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Add a typing indicator for better UX
    const typingIndicatorId = `b-typing-${Date.now()}`;
    const typingMsg = { id: typingIndicatorId, from: 'bot', text: '...' };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      const res = await chatbotAPI.chat(role, text);
      const reply = res?.data?.response;

      if (!reply) {
        throw new Error('Assistant did not provide a reply.');
      }

      const botMsg = { id: `b-${Date.now()}`, from: 'bot', text: reply };
      setMessages((prev) => [...prev.filter((m) => m.id !== typingIndicatorId), botMsg]);
    } catch (e) {
      const errorMsg = { id: `b-error-${Date.now()}`, from: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages((prev) => [...prev.filter((m) => m.id !== typingIndicatorId), errorMsg]);
    } finally {
      if (!open) setUnread((u) => u + 1);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating panel */}
      {open && (
        <Paper elevation={6} sx={panelStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1 }}>
              <MedicalServices fontSize="small" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1">Medical Assistant</Typography>
              <Typography variant="caption" color="text.secondary">
                General info only. Not a substitute for professional advice.
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} aria-label="Close chatbot">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          <Box ref={listRef} sx={{ flex: 1, overflowY: 'auto', p: 1.5, bgcolor: 'background.default' }}>
            {messages.map((m) => (
              <Box key={m.id} sx={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
                <Box
                  sx={{
                    maxWidth: '75%',
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: m.from === 'user' ? 'primary.main' : 'grey.100',
                    color: m.from === 'user' ? 'primary.contrastText' : 'text.primary',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: 14,
                  }}
                >
                  {m.text}
                </Box>
              </Box>
            ))}
          </Box>

          <Divider />
          <Box sx={{ p: 1.25 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <Button variant="contained" endIcon={<SendIcon />} onClick={() => send()}>
                Send
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Floating button */}
      <Box sx={containerStyle}>
        <Tooltip title={open ? 'Close assistant' : 'Ask medical assistant'} placement="left">
          <Badge color="error" badgeContent={unread} invisible={unread === 0} overlap="circular">
            <Fab color="primary" onClick={() => setOpen((v) => !v)} aria-label="Open chatbot" sx={{ width: 64, height: 64 }}>
              <ChatIcon sx={{ fontSize: 32 }} />
            </Fab>
          </Badge>
        </Tooltip>
      </Box>
    </>
  );
}
