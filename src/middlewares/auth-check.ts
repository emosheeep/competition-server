import { Request, Response, NextFunction } from 'express';

/**
 * 生成权限校验函数
 * @param {string} type 权限类别
 * @returns {function}
 */
export function check(type: string) {
  return function(req: Request) {
    return req.user.permissions.some(v => v === type);
  };
}

type Checkers = Record<string, (req: Request) => boolean>
const strategy: Checkers = {
  // 用户管理
  '/user/add': check('user:add'),
  '/user/delete': check('user:delete'),
  '/user/reset': check('user:update'),
  '/user/list': check('user:query'),
  // 赛事管理
  '/race/add': check('race:add'),
  '/race/delete': check('race:delete'),
  '/race/list': check('race:query'),
  '/race/update': check('race:update'),
  // 参赛记录管理
  '/record/add': check('record:add'),
  '/record/delete': check('record:delete'),
  '/record/list': check('record:query'),
  // 权限管理
  '/permission/list': check('permission:query'),
  '/permission/add': check('permission:add'),
  '/permission/delete': check('permission:delete'),
  '/permission/update': check('permission:update'),
  // 角色管理
  '/role/list': check('role:query'),
  '/role/add': check('role:add'),
  '/role/delete': check('role:delete'),
  '/role/update': check('role:update'),
  '/role/grant': check('role:update'),
};

/**
 * 前置校验权限
 */
export default function(req: Request, res: Response, next: NextFunction) {
  const checker = strategy[req.path];

  if (!checker || checker(req)) return next();

  res.json({
    code: 401,
    msg: '暂无权限',
  });
}
