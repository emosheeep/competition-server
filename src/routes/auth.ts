import { Request, Response, Router } from 'express';
import { compareSync } from 'bcryptjs';
import { getUserModel } from '@/db/model';
import { sign } from 'jsonwebtoken';
import { tokenKey } from '@/config/config';
import svg from 'svg-captcha';
import dayjs from 'dayjs';

const router = Router();

router.post('/auth/login', async (req: Request, res: Response) => {
  const sysCode: string = req.signedCookies.code;
  const { account, password, identity, code } = req.body;
  if (!account || !password || !identity || !code || !sysCode) {
    return res.json({
      code: 400,
      msg: '参数错误',
    });
  }
  if (code.toLowerCase() !== sysCode.toLowerCase()) {
    return res.json({
      code: 3,
      msg: '验证码有误',
    });
  }
  const UserModel = getUserModel(identity);
  const user = await UserModel.findByPk(account);
  if (!user) {
    return res.json({
      code: 1,
      msg: '用户不存在',
    });
  }
  const passwordHash = user.getDataValue('password');
  if (!compareSync(password, passwordHash)) {
    return res.json({
      code: 2,
      msg: '密码错误',
    });
  }
  const exp = dayjs().add(7, 'day');
  res.cookie('uid', sign({
    account,
    identity,
    exp: exp.valueOf(),
  }, tokenKey), {
    expires: exp.toDate(),
    signed: true,
  });
  res.json({
    code: 200,
    msg: '登陆成功',
  });
});

router.get('/auth/code', async (req: Request, res: Response) => {
  const code = svg.create({ noise: 2, width: 100 });
  res.set('cache-control', 'no-cache');
  res.cookie('code', code.text, { httpOnly: true, signed: true, maxAge: 5 * 60 * 1000 });
  res.json({
    code: 200,
    msg: '获取成功',
    data: code.data,
  });
});

export default router;
