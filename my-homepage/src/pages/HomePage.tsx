import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.scss';
import QuoteCard from './Hitokoto/QuoteCard'
import WebLinkSection from './components/WebLinkSection'
import Logo from './components/Logo'
import SelfInfoCard from './components/SelfInfoCard'
import SocialIconsSection from './components/socialIconsSection'

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // 添加 useNavigate hook
  const [cityName, setCityName] = useState('东京');

  const [quote] = useState({
    text: 'Hello, World!',
    subText: '一个游离于互联网边缘的小站'
  });

  return (
    <div className={styles.homepageContainer}>
      <div className={styles.contentWrapper}>
        {/* Logo和标题区域 */}
        <Logo />
        {/* 个人信息卡片 */}
        <SelfInfoCard />
        {/* 引言区域 */}
        <QuoteCard />
        {/* 网址导航区域 */}
        <WebLinkSection />
        {/* 社交图标导航 */}
        <SocialIconsSection />
        {/* 页脚 */}
        <div className={styles.footer}>
          Copyright © 2024 aLei & Made by Wanxin
        </div>
      </div>
    </div>
  );
};

export default HomePage;