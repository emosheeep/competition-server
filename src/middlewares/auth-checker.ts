import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';

const strategy = {
  // '/user/add': gen('user:add'),
  // '/user/delete': gen('user:delete'),
  // '/user/list': gen('user:query'),
  // '/user/update': gen('user:update'),
  // '/race/add': gen('race:add'),
  // '/race/delete': gen('race:delete'),
  // '/race/list': gen('race:query'),
  // '/race/update': gen('race:update'),
  // '/record/add': gen('record:add'),
  // '/record/delete': gen('record:delete'),
  // '/record/list': gen('record:query'),
  // '/record/update': gen('record:update'),
};

export default function(req: Request, res: Response, next: NextFunction) {
  const checker = strategy[req.path];
  if (!checker) return next();
  const permissions = get(req, 'user.permissions', []);
  console.log(permissions);

  if (checker(permissions)) {
    return next();
  }
  return res.json({
    code: 401,
    msg: '暂无权限',
  });
}

/**
 * 生成权限校验函数
 * @param {string} type 权限类别
 * @returns
 */
function gen(type: string) {
  return function(permissions) {
    return permissions.some(p => p.type === type);
  };
}
