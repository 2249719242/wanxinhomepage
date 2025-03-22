import React, { useState } from 'react';
import { Input, Button, List, Upload, message, Spin, Avatar } from 'antd';
import { SendOutlined, UploadOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import axios from 'axios';
import './ChatPage.css';

const { TextArea } = Input;

interface Message {
  id: number;
  content: string | File;
  type: 'text' | 'audio' | 'video' | 'zip';
  sender: 'user' | 'server';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const backendUrl = 'https://marmoset-frank-quickly.ngrok-free.app/';

  // 发送文本消息
  const sendTextMessage = async () => {
    if (!inputText.trim()) return;
    const newMessage: Message = { id: Date.now(), content: inputText, type: 'text', sender: 'user' };
    setMessages([...messages, newMessage]);
    setInputText('');
    setIsProcessing(true); // 添加处理状态

    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/chat`, { message: inputText });

      // 处理服务器返回的音频文件
      if (response.data.audioUrl) {
        const audioResponse = await axios.get(response.data.audioUrl, { responseType: 'blob' });
        const audioBlob = new Blob([audioResponse.data], { type: 'audio/wav' });
        const serverMessage: Message = {
          id: Date.now(),
          content: new File([audioBlob], 'audio.wav', { type: 'audio/wav' }),
          type: 'audio',
          sender: 'server',
        };
        setMessages((prev) => [...prev, serverMessage]);
      } else {
        const serverMessage: Message = {
          id: Date.now(),
          content: response.data.reply || '服务器无响应',
          type: 'text',
          sender: 'server',
        };
        setMessages((prev) => [...prev, serverMessage]);
      }
    } catch (error) {
      message.error('发送失败');
      console.error(error);
    } finally {
      setLoading(false);
      setIsProcessing(false); // 清除处理状态
    }
  };

  // 处理文件上传
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const fileType = file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('audio/')
        ? 'audio'
        : file.type === 'application/zip'
          ? 'zip'
          : 'unknown';

    if (fileType === 'unknown') {
      message.error('不支持的文件类型');
      return;
    }

    const newMessage: Message = { id: Date.now(), content: file, type: fileType, sender: 'user' };
    setMessages([...messages, newMessage]);

    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const serverMessage: Message = {
        id: Date.now(),
        content: response.data.message || '文件已接收',
        type: 'text',
        sender: 'server',
      };
      setMessages((prev) => [...prev, serverMessage]);
    } catch (error) {
      message.error('上传失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="chat-container">
      <h2>聊天室</h2>
      <List
        className="message-list"
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item className={msg.sender === 'user' ? 'user-message' : 'server-message'}>
            <div className="message-content">
              <Avatar
                icon={msg.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                className={msg.sender === 'user' ? 'user-avatar' : 'server-avatar'}
              />
              <div className="message-bubble">
                {renderMessageContent(msg)}
              </div>
            </div>
          </List.Item>
        )}
      />
      {isProcessing && (
        <div className="processing-message">
          <Spin size="small" />
          <span style={{ marginLeft: '8px' }}>正在处理，请耐心等待...</span>
        </div>
      )}
      {loading && <div className="loading-spinner"><Spin tip="发送中..." /></div>}
      <div className="input-area">
        <TextArea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="可以发送文本信息进行翻唱，或者发送压缩后的视频进行总结..."
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              sendTextMessage();
            }
          }}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={sendTextMessage} style={{ marginTop: 8 }}>
          发送
        </Button>
        <Upload
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} style={{ marginTop: 8, marginLeft: 8 }}>
            上传文件
          </Button>
        </Upload>
      </div>
    </div>
  );
};

export default ChatPage;