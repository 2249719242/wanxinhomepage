import { useState } from 'react';
import { Message } from '../types';

const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // 添加新消息
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  // 更新消息内容
  const updateMessageContent = (id: number, content: string) => {
    setMessages(prev => prev.map(message =>
      message.id === id && message.sender === 'server' ? { ...message, content } : message
    ));
  };

  // 设置消息的流式状态
  const setMessageStreaming = (id: number, isStreaming: boolean) => {
    setMessages(prev => prev.map(message =>
      message.id === id && message.sender === 'server' ? { ...message, isStreaming } : message
    ));
  };

  return {
    messages,
    addMessage,
    updateMessageContent,
    setMessageStreaming
  };
};

export default useMessages;