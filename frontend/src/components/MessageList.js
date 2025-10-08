import React from 'react';

const MessageList = ({ messages, currentUsername }) => {
  return (
    <div style={{
      height: '500px',
      overflowY: 'auto',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '10px',
      backgroundColor: 'white',
      marginBottom: '10px'
    }}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            marginBottom: '10px',
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: message.username === currentUsername ? '#e3f2fd' : '#f5f5f5',
            marginLeft: message.username === currentUsername ? '20%' : '0',
            marginRight: message.username === currentUsername ? '0' : '20%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <strong>{message.username}</strong>
            <span style={{ fontSize: '0.8em', color: '#666' }}>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div>{message.content}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;