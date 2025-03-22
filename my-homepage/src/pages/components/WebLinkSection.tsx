import { webLinks } from '../../constant/Constant'
import styles from '../HomePage.module.scss';
import { Card } from 'antd';


import { useNavigate } from 'react-router-dom';
const WebLinkSection = () => {
  const navigate = useNavigate();
  return (
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
  )
}

export default WebLinkSection;
