import React from "react";
import Link from "next/link";
import { observer } from 'mobx-react-lite';
import { Button, Avatar, Divider } from 'antd';
import { CodeOutlined, FireOutlined, FundOutlined, FundViewOutlined } from '@ant-design/icons';
import ListItem from "components/Listitem";
import { prepareConnection } from 'db/index';
import { User } from 'db/entity/user';
import { Article } from 'db/entity/article';
import styles from './index.module.scss';

export async function getStaticPaths() {
  const db = await prepareConnection();
  const users = await db.getRepository(User).find();
  const userIds = users.map((user) => ({
    params: { id: String(user?.id) }
  }));

  return {
    paths: userIds,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }: { params: any }) {
  const userId = params?.id;
  const db = await prepareConnection();
  const user = await db.getRepository(User).findOne({
    where: {
      id: Number(userId),
    },
  });
  const articles = await db.getRepository(Article).find({
    where: {
      user: {
        id: Number(userId),
      },
    },
    relations: ['user'],
  });

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}

const UserDetail = (props: any) => {
  const { userInfo = {}, articles = [] } = props;
  const viewsCount = articles?.reduce((prev: any, next: any) => prev + next?.views, 0);
  console.log(userInfo)
  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avator} src={userInfo?.avator} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined /> {userInfo?.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined /> {userInfo?.introduce}
            </div>
          </div>
          <Link href="/user/profile">
            <Button>??????????????????</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {articles?.map((article: any) => (
            <div key={article?.id}>
              <ListItem article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>????????????</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundOutlined />
              <span>????????? {articles?.length} ?????????</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>??????????????? {viewsCount} ???</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(UserDetail);