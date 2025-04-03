import React from 'react';
import { List, Spin } from 'antd';
import { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isProcessing: boolean;
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing, loading }) => {
  return (
    <>
      <List
        className="message-list"
        dataSource={messages}
        renderItem={(msg) => <MessageItem message={msg} />}
      />
      {isProcessing && (
        <div className="processing-message">
          <Spin size="small" />
          <span style={{ marginLeft: '8px' }}>正在处理，请耐心等待...</span>
        </div>
      )}
      {loading && <div className="loading-spinner"><Spin tip="发送中..." /></div>}
    </>
  );
};

export default MessageList;