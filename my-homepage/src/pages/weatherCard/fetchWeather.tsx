// utils/weather.ts
import axios from 'axios';
import { deflate } from 'zlib';

const AMAP_KEY = 'c0bdd96f4ed61b512e0b1dd4eee684e3'; // 替换为实际Key

export interface WeatherData {
  city: string
  temperature: string
  weather: string
  winddirection: string
  windpower: string
  humidity?: string
}

const fetchWeather = async (cityName: string): Promise<WeatherData> => {
  try {
    // Step1: 通过城市名获取adcode（需地理编码API）
    const geoRes = await axios.get(
      `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(cityName)}&key=${AMAP_KEY}`
    );
    const adcode = geoRes.data?.geocodes?.[0]?.adcode;

    // Step2: 获取天气数据
    const weatherRes = await axios.get(
      `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${AMAP_KEY}&extensions=base`
    );

    return {
      city: weatherRes.data?.lives?.[0]?.city,
      temperature: weatherRes.data?.lives?.[0]?.temperature,
      weather: weatherRes.data?.lives?.[0]?.weather,
      winddirection: weatherRes.data?.lives?.[0]?.winddirection,
      windpower: weatherRes.data?.lives?.[0]?.windpower,
      humidity: weatherRes.data?.lives?.[0]?.humidity
    };
  } catch (error) {
    console.error('天气数据获取失败:', error);
    return {} as WeatherData;
  }
};
export default fetchWeather;