import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography } from 'antd'
import styles from './LoginBefore.module.scss'
import { LOGIN_PATHNAME } from '../router'

const { Title, Paragraph } = Typography
const Home: FC = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Title >starmemory | Homepage</Title>
        <Paragraph>
          一个简洁的个人主页
        </Paragraph>
        <Button type='primary' onClick={() => navigate(LOGIN_PATHNAME)}>
          开始登录
        </Button>
      </div>
    </div>
  )
}

export default Home