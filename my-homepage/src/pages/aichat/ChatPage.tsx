import React, { useState } from 'react';
import './ChatPage.css';

// 导入自定义组件
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';

// 导入自定义钩子
import useMessages from './hooks/useMessages';
import useChatApi from './hooks/useChatApi';
import useFileUpload from './hooks/useFileUpload';

const ChatPage: React.FC = () => {
  // 使用自定义钩子管理状态和逻辑
  const { messages, addMessage } = useMessages();
  const { loading, isProcessing, sendTextMessageToApi, uploadFileToApi } = useChatApi();
  const { handleUpload } = useFileUpload(addMessage, uploadFileToApi);

  // 本地状态
  const [inputText, setInputText] = useState<string>('');

  // 发送文本消息
  const sendTextMessage = async () => {
    if (!inputText.trim()) return;
    await sendTextMessageToApi(inputText, addMessage);
    setInputText('');
  };

  return (
    <div className="chat-container">
      <h2>聊天室</h2>
      <MessageList
        messages={messages}
        isProcessing={isProcessing}
        loading={loading}
      />
      <InputArea
        inputText={inputText}
        setInputText={setInputText}
        sendTextMessage={sendTextMessage}
        handleUpload={handleUpload}
      />
    </div>
  );
};

export default ChatPage;