import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';

const strategy = {
  '/user/add': gen('user', 'add'),
  '/user/delete': gen('user', 'delete'),
  '/user/list': gen('user', 'query'),
  '/user/update': gen('user', 'update'),
  '/race/add': gen('race', 'add'),
  '/race/delete': gen('race', 'delete'),
  '/race/list': gen('race', 'query'),
  '/race/update': gen('race', 'update'),
  '/record/add': gen('record', 'add'),
  '/record/delete': gen('record', 'delete'),
  '/record/list': gen('record', 'query'),
  '/record/update': gen('record', 'update'),
};

export default function(req: Request, res: Response, next: NextFunction) {
  const checker = strategy[req.path];
  if (checker) {
    const permissions = get(req, 'user.permissions', []);
    if (checker(permissions)) {
      return next();
    }
    return res.json({
      code: 401,
      msg: '暂无权限',
    });
  }
  next();
}

function gen(type, action) {
  return function(permissions) {
    return permissions.some(p => p.type === type && p.actions.includes(action));
  };
}
