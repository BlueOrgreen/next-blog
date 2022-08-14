import type { NextPage } from 'next';
import { prepareConnection } from 'db/index';
import styles from '../styles/Home.module.css';
import { IArticle } from 'pages/api/index';
import { Article } from 'db/entity/article';

interface IProps {
  articles: IArticle[];
}

export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles = await db.getRepository(Article).find({
    relations: ['user'],
  });
  console.log('========>', articles);
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    }
  }
}

const Home: NextPage = (props: IProps) => {
  return (  
    <div className={styles.container}>
     我是首页
    </div>
  )
}

export default Home
