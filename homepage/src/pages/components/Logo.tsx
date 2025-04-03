import styles from '../HomePage.module.scss';

const Logo = function Logo() {
  return (
    <div className={styles.logoSection}>
      <div className={styles.logoCircle}>
        <div className={styles.clockHand}></div>
      </div>
      <div className={styles.logoText}>starmemory2025</div>
    </div>
  )
}
export default Logo