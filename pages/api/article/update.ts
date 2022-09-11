import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { prepareConnection } from 'db/index';
import { Article } from 'db/entity/article';
import { EXCEPTION_ARTICLE } from 'pages/api/config/codes';

export default withIronSessionApiRoute(update, ironOptions)

async function update(req: NextApiRequest, res: NextApiResponse) {
  const { id = 0, title = '', content = '' } = req.body;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);

  const article = await articleRepo.findOne({
    where: {
      id,
    },
    relations: ['user'],
  });

  if(article) {
    article.title = title;
    article.content = content;
    // article.create_time = new Date();
    article.update_time = new Date();

    const resArticle = await articleRepo.save(article);
    if (resArticle) {
      res.status(200).json({ data: resArticle, code: 0, msg: '更新成功' });
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED });
    }
  }
}