import React, { useEffect, useRef, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PatientMessages = () => {
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'bot', text: 'Hello! I\'m your virtual assistant. Ask me about symptoms, appointments, billing, pharmacy, or hospital services.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError('');

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to get response');
      }

      const data = await res.json();
      const botText = data?.response || "I'm not sure how to help with that right now.";
      setMessages((prev) => [...prev, { id: `${Date.now()}-bot`, role: 'bot', text: botText }]);
    } catch (e) {
      setError(e.message || 'Chat error');
      setMessages((prev) => [...prev, { id: `${Date.now()}-err`, role: 'bot', text: 'Sorry, I had trouble responding. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Virtual Assistant</h3>
          <p className="mt-1 text-sm text-gray-500">Ask about symptoms, appointments, billing, pharmacy, or hospital services.</p>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3/4 px-4 py-2 rounded-lg shadow ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                <p className="text-sm leading-6 whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 shadow">
                <p className="text-sm">Typing…</p>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <div className="px-4 py-2 text-sm text-red-600 border-t border-gray-200">{error}</div>
        )}

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Type your message..."
              className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:text-blue-500 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMessages;
