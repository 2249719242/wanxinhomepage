import { useState } from 'react';
import { Message } from '../types';

const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // 添加新消息到列表
  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    messages,
    addMessage
  };
};

export default useMessages;