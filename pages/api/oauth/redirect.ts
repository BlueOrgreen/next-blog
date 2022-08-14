import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils/index';
import request from 'service/fetch';
import { ironOptions } from 'config/index';
import { ISession } from '../index';
import { prepareConnection } from 'db/index';
import { User } from 'db/entity/user';
import { UserAuth } from 'db/entity/userauth';

export default withIronSessionApiRoute(redirect, ironOptions)
// `Client ID` 7f4baee64f58b2b092fb

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  // http://localhost:3000/api/oauth/redirect?code=xxx
  const cookie = Cookie.fromApiRoute(req, res);
  const db = await prepareConnection();
  const { code } = req.query;
  const githubClientID = '7f4baee64f58b2b092fb';
  const githubClientSecret = '5feae6192337357cebbb16bf3efe9e5168449021';
  const url = 'https://github.com/login/oauth/access_token?' +
  `client_id=${githubClientID}&` +
  `client_secret=${githubClientSecret}&` +
  `code=${code}`;


  const result = await request.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    }
  );


  const { access_token } = result as any;

  const githubUserInfo = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`
    }
  })

  const userAuth = await db.getRepository(UserAuth).findOne({
    identity_type: 'github',
    identifier: githubClientID,
  }, {
    relations: ['user']
  });


  if(userAuth) {
    // 之前登录过的用户, 直接从user获取用户信息, 并且更新credential为最新的token
    const user = userAuth.user;
    const { id, nickname, avator } = user;

    userAuth.credential = access_token;
    session.userId = id;
    session.nickname = nickname;
    session.avator = avator;
    
    res.writeHead(302, {
      Location: '/'
    });
  } else {
    // 创建新用户 在 user和user_auth都进行插入
    const { login = '', avator_url = '' } = githubUserInfo as any;
    const user = new User();
    user.nickname = login;
    user.avator = avator_url;

    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = githubClientID;
    userAuth.credential = access_token;
    userAuth.user = user;

    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);


    const { id, nickname, avator } = resUserAuth.user;
    session.userId = id;
    session.nickname = nickname;
    session.avator = avator;

    await session.save();
    setCookie(cookie, { userId: id, nickname, avator });
    res.writeHead(302, {
      Location: '/'
    });
  }
}