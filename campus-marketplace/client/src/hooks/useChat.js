import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io('http://localhost:5000', {
        auth: {
            token
        }
    });

    socketRef.current.on('connect', () => {
      console.log('connected to chat server');
      socketRef.current.emit('join_chat', chatId);
    });

    socketRef.current.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId, token]);

  const sendMessage = (text) => {
    socketRef.current.emit('send_message', { chatId, text });
  };

  return { messages, sendMessage };
};
