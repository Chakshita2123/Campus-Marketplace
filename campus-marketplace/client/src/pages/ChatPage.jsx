import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { chatId } = useParams();
  const { messages, sendMessage } = useChat(chatId);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 my-2 rounded-lg bg-surface">
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 border-t">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-full"
          placeholder="Type a message..."
        />
        <button type="submit" className="px-4 py-2 ml-4 font-bold text-white rounded-full bg-accent">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
