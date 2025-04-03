import { useState } from 'react';
import { Card } from 'antd';
import styles from '../HomePage.module.scss';
import WeatherCard from '../weatherCard/WeatherCard';

const SelfInfoCard = function SelfInfoCard() {
  const [cityName, _setCityName] = useState('东京');
  return (
    <div className={styles.infoCards}>
      <Card className={styles.infoCard}>
        <div className={styles.quoteText}>
          <div className={styles.mainText}>原来我需要的只是决心而已， 拼命积累练就的本领绝对不会辜负自己。</div>
          <div className={styles.quoteAuthor}>- 「葬送的芙莉莲」</div>
        </div>
      </Card>
      <WeatherCard CityName={cityName} />
    </div>
  )
}
export default SelfInfoCard;