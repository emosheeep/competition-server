import dayjs from 'dayjs';
import { set } from 'lodash';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import secretKey from '../config/tokenKey';

export default function(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.uid;
  if (typeof token !== 'string') {
    return res.json({
      code: 403,
      msg: '拒绝访问',
    });
  }
  verify(token, secretKey, function(err, payload: any) {
    if (err) {
      return res.json({
        code: 403,
        msg: '拒绝访问',
      });
    }
    const { exp, ...user } = payload;
    if (dayjs().isAfter(exp)) {
      return res.json({
        code: 401,
        msg: 'Unauthorized',
      });
    }
    // 将user挂载到请求对象上
    set(req, 'user', user);
    next();
  });
}
