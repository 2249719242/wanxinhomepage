import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Message } from '../types';
import { BASEURL } from '../../../constant/Constant';

const useChatApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    // 尝试从localStorage获取会话ID，如果没有则创建新的
    const savedSessionId = localStorage.getItem('chat_session_id');
    return savedSessionId || `session_${Date.now()}`;
  });
  const backendUrl = BASEURL;

  // 发送文本消息到API
  const sendTextMessageToApi = async (
    text: string,
    addMessage: (message: Message) => void,
    updateMessageContent?: (id: number, content: string) => void,
    setMessageStreaming?: (id: number, isStreaming: boolean) => void
  ) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now(), content: text, type: 'text', sender: 'user' };
    addMessage(userMessage);

    setIsProcessing(true);
    setLoading(true);

    try {
      // 检查是否包含"翻唱歌曲"，如果是则使用普通POST请求
      if (text.includes('翻唱歌曲')) {
        const response = await axios.post(`${backendUrl}/api/chat`, { message: text, session_id: sessionId });

        if (response.data.audioUrl) {
          const audioResponse = await axios.get(response.data.audioUrl, { responseType: 'blob' });
          const audioBlob = new Blob([audioResponse.data], { type: 'audio/wav' });
          const serverMessage: Message = {
            id: Date.now(),
            content: new File([audioBlob], 'audio.wav', { type: 'audio/wav' }),
            type: 'audio',
            sender: 'server',
          };
          addMessage(serverMessage);
        }
      } else {
        // 使用流式传输处理文本响应
        const messageId = Date.now();
        const serverMessage: Message = {
          id: messageId,
          content: '',
          type: 'text',
          sender: 'server',
          isStreaming: true
        };
        addMessage(serverMessage);

        // 创建 EventSource 连接
        //不断地更新响应内容
        const eventSource = new EventSource(`${backendUrl}/api/chat?message=${encodeURIComponent(text)}&session_id=${sessionId}`);
        let fullContent = '';

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.status === 'streaming' && data.content && updateMessageContent) {
              fullContent += data.content;
              updateMessageContent(messageId, fullContent);
            } else if (data.status === 'complete' && data.full_content && updateMessageContent && setMessageStreaming) {
              updateMessageContent(messageId, data.full_content);
              setMessageStreaming(messageId, false);
              eventSource.close();

              // 如果响应中包含会话ID，则保存它
              if (data.session_id) {
                setSessionId(data.session_id);
                localStorage.setItem('chat_session_id', data.session_id);
              }
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('EventSource error:', error);
          eventSource.close();
          if (setMessageStreaming) {
            setMessageStreaming(messageId, false);
          }
          message.error('连接中断');
        };
      }
    } catch (error) {
      message.error('发送失败');
      console.error(error);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // 上传文件到API
  const uploadFileToApi = async (file: File, addMessage: (message: Message) => void) => {
    const formData = new FormData();
    formData.append('file', file);

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
      addMessage(serverMessage);
    } catch (error) {
      message.error('上传失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isProcessing,
    sessionId,
    sendTextMessageToApi,
    uploadFileToApi
  };
};

export default useChatApi;