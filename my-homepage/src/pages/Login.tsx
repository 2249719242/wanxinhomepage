import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './LoginForm.module.css';
import { useNavigate } from 'react-router-dom';

// 定义表单数据类型
interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();

  // 自定义的唯一账号和密码
  const correctUsername = 'star';
  const correctPassword = 'a135034822B+';
  const nav=useNavigate()
  // 表单提交处理
  const onFinish = (values: LoginFormValues) => {
    const { username, password } = values;

    // 校验账号和密码
    if (username === correctUsername && password === correctPassword) {
      message.success('登录成功！欢迎，' + username);
      nav('/HomePage')
    } else {
      message.error('账号或密码错误！');
    }
  };

  // 表单提交失败处理
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('请填写正确的账号和密码！');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>登录</h2>
        <Form
          form={form}
          name="login_form"
          initialValues={{ username: '', password: '' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/* 账号输入框 */}
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入账号！' },
              { whitespace: true, message: '账号不能包含空格！' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入账号"
              size="large"
            />
          </Form.Item>

          {/* 密码输入框 */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { whitespace: true, message: '密码不能包含空格！' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;