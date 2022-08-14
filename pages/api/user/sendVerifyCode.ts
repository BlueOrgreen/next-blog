import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import request from 'service/fetch';
import { ironOptions } from 'config/index';
import { ISession } from '../index';

export default withIronSessionApiRoute(sendVerifyCode, ironOptions)

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { to = '', templateId = '' } = req.body;
  const appId = '8a216da881ad97540182067dbb3b160b';
  const accountId = '8a216da881ad97540182067dba4f1604';
  const authToken = 'bd986a5faf7546a4a62be4c2b6e6dd61';
  const nowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${accountId}${authToken}${nowDate}`);
  const Authorization = encode(`${accountId}:${nowDate}`);
  const verifyCode = Math.floor(Math.random() * 9999 - 1000) + 1000;
  const expireMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  const response = await request.post(url, {
    to,
    templateId,
    appId,
    datas: [
      verifyCode,
      expireMinute,
    ]
  }, {
    headers: {
      Authorization,
    }
  })
  console.log('verifycode', verifyCode);
  console.log('response', response);
  const { statusCode, statusMsg, templateSMS } = response as any;

  if(statusCode === '000000') {
    // @ts-ignore
    session.verifyCode = verifyCode
    await session.save();
    res.status(200).json({
      code: 0,
      msg: statusMsg,
      data: {
        templateSMS
      }
    })
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    })
  }
}