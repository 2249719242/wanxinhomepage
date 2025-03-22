import React from 'react';
import { Input, Button, Upload } from 'antd';
import { SendOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface InputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  sendTextMessage: () => void;
  handleUpload: (file: File) => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  inputText,
  setInputText,
  sendTextMessage,
  handleUpload
}) => {
  return (
    <div className="input-area">
      <TextArea
        rows={4}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="可以发送文本信息进行翻唱（需要网易云音乐中存在的音乐，如:后来 刘若英），或者发送压缩后的视频进行总结..."
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
  );
};

export default InputArea;