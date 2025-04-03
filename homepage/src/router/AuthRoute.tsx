import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  // 从localStorage获取登录状态
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // 如果未登录，重定向到登录页面
  if (!isLoggedIn) {
    return <Navigate to="/Login" replace />;
  }

  // 已登录则渲染子组件
  return <>{children}</>;
};

export default AuthRoute;