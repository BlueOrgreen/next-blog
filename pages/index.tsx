import { prepareConnection } from 'db/index';
import styles from '../styles/Home.module.css';
import { IArticle } from 'pages/api/index';
import { Article } from 'db/entity/article';
import ListItem from 'components/Listitem';
import { Divider } from 'antd';

interface IProps {
  articles: IArticle[];
}

export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles = await db.getRepository(Article).find({
    relations: ['user'],
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    }
  }
}


const Home = (props: IProps) => {
  const { articles } = props;
  
  return (  
    <div className='content-layout'>
     {articles.map((item) => {
      return <>
        <ListItem article={item} key={item.id} />
        <Divider />
      </>
     })}
    </div>
  )
}

export default Home
