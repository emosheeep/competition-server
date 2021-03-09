import dayjs from 'dayjs';
import { set } from 'lodash';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import secretKey from '../config/tokenKey';
import { getUserModel, Roles } from '../db/model';

export default function(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.uid;
  if (typeof token !== 'string') {
    return res.json({
      code: 403,
      msg: '拒绝访问',
    });
  }
  verify(token, secretKey, async function(err, payload: any) {
    if (err) {
      return res.json({
        code: 403,
        msg: '拒绝访问',
      });
    }
    const { exp, identity, account } = payload;
    if (dayjs().isAfter(exp)) {
      return res.json({
        code: 401,
        msg: 'Unauthorized',
      });
    }
    const user = await getUserModel(identity).findByPk(account);
    const role_id = user?.getDataValue('role_id');
    const role = await Roles.findByPk(role_id);
    // @ts-ignore
    const permissions = (await role?.getPermissions()) || [];

    // 将user挂载到请求对象上
    set(req, 'user', {
      account,
      identity,
      permissions: permissions.map(item => item.toJSON()),
    });
    next();
  });
}
