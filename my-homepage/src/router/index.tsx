import { createHashRouter } from 'react-router-dom'  // 改用 createHashRouter
import Login from '../pages/Login'
import HomePage from '../pages/HomePage'
import LoginBefore from '../pages/LoginBefore'
import NotFound from '../pages/NotFound'
import ChatPage from '../pages/aichat/ChatPage'

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
    element: <HomePage />
  },
  {
    path: '/ChatPage',
    element: <ChatPage />
  },
  {
    path: '*',
    element: <NotFound />
  },
])

export const HOME_PATHNAME = '/HomePage'
export const LOGIN_PATHNAME = '/login'
export default router