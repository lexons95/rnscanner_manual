import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

import { AuthContext } from '../utils/AuthContext';
import { useTenantsQuery } from '../utils/ApolloAPI';

const Login = (props) => {
  const [state, {signIn}] = useContext(AuthContext);

  const [form] = Form.useForm();

  const defaultValues = {
    username: 'zxc@hotmail.com',
    password: 'password'
  }

  const onSubmit = () => {
    signIn(form.getFieldsValue())
  };

  return (
    <div className="base-page loginContainer">
      <div className="loginForm">
        <Form form={form} onFinish={onSubmit} initialValues={defaultValues}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input type="password" />
          </Form.Item>
          <Form.Item>
            <Button onClick={()=>{form.submit()}}>Login</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login;