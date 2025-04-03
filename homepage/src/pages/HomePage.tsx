import styles from './HomePage.module.scss';
import QuoteCard from './Hitokoto/QuoteCard'
import WebLinkSection from './components/WebLinkSection'
import Logo from './components/Logo'
import SelfInfoCard from './components/SelfInfoCard'
import SocialIconsSection from './components/socialIconsSection'

const HomePage: React.FC = () => {


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