import React, { useState, useEffect } from 'react';
import { Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  GithubOutlined,
  CalendarOutlined,
  MailOutlined,
  XOutlined,
  QuestionCircleOutlined,
  WeiboOutlined,
  CloudOutlined,
  CustomerServiceOutlined,
  FireOutlined,
  LinkOutlined,
  AppstoreOutlined,
  BilibiliOutlined,
  TwitchOutlined
} from '@ant-design/icons';
import styles from './HomePage.module.scss';
// import fetchWeather, { WeatherData } from './weatherCard/fetchWeather';
import WeatherCard from './weatherCard/WeatherCard';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // 添加 useNavigate hook
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cityName, setCityName] = useState('东京');

  const [quote] = useState({
    text: 'Hello, World!',
    subText: '一个游离于互联网边缘的小站'
  });

  // 网址导航数据
  const webLinks = [
    { title: 'b站', icon: <BilibiliOutlined />, url: 'https://weibo.com' },
    { title: '网盘', icon: <CloudOutlined />, url: 'https://pan.baidu.com' },
    { title: '音乐', icon: <CustomerServiceOutlined />, url: 'https://music.163.com' },
    { title: '起始页', icon: <LinkOutlined />, url: 'https://www.baidu.com' },
    { title: '网址集', icon: <AppstoreOutlined />, url: 'https://hao.360.com' },
    { title: '今日热榜', icon: <FireOutlined />, url: 'https://tophub.today' },
    { title: 'AI Summary', icon: <TwitchOutlined />, url: '/ChatPage', isInternal: true }  // 添加 isInternal 标记
  ];

  // 社交图标导航
  const socialIcons = [
    { icon: <GithubOutlined />, url: 'https://github.com' },
    { icon: <CalendarOutlined />, url: '#' },
    { icon: <MailOutlined />, url: 'https://accounts.google.com' },
    { icon: <XOutlined />, url: 'https://twitter.com' },
    { icon: <QuestionCircleOutlined />, url: '#' }
  ];

  return (
    <div className={styles.homepageContainer}>
      <div className={styles.contentWrapper}>
        {/* Logo和标题区域 */}
        <div className={styles.logoSection}>
          <div className={styles.logoCircle}>
            <div className={styles.clockHand}></div>
          </div>
          <div className={styles.logoText}>starmemory2025</div>
        </div>

        {/* 个人信息卡片 */}
        <div className={styles.infoCards}>
          <Card className={styles.infoCard}>
            <div className={styles.quoteText}>
              <div className={styles.mainText}>原来我需要的只是决心而已， 拼命积累练就的本领绝对不会辜负自己。</div>
              <div className={styles.quoteAuthor}>- 「葬送的芙莉莲」</div>
            </div>
          </Card>
          <WeatherCard CityName={cityName} />
        </div>

        {/* 引言区域 */}
        <Card className={styles.quoteCard}>
          <div className={styles.quoteContent}>
            <div className={styles.quoteMarks}>"</div>
            <div>{quote.text}</div>
            <div>{quote.subText}</div>
            <div className={styles.quoteMarksEnd}>"</div>
          </div>
        </Card>

        {/* 网址导航区域 */}
        <div className={styles.webLinksSection}>
          {webLinks.map((link, index) => (
            <Card 
              key={index} 
              className={styles.webLinkItem} 
              onClick={() => {
                if (link.isInternal) {
                  navigate(link.url);  // 内部路由使用 navigate
                } else {
                  window.open(link.url, '_blank');  // 外部链接使用 window.open
                }
              }}
            >
              <div className={styles.webLinkIcon}>{link.icon}</div>
              <div className={styles.webLinkTitle}>{link.title}</div>
            </Card>
          ))}
        </div>

        {/* 社交图标导航 */}
        <div className={styles.socialIconsSection}>
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* 页脚 */}
        <div className={styles.footer}>
          Copyright © 2024 aLei & Made by Wanxin
        </div>
      </div>
    </div>
  );
};

export default HomePage;