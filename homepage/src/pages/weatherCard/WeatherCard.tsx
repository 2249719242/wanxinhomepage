import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import styles from '../HomePage.module.scss';
import fetchWeather, { WeatherData } from './fetchWeather';

interface WeatherDardProps {
  CityName: string;
}

const WeatherCard: React.FC<WeatherDardProps> = ({CityName}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData>({
    city: '',
    temperature: '',
    weather: '',
    winddirection: '',
    windpower: '',
  });
  useEffect(() => {
    // 初始化天气数据
    const initWeather = async () => {
      const data = await fetchWeather(CityName); // 可动态传入不同城市
      setWeatherData(data);
    };
    initWeather();

    // 定时更新（每30分钟）
    const timer = setInterval(initWeather, 1800000);
    return () => clearInterval(timer);
  }, []);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 格式化时间
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];
    return `${year} 年 ${month} 月 ${day} 日 ${weekday}`;
  };

  return (
        // {/* 天气 */}
          <Card className={styles.infoCard}>
            <div className={styles.dateTimeInfo}>
              <div className={styles.dateInfo}>{formatDate(currentTime)}</div>
              <div className={styles.timeInfo}>{formatTime(currentTime)}</div>
              {weatherData.city ? (
                <div className={styles.weatherInfo}>
                  {CityName}  {weatherData.weather}  温度{weatherData.temperature}°C  {weatherData.winddirection}风  {weatherData.windpower}级
                  {weatherData.humidity && `  湿度${weatherData.humidity}%`}
                </div>
              ) : (
                <div className={styles.loading}>天气数据加载中...</div>
              )}
            </div>
          </Card>
  );
};

export default WeatherCard;