import { socialIcons } from '../../constant/Constant';
import styles from '../HomePage.module.scss';

const SocialIconsSection=()=>{
    return(
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
    )
}
export default SocialIconsSection