import { Request, Response, NextFunction } from 'express';

const strategy = {
  '/user/add': check('user:add'),
  '/user/delete': check('user:delete'),
  '/user/list': check('user:query'),
  '/user/update': check('user:update'),
  '/race/add': check('race:add'),
  '/race/delete': check('race:delete'),
  '/race/list': check('race:query'),
  '/race/update': check('race:update'),
  '/record/add': check('record:add'),
  '/record/delete': check('record:delete'),
  '/record/list': check('record:query'),
  '/record/update': check('record:update'),
};

export default function(req: Request, res: Response, next: NextFunction) {
  const checker = strategy[req.path];
  if (!checker) return next();
  const permissions = req.user.permissions;
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
function check(type: string) {
  return function(permissions) {
    return permissions.some(v => v === type);
  };
}
