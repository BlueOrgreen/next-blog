import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { navs } from './config';
import style from './index.module.scss'
import Link from 'next/link';
import { useStore } from 'store/index';
import { useRouter } from 'next/router';
import { Button, Avatar, Dropdown, Menu, message } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import Login from '../Login'
import request from 'service/fetch';

const NavBar: React.FC = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const store = useStore();
  const { userId, avator } = store.user.userInfo;
  const { pathname, push } = useRouter();

  const handleGoToEditor = () => {
    if(userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录')
    }
  }

  const handleGoToLogin = () => {
    setIsShow(true);
  }

  // const handleOpenLogin = () => {
  //   setIsShow(true);
  // }

  const handleCloseLogin = () => {
    setIsShow(false);
  }

  const handleToPersonalPage = () => {
    push(`/user/${userId}`)
  }

  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res.code === 0) {
        store.user.setUserInfo({});
      }
    })
  }

  const renderDropDownMenu = () => {
    return <>
      <Menu>
        <Menu.Item onClick={handleToPersonalPage} ><HomeOutlined /> &nbsp; 个人主页</Menu.Item>
        <Menu.Item onClick={handleLogout}><LoginOutlined /> &nbsp; 退出登录</Menu.Item>
      </Menu>
    </>
  }

  return (
    <div className={style.navBar}>
      <section className={style.logArea}>BLOG-C</section>
      <section className={style.linkArea}>
        {
          navs?.map((nav) => {
            return (
              <Link key={nav?.label} href={nav.value}>
                <a className={pathname === nav.value? style.active : ""}>{nav?.label}</a>
              </Link>
            )
          })
        }
      </section>
      <section className={style.operationArea}>
        <Button onClick={handleGoToEditor}>写文章</Button>
        {
          userId ? (
            <>
              <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
                <Avatar src={avator} size={30} />
              </Dropdown>
            </>
          ) : (
            <Button onClick={handleGoToLogin} type='primary'>登录</Button>
          )
        }
      </section>
      {isShow && <Login onClose={handleCloseLogin} />}
    </div>
  )
}

export default observer(NavBar);