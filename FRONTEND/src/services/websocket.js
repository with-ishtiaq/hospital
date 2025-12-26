class WebSocketService {
  constructor() {
    this.socket = null;
    this.callbacks = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000; // 3 seconds
    this.isConnected = false;
  }

  connect = (token) => {
    if (this.socket) {
      this.disconnect();
    }

    // Create WebSocket connection with JWT token
    this.socket = new WebSocket(`ws://localhost:5000/ws?token=${token}`);

    // Connection opened
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
    };

    // Listen for messages
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, data } = message;
        
        // Call all registered callbacks for this message type
        if (this.callbacks.has(type)) {
          this.callbacks.get(type).forEach(callback => {
            try {
              callback(data);
            } catch (error) {
              console.error(`Error in WebSocket callback for ${type}:`, error);
            }
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    // Handle connection close
    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      this.isConnected = false;
      this.handleReconnect();
    };

    // Handle errors
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  };

  handleReconnect = () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          this.connect(token);
        }
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  };

  // Subscribe to a specific message type
  subscribe = (messageType, callback) => {
    if (!this.callbacks.has(messageType)) {
      this.callbacks.set(messageType, new Set());
    }
    this.callbacks.get(messageType).add(callback);

    // Return unsubscribe function
    return () => {
      if (this.callbacks.has(messageType)) {
        const callbacks = this.callbacks.get(messageType);
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.callbacks.delete(messageType);
        }
      }
    };
  };

  // Send a message through the WebSocket
  send = (type, data = {}) => {
    if (this.socket && this.isConnected) {
      try {
        const message = JSON.stringify({ type, data });
        this.socket.send(message);
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not connected. Message not sent:', type);
    }
  };
}

// Create a singleton instance
export const webSocketService = new WebSocketService();

// Export the class for testing purposes
export { WebSocketService };
