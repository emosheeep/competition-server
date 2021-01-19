import dayjs from 'dayjs';
import { Router } from 'express';
import { omit } from 'lodash';
import { verify } from 'jsonwebtoken';
import { getUserModel } from '../../db/model';
import secretKey from '../../config/tokenKey';
import { getToken } from '../../utils/token';

const router = Router();

router.get('/refresh', function(req, res) {
  const refreshToken = req.headers.authorization;
  if (!refreshToken) {
    return res.status(403).end();
  }
  verify(refreshToken, secretKey, function(err, payload: any) {
    // token 解析失败，或未携带token
    if (err || !payload) {
      return res.status(403).end();
    }
    const { exp, account, identity } = payload;
    // refreshToken过期，重新登录
    if (dayjs().isAfter(exp)) {
      return res.status(403).end();
    }
    // 否则刷新token
    const UserModel = getUserModel(identity);
    UserModel.findByPk(account).then((user) => {
      if (!user) {
        res.status(403).end();
      } else {
        const result = omit(user, ['password']);
        res.status(200).send(getToken({ identity, ...result }));
      }
    }).catch(e => {
      res.status(500).end(e.message);
    });
  });
});

export default router;
