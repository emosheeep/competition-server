import { Request, Response, Router } from 'express';
import { getUserModel } from '../../db/model';
import { Op } from 'sequelize';
import { compact, differenceBy, get, omit, toNumber } from 'lodash';
import { compareSync } from 'bcryptjs';

const router = Router();

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

router.post('/add', async (req: Request, res: Response) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res400(res);
  }
  const [exists, unexists] = await checkUser(type, Array.isArray(data) ? data : [data]);
  const UserModel = getUserModel(type);
  await UserModel.bulkCreate(unexists);
  if (exists.length !== 0) {
    res.json({
      code: 1,
      msg: '用户已存在',
      data: exists,
    });
  } else {
    res.json({
      code: 200,
      msg: '添加成功',
    });
  }
});

router.delete('/delete', (req: Request, res: Response) => {
  const { type, data } = req.body;
  if (!Array.isArray(data.ids)) {
    return res400(res);
  }
  const UserModal = getUserModel(type);
  UserModal.destroy({
    where: { [UserModal.primaryKeyAttribute]: data.ids },
  }).then(() => {
    res.json({
      code: 200,
      msg: '删除成功',
    });
  });
});

router.get('/list', async (req: Request, res: Response) => {
  const {
    type,
    offset,
    limit,
    name,
    class: className,
    ...otherQueries
  } = req.query;

  if (name) {
    otherQueries.name = { [Op.like]: `%${name}%` };
  }
  if (className) {
    otherQueries.class = { [Op.like]: `%${className}%` };
  }

  const Modal = getUserModel(type as string);
  const { rows, count } = await Modal.findAndCountAll({
    attributes: { exclude: ['password'] },
    where: otherQueries,
    offset: toNumber(offset) - 1,
    limit: toNumber(limit),
  });
  res.json({
    code: 200,
    msg: '查询成功',
    count,
    data: rows.map(item => item.toJSON()),
  });
});

router.patch('/password', function(req, res) {
  const { account, identity, oldVal, newVal } = req.body;
  const target: string[] = [account, identity, oldVal, newVal];
  const { length } = compact(target); // 空值检测
  if (length !== target.length) {
    return res400(res);
  }
  const UserModal = getUserModel(identity);
  UserModal.findByPk(account).then(user => {
    if (!user) return false;
    return compareSync(oldVal, get(user.toJSON(), 'password'));
  }).then(async isOk => {
    // 无匹配记录
    if (!isOk) {
      return res.json({
        code: 1,
        msg: '原密码有误',
      });
    }
    // 新密码加密后更新
    await UserModal.update({ password: newVal }, { where: { account } });
    res.json({
      code: 200,
      msg: '修改成功',
    });
  });
});

const defaultPwd = '123456';
router.put('/reset', (req: Request, res: Response) => {
  const { type, account } = req.body;
  const user = get(req, 'user');

  // 权限校验
  const condition = [type, account, user && user.identity && user.identity === 'admin'];
  const target = compact(condition);
  if (target.length !== condition.length) {
    return res400(res);
  }
  const UserModel = getUserModel(type);
  // 重置密码
  UserModel.update({ password: defaultPwd }, {
    where: { [UserModel.primaryKeyAttribute]: account },
  }).then(() => {
    res.json({
      code: 200,
      msg: '重置成功',
    });
  });
});

router.put('/update', (req, res) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res400(res);
  }
  const UserModel = getUserModel(type);
  const key = UserModel.primaryKeyAttribute;
  const { [key]: account, ...otherAttrs } = data;
  UserModel.update(otherAttrs, {
    where: { [key]: account },
  }).then(() => res.json({
    code: 200,
    msg: '修改成功',
  }));
});

export default router;

function res400(res: Response) {
  return res.json({
    code: 400,
    msg: '参数有误',
  });
}
