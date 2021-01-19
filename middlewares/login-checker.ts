import dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import secretKey from '../config/tokenKey';

export default function(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  next();
  // if (!token) {
  //   return res.status(403).end();
  // }
  // verify(token, secretKey, function(err, payload: any) {
  //   if (err) {
  //     return res.status(403).end(err.message);
  //   }
  //   const { exp } = payload;
  //   // 过期，401提示客户端刷新token
  //   if (dayjs().isAfter(exp)) {
  //     res.status(401).end('Unauthorized');
  //   } else {
  //     Reflect.set(req, 'user', payload); // 挂载到req上以便后面的路由使用
  //     next();
  //   }
  // });
}
