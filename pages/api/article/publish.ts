import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from '../index';
import { prepareConnection } from 'db/index';
import { User } from 'db/entity/user';
import { UserAuth } from 'db/entity/userauth';
import { Article } from 'db/entity/article';

export default withIronSessionApiRoute(publish, ironOptions)

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = '', content = '' } = req.body;
  const db = await prepareConnection();
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);

  const user = await userRepo.findOne({
    where: {
      id: session.userId
    }
  });
  console.log('11111111', user)
  const article = new Article();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;
  
  if(user) {
    article.user = user
  }
  console.log('222222222222', article)
  // console.log('3333333333', articleRepo)
  const resArticle = await articleRepo.save(article);
  console.log('444444444', resArticle)
  if (resArticle) {
    res.status(200).json({ data: resArticle, code: 0, msg: '发布成功' })
  } else {
    res.status(200).json({ msg: '发布失败', code: 9999 })
  }
}