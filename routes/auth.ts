import { Request, Response, Router } from 'express';
import { compareSync } from 'bcryptjs';
import { getUserModel } from '../db/model';
import { sign } from 'jsonwebtoken';
import secretKey from '../config/tokenKey';
import dayjs from 'dayjs';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { account, password, identity } = req.body;
  if (!account || !password || !identity) {
    return res.json({
      code: 400,
      msg: '参数错误',
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
  }, secretKey), {
    expires: exp.toDate(),
  });
  res.json({
    code: 200,
    msg: '登陆成功',
  });
});

export default router;
