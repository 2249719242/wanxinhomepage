// utils/hitokoto.ts
export interface HitokotoData {
  hitokoto: string;
  from: string;
  type: string;
}

const fetchHitokoto = async (): Promise<HitokotoData> => {
  try {
    const response = await fetch('https://v1.hitokoto.cn/?c=a&c=j');
    const data = await response.json();
    return {
      hitokoto: data.hitokoto,
      from: data.from || '未知来源',
      type: data.type
    };
  } catch (error) {
    console.error('获取一言失败:', error);
    return {
      hitokoto: '数据加载失败，请尝试刷新',
      from: '系统提示',
      type: 'error'
    };
  }
};
export default fetchHitokoto;