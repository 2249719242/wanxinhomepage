import { createHashRouter } from 'react-router-dom'  // 改用 createHashRouter
import Login from '../pages/Login'
import HomePage from '../pages/HomePage'
import LoginBefore from '../pages/LoginBefore'
import NotFound from '../pages/NotFound'
import ChatPage from '../pages/aichat/ChatPage'
import AuthRoute from './AuthRoute'

const router = createHashRouter([  // 使用 createHashRouter
  {
    path: '/',
    element: <LoginBefore />,
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    path: '/HomePage',
    element: <AuthRoute><HomePage /></AuthRoute>
  },
  {
    path: '/ChatPage',
    element: <AuthRoute><ChatPage /></AuthRoute>
  },
  {
    path: '*',
    element: <NotFound />
  },
])

export const HOME_PATHNAME = '/HomePage'
export const LOGIN_PATHNAME = '/login'
export default router