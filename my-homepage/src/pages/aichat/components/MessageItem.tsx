import React from 'react';
import { List, Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  // 渲染消息内容
  const renderMessageContent = (msg: Message) => {
    if (msg.type === 'text') {
      return <span>{msg.content as string}</span>;
    } else if (msg.type === 'audio') {
      const audioUrl = msg.content instanceof File
        ? URL.createObjectURL(msg.content)
        : typeof msg.content === 'string'
          ? msg.content
          : URL.createObjectURL(msg.content as Blob);
      return (
        <div className="audio-message">
          <audio controls src={audioUrl} />
        </div>
      );
    } else if (msg.type === 'video') {
      return <video controls src={URL.createObjectURL(msg.content as File)} width="200" />;
    } else if (msg.type === 'zip') {
      return <a href={URL.createObjectURL(msg.content as File)} download>{(msg.content as File).name}</a>;
    }
    return null;
  };

  return (
    <List.Item className={message.sender === 'user' ? 'user-message' : 'server-message'}>
      <div className="message-content">
        <Avatar
          icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
          className={message.sender === 'user' ? 'user-avatar' : 'server-avatar'}
        />
        <div className="message-bubble">
          {renderMessageContent(message)}
        </div>
      </div>
    </List.Item>
  );
};

export default MessageItem;