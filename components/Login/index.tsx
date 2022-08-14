import React from 'react';
import { ChangeEvent, useState } from 'react';
import { message } from 'antd';
import { observer } from 'mobx-react-lite';
import request from 'service/fetch';
import styles from './index.module.scss';
import CountDown from '../CountDown';
import { useStore } from 'store/index';

interface LoginProps {
  // onOpen: () => void;
  onClose: () => void;
} 

const Login: React.FC<LoginProps>= (props) => {
  const store = useStore();
  const { onClose } = props;
  const [isShowVerifyCode, setIsShowVerifyCode] = useState<boolean>(false)
  const [form, setForm] = useState<Record<string, any>>({
    phone: '',
    verify: '',
  })
  
  const handleClose = () => {
    onClose();
  }

  const handleLogin = () => {
    request.post('/api/user/login', {
      ...form,
      identity_type: 'phone'
    }).then((res: any) => {
      if(res.code === 0) {
        // 登录成功
        store.user.setUserInfo(res.data)
        console.log('set store user', store)
        onClose();
      } else {
        message.error(res.msg || '未知错误')
      }
    })
  }

  const handleOAutGithubLogin = () => {
    const githubClientID = '7f4baee64f58b2b092fb';
    const redirectUri = 'http://localhost:3000/api/oauth/redirect';
    window.open(`https://github.com/login/oauth/authorize?client_id=${githubClientID}&redirect_uri=${redirectUri}`)
  }

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  }

  const handleGetVerifyCode = () => {
    // setIsShowVerifyCode(true);
    if(!form.phone) {
      message.warning('请输入手机号');
      return;
    }
    request.post('/api/user/sendVerifyCode', {
      to: form?.phone,
      templateId: 1
    }).then((res: any) => {
      if(res.code === 0) {
        setIsShowVerifyCode(true);
      } else {
        message.error(res.msg || '未知错误')
      }
    })
  }

  return (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>x</div>
        </div>
        <input type="text" name='phone' placeholder='请输入手机号' value={form.phone} onChange={handleFormChange} />
        <div className={styles.verifyCodeArea}>
          <input type="text" name='verify' placeholder='请输入验证码' value={form.verify} onChange={handleFormChange} />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>{isShowVerifyCode ? <CountDown time={10} onEnd={handleCountDownEnd} /> : '获取验证码'}</span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAutGithubLogin}>
          使用Github登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a href="https://moco.imooc.com/privacy.html" target='_blank' rel="noreferrer">隐私政策</a>
        </div>
      </div>
    </div>
  )
}

export default observer(Login);