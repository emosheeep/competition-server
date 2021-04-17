import dayjs from 'dayjs';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { tokenKey } from '../config/config';
import { getUserModel, Roles } from '../db/model';

export default function(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.uid;
  if (typeof token !== 'string') {
    return res.json({
      code: 403,
      msg: '拒绝访问',
    });
  }
  verify(token, tokenKey, async function(err, payload: any) {
    if (err) {
      return res.json({
        code: 403,
        msg: '拒绝访问',
      });
    }
    const { exp, identity, account } = payload;
    if (dayjs().isAfter(exp)) {
      return res.json({
        code: 403,
        msg: '请重新登陆',
      });
    }
    const user = await getUserModel(identity).findByPk(account);
    const role_id = user?.getDataValue('role_id');
    const role = await Roles.findByPk(role_id);
    // @ts-ignore
    const permissions = (await role?.getPermissions()) || [];

    // 将user挂载到请求对象上
    req.user = {
      account,
      identity,
      role,
      permissions: permissions.reduce((res, v) => {
        // 拼接成"user:add"这样的字符串
        return res.concat(`${v.type}:${v.action}`);
      }, []),
    };
    next();
  });
}
