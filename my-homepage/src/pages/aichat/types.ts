export interface Message {
  id: number;
  content: string | File;
  type: 'text' | 'audio' | 'video' | 'zip';
  sender: 'user' | 'server';
  isStreaming?: boolean;
}