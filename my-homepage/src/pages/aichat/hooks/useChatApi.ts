import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Message } from '../types';
import { BASEURL } from '../../../constant/Constant';

const useChatApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const backendUrl = BASEURL;

  // 发送文本消息到API
  const sendTextMessageToApi = async (text: string, addMessage: (message: Message) => void) => {
    if (!text.trim()) return;

    // 添加用户消息
    const userMessage: Message = { id: Date.now(), content: text, type: 'text', sender: 'user' };
    addMessage(userMessage);

    setIsProcessing(true);

    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/chat`, { message: text });

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
        addMessage(serverMessage);
      } else {
        const serverMessage: Message = {
          id: Date.now(),
          content: response.data.reply || '服务器无响应',
          type: 'text',
          sender: 'server',
        };
        addMessage(serverMessage);
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
    sendTextMessageToApi,
    uploadFileToApi
  };
};

export default useChatApi;