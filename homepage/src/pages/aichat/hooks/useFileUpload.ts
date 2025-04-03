import { message } from 'antd';
import { Message } from '../types';

const useFileUpload = (addMessage: (message: Message) => void, uploadFileToApi: (file: File, addMessage: (message: Message) => void) => Promise<void>) => {
  // 处理文件上传
  const handleUpload = async (file: File) => {
    // 获取文件扩展名
    const extension = file.name.toLowerCase().split('.').pop() || '';

    // 通过扩展名和MIME类型双重判断
    const fileType = (() => {
      // 视频文件类型
      if (['mp4', 'avi', 'mov', 'wmv'].includes(extension) && file.type.startsWith('video/')) {
        return 'video';
      }
      // 音频文件类型
      if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension) && file.type.startsWith('audio/')) {
        return 'audio';
      }
      // 压缩文件类型
      if (['zip', 'rar', '7z'].includes(extension) &&
        (file.type === 'application/zip' || file.type === 'application/x-zip-compressed')) {
        return 'zip';
      }
      return 'unknown';
    })();

    if (fileType === 'unknown') {
      message.error('不支持的文件类型');
      return;
    }

    const newMessage: Message = { id: Date.now(), content: file, type: fileType, sender: 'user' };
    addMessage(newMessage);

    // 上传文件到API
    await uploadFileToApi(file, addMessage);
  };

  return { handleUpload };
};

export default useFileUpload;