import { Request, Router } from 'express';
import { omit, get } from 'lodash';
import { compareSync } from 'bcryptjs';
import { Admins, Students, Teachers } from '../../db/model';
import { getRefreshToken, getToken } from '../../utils/token';

const router = Router();

router.post('/login', (req: Request, res) => {
  const { account, password, identity } = req.body;
  if (!account || !password || !identity) {
    return res.status(400).end();
  }
  let promise;
  if (identity === 'student') {
    promise = Students.findByPk(account);
  } else if (identity === 'admin') {
    promise = Admins.findByPk(account);
  } else if (identity === 'teacher') {
    promise = Teachers.findByPk(account);
  } else {
    return res.status(400).end();
  }
  promise.then(data => {
    if (!data) {
      return res.json({
        code: 1,
        msg: '用户不存在',
      });
    }
    let user = data.toJSON();
    if (!compareSync(password, get(user, 'password'))) {
      return res.json({
        code: 2,
        msg: '密码错误',
      });
    }
    // 过滤用户信息
    user = { ...omit(user, 'password'), identity };
    res.json({
      code: 0,
      msg: '登陆成功',
      data: {
        user,
        token: getToken(user), // 修改这里需要同时修改 refresh 中的 token 颁发
        refreshToken: getRefreshToken(user),
      },
    });
  }).catch(e => {
    res.status(500).end(e.message);
  });
});

export default router;
