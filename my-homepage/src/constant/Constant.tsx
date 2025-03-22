import {
  GithubOutlined,
  CalendarOutlined,
  MailOutlined,
  XOutlined,
  QuestionCircleOutlined,
  CloudOutlined,
  CustomerServiceOutlined,
  FireOutlined,
  LinkOutlined,
  AppstoreOutlined,
  BilibiliOutlined,
  TwitchOutlined
} from '@ant-design/icons';

export const webLinks = [
  { title: 'b站', icon: <BilibiliOutlined />, url: 'https://weibo.com' },
  { title: '网盘', icon: <CloudOutlined />, url: 'https://pan.baidu.com' },
  { title: '音乐', icon: <CustomerServiceOutlined />, url: 'https://music.163.com' },
  { title: '起始页', icon: <LinkOutlined />, url: 'https://www.baidu.com' },
  { title: '网址集', icon: <AppstoreOutlined />, url: 'https://hao.360.com' },
  { title: '今日热榜', icon: <FireOutlined />, url: 'https://tophub.today' },
  { title: 'AI Summary', icon: <TwitchOutlined />, url: '/ChatPage', isInternal: true }  // 添加 isInternal 标记
];

// 社交图标导航
export const socialIcons = [
  { icon: <GithubOutlined />, url: 'https://github.com' },
  { icon: <CalendarOutlined />, url: '#' },
  { icon: <MailOutlined />, url: 'https://accounts.google.com' },
  { icon: <XOutlined />, url: 'https://twitter.com' },
  { icon: <QuestionCircleOutlined />, url: '#' }
];


export const BASEURL = 'https://marmoset-frank-quickly.ngrok-free.app/'
export const MAPURL = 'c0bdd96f4ed61b512e0b1dd4eee684e3'