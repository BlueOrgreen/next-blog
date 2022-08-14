import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils/index';
import { ironOptions } from 'config/index';
import { ISession } from '../index';
import { prepareConnection } from 'db/index';
import { User } from 'db/entity/user';
import { UserAuth } from 'db/entity/userauth';

export default withIronSessionApiRoute(login, ironOptions)

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookie = Cookie.fromApiRoute(req, res);
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const db = await prepareConnection();
  
  const userAuthRepo = db.getRepository(UserAuth);
  // const userRepo = db.getRepository(User);
  // const users = await userRepo.find();
  console.log('session.verifyCode', session.verifyCode, String(verify));
  if(String(session.verifyCode) === String(verify)) {
    // 验证码正确 在 user_auths 查找 identity_type 是否有记录
    const userAuth = await userAuthRepo.findOne({
      identity_type,
      identifier: phone,
    }, {
      relations: ['user'],
    });

    if(userAuth) {
      // 已存在用户
      const user = userAuth.user;
      const { id, nickname, avator } = user;
 
      session.userId = id;
      session.nickname = nickname;
      session.avator = avator;
      await session.save();
      setCookie(cookie, { userId: id, nickname, avator })

      res.status(200).json({
        code: 0,
        msg: "登录成功",
        data: { userId: id, nickname, avator }
      })
    } else {
      // 新用户
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 1000)}`;
      user.avator = '/image/avator.jpeg';
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode as string;
      userAuth.user = user;
      const resUserAuth = await userAuthRepo.save(userAuth);
      const { user : { id, nickname, avator } } = resUserAuth;

      session.userId = id;
      session.nickname = nickname;
      session.avator = avator;
      res.status(200).json({
        code: 0,
        msg: "登录成功",
        data: { userId: id, nickname, avator }
      })
    }
  } else {
    res.status(200).json({
      code: -1,
      msg: "验证码错误",
    })
  }
}