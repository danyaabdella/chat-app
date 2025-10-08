import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { socket } from '../socket';

const ChatRoom = () => {
  const [username, setUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleInitialMessages = (initialMessages) => {
      setMessages(initialMessages);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('message', handleMessage);
    
    socket.on('initialMessages', handleInitialMessages);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('message', handleMessage);
      socket.off('initialMessages', handleInitialMessages);
    };
  }, []);

  const handleSendMessage = (content) => {
    if (username.trim() && content.trim()) {
      socket.emit('message', { username, content });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Real-Time Chat</h1>
      
      {!username ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter your username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '300px',
              marginBottom: '10px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && usernameInput.trim() && setUsername(usernameInput.trim())}
          />
          <button
            onClick={() => usernameInput.trim() && setUsername(usernameInput.trim())}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px'
          }}>
            <span>Welcome, <strong>{username}</strong>!</span>
            <span style={{ color: isConnected ? 'green' : 'red' }}>
              {isConnected ? '● Online' : '○ Offline'}
            </span>
          </div>
          
          <MessageList messages={messages} currentUsername={username} />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
};

export default ChatRoom;