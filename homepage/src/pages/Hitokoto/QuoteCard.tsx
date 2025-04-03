import { useState, useEffect } from 'react';
import fetchHitokoto, { HitokotoData } from './fetchHitokoto';
import styles from '../HomePage.module.scss';
import { Card } from 'antd';

const QuoteCard = () => {
  const [quoteData, setQuoteData] = useState<HitokotoData | null>(null);

  useEffect(() => {
    const loadQuote = async () => {
      const data = await fetchHitokoto();
      setQuoteData(data);
    };

    // 初始加载
    loadQuote();

    // 每小时刷新（3600000ms）
    const timer = setInterval(loadQuote, 3600000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className={styles.quoteCard}>
      <div className={styles.quoteContent}>
        <div className={styles.quoteMarks}>"</div>
        {quoteData ? (
          <>
            <div className={styles.mainText}>{quoteData.hitokoto}</div>
            <div className={styles.quoteAuthor}>- {quoteData.from}</div>
          </>
        ) : (
          <div className={styles.loading}>正在加载箴言...</div>
        )}
        <div className={styles.quoteMarksEnd}>"</div>
      </div>
    </Card>

  );
};
export default QuoteCard;