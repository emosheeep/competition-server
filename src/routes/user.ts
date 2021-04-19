import { Request, Response, Router } from 'express';
import { getUserModel, likeQuery, sequelize } from '../db/model';
import { compact, differenceBy, get, omit, toNumber } from 'lodash';
import { compareSync } from 'bcryptjs';

const router = Router();

router.get('/get_user', async (req: Request, res: Response) => {
  const { identity, account } = req.user ?? {};
  const UserModel = getUserModel(identity);
  const user = await UserModel.findByPk(account, {
    attributes: { exclude: ['password', 'create_time', 'update_time'] },
  });
  res.json({
    code: 200,
    msg: 'success',
    data: Object.assign({}, user?.toJSON(), req.user),
  });
});

router.post('/user/add', async (req: Request, res: Response) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res400(res);
  }
  const [exists] = await checkUser(type, [data]);
  if (exists.length !== 0) {
    return res.json({
      code: 1,
      msg: '用户已存在',
      data: exists,
    });
  }
  const UserModel = getUserModel(type);
  await UserModel.create(data);
  res.json({
    code: 200,
    msg: '添加成功',
  });
});

router.post('/user/import', async (req: Request, res: Response) => {
  const { type, data = [] } = req.body;
  if (!type || !data.length) {
    return res400(res);
  }
  const [exists, unexists] = await checkUser(type, data);
  if (exists.length !== 0) {
    return res.json({
      code: 1,
      msg: '用户已存在',
      data: exists,
    });
  }
  const UserModel = getUserModel(type);

  await sequelize.transaction(async t => {
    await UserModel.bulkCreate(unexists, { transaction: t });
  });

  res.json({
    code: 200,
    msg: '添加成功',
  });
});

router.delete('/user/delete', async (req: Request, res: Response) => {
  const { type, data } = req.body;
  if (!Array.isArray(data.ids)) {
    return res400(res);
  }
  if (
    data.ids.includes(get(req, 'user.account')) &&
    type === get(req, 'user.identity')
  ) {
    return res.json({
      code: 403,
      msg: '不能删除自己',
    });
  }
  const UserModal = getUserModel(type);
  await UserModal.destroy({
    where: { [UserModal.primaryKeyAttribute]: data.ids },
  });
  res.json({
    code: 200,
    msg: '删除成功',
  });
});

router.get('/user/list', async (req: Request, res: Response) => {
  const {
    type,
    offset,
    limit,
    name,
    class: className,
    ...query
  } = req.query;

  Object.assign(query, likeQuery({
    name,
    class: className,
  }));

  const Modal = getUserModel(type as string);
  const { rows, count } = await Modal.findAndCountAll({
    attributes: { exclude: ['password'] },
    where: query,
    order: [['create_time', 'DESC']],
    limit: toNumber(limit) || undefined,
    offset: toNumber(limit) * (toNumber(offset) - 1) || undefined,
  });
  res.json({
    code: 200,
    msg: '查询成功',
    count,
    data: rows.map(item => item.toJSON()),
  });
});

router.patch('/user/password', async (req: Request, res: Response) => {
  const { account, identity, oldVal, newVal } = req.body;
  const target: string[] = [account, identity, oldVal, newVal];
  const { length } = compact(target); // 空值检测
  if (length !== target.length) {
    return res400(res);
  }
  const UserModal = getUserModel(identity);
  const user = await UserModal.findByPk(account);
  if (!user) {
    return res.json({
      code: 2,
      msg: '用户不存在',
    });
  }
  // 无匹配记录
  if (!compareSync(oldVal, user.getDataValue('password'))) {
    return res.json({
      code: 1,
      msg: '原密码有误',
    });
  }
  // 新密码加密后更新
  await UserModal.update({ password: newVal }, {
    where: { [UserModal.primaryKeyAttribute]: account },
  });
  res.json({
    code: 200,
    msg: '修改成功',
  });
});

router.put('/user/reset', async (req: Request, res: Response) => {
  const { type, account } = req.body;
  const UserModel = getUserModel(type);
  // 重置密码
  await UserModel.update({ password: '123456' }, {
    where: { [UserModel.primaryKeyAttribute]: account },
  });
  res.json({
    code: 200,
    msg: '重置成功',
  });
});

router.put('/user/update', async (req: Request, res: Response) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res400(res);
  }
  const UserModel = getUserModel(type);
  const key = UserModel.primaryKeyAttribute;
  const { [key]: account, ...otherAttrs } = data;
  await UserModel.update(otherAttrs, {
    where: { [key]: account },
  });
  res.json({
    code: 200,
    msg: '修改成功',
  });
});

export default router;

function res400(res: Response) {
  return res.json({
    code: 400,
    msg: '参数有误',
  });
}

/**
 * 判断用户是否已存在
 * @param type 用户类型
 * @param users 用户数据
 */
function checkUser(type: string, users: any[]) {
  return new Promise<Array<Array<object>>>((resolve, reject) => {
    const model = getUserModel(type);
    const key = model.primaryKeyAttribute;
    model.findAll({
      where: { [key]: users.map(item => get(item, key)) },
    }).then((data: any[] | undefined) => {
      let exist: object[] = [];
      let notExist: object[] = [];
      if (!data) notExist = [...users];
      else {
        exist = data.map(item => omit(item.toJSON(), 'password'));
        notExist = differenceBy(users, exist, (a: any, b: any) => {
          return get(a, key) === get(b, key);
        });
      }
      resolve([exist, notExist]);
    }).catch(reject);
  });
}
