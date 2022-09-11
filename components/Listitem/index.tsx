import Link from 'next/link';
import { IArticle } from "pages/api";
import { Avatar } from 'antd';
import styles from './index.module.scss';
import { formatDistanceToNow } from 'date-fns';
import { markdownToTxt } from 'markdown-to-txt';
import { EyeOutlined } from '@ant-design/icons';

const ListItem = (props: { article: IArticle }) => {
  const { article } = props;
  const { user } = article;
  
  return (
    <Link href={`/article/${article.id}`}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user?.nickname}</span>
            <span className={styles.date}>{formatDistanceToNow(new Date(article?.update_time))}</span>
          </div>
          <h4 className={styles.title}>{article?.title}</h4>
          <p className={styles.content}>{markdownToTxt(article?.content)}</p>
          <div className={styles.statistics}>
            <EyeOutlined />
            <span className={styles.item}>{article?.views}</span>
          </div>
        </div>
        <Avatar src={user?.avator} size={48} />
      </div>
    </Link>
  )
}

export default ListItem;