import { useState } from 'react';
import Link from 'next/link';
import { Avatar, Input, Button, message, Divider } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';
import MarkDown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { prepareConnection } from 'db/index';
import { Article } from 'db/entity/article';
import { IArticle } from 'pages/api';
import styles from './index.module.scss';
import request from 'service/fetch';

interface IProps {
  article: IArticle;
}

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);

  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: ['user', 'comments']
  })


  if (article) {
    article.views = article?.views + 1;
    await articleRepo.save(article);
  }
  
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const { article } = props;
  const store = useStore();
  const loginUserInfo = store.user.userInfo;
  const {
    user: { nickname, avator, id },
  } = article;
  const [inputVal, setInputVal] = useState('');
  const [comments, setComments] = useState<any>(article.comments || []);
  console.log('article=======>', article);
  
  const handleComment = () => {
    request
      .post('/api/comment/publish', {
        articleId: article?.id,
        content: inputVal,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('ๅ่กจๆๅ');
          const newComments = [
            {
              id: Math.random(),
              create_time: new Date(),
              update_time: new Date(),
              content: inputVal,
              user: {
                avator: loginUserInfo?.avator,
                nickname: loginUserInfo?.nickname,
              },
            },
          ].concat([...(comments as any)]);
          setComments(newComments);
          setInputVal('');
        } else {
          message.error('ๅ่กจๅคฑ่ดฅ');
        }
      });
  };
  console.log('loginUserInfo', loginUserInfo, article);
  
  return (
    <div>
    <div className="content-layout">
      <h2 className={styles.title}>{article?.title}</h2>
      <div className={styles.user}>
        <Avatar src={avator} size={50} />
        <div className={styles.info}>
          <div className={styles.name}>{nickname}</div>
          <div className={styles.date}>
            <div>
              {format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}
            </div>
            <div>้่ฏป {article?.views}</div>
            {Number(loginUserInfo?.userId) === Number(id) && (
              <Link href={`/editor/${article?.id}`}>็ผ่พ</Link>
            )}
          </div>
        </div>
      </div>
      <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
    </div>
    <div className={styles.divider}></div>
    <div className="content-layout">
      <div className={styles.comment}>
        <h3>่ฏ่ฎบ</h3>
        {loginUserInfo?.userId && (
          <div className={styles.enter}>
            <Avatar src={avator} size={40} />
            <div className={styles.content}>
              <Input.TextArea
                placeholder="่ฏท่พๅฅ่ฏ่ฎบ"
                rows={4}
                value={inputVal}
                onChange={(event) => setInputVal(event?.target?.value)}
              />
              <Button type="primary" onClick={handleComment}>
                ๅ่กจ่ฏ่ฎบ
              </Button>
            </div>
          </div>
        )}
        <Divider />
        <div className={styles.display}>
          {comments?.map((comment: any) => (
            <div className={styles.wrapper} key={comment?.id}>
              <Avatar src={comment?.user?.avator || avator} size={40} />
              <div className={styles.info}>
                <div className={styles.name}>
                  <div>{comment?.user?.nickname}</div>
                  <div className={styles.date}>
                    {format(
                      new Date(comment?.update_time),
                      'yyyy-MM-dd hh:mm:ss'
                    )}
                  </div>
                </div>
                <div className={styles.content}>{comment?.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default observer(ArticleDetail);