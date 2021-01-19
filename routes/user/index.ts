import { Request, Response, Router } from 'express';
import { getUserModel } from '../../db/model';
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
    return res.status(400).end();
  }
  try {
    const [exists, unexists] = await checkUser(type, Array.isArray(data) ? data : [data]);
    console.log(exists, unexists);
    const UserModel = getUserModel(type);
    await UserModel.bulkCreate(unexists);
    if (exists.length !== 0) {
      res.status(200).json({
        code: 1,
        msg: '用户已存在',
        data: exists,
      });
    } else {
      res.status(200).json({
        code: 0,
        msg: '添加成功',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).end(e.message);
  }
});

router.delete('/delete', (req: Request, res: Response) => {
  const { type, data } = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).end();
  }
  const UserModal = getUserModel(type);
  UserModal.destroy({
    where: { [UserModal.primaryKeyAttribute]: data },
  }).then(() => {
    res.status(200).end();
  }).catch(() => {
    res.status(500).end();
  });
});

router.get('/list', async (req: Request, res: Response) => {
  const { type, offset, limit, ...otherQueries } = req.query;
  try {
    const Modal = getUserModel(type as string);
    const { rows, count } = await Modal.findAndCountAll({
      where: otherQueries,
      offset: toNumber(offset) - 1,
      limit: toNumber(limit),
    });
    res.json({
      code: 0,
      msg: '查询成功',
      count,
      data: rows.map(item => omit(item.toJSON(), 'password')),
    });
  } catch (e) {
    res.status(500).end(e.message);
  }
});

router.patch('/password', function(req, res) {
  const { account, identity, oldVal, newVal } = req.body;
  const target: string[] = [account, identity, oldVal, newVal];
  const { length } = compact(target); // 空值检测
  if (length !== target.length) {
    return res.status(400).end();
  }
  const UserModal = getUserModel(identity);
  UserModal.findByPk(account).then(user => {
    if (!user) return false;
    return compareSync(oldVal, get(user.toJSON(), 'password'));
  }).then(async isOk => {
    // 无匹配记录
    if (!isOk) {
      return Promise.resolve({
        code: 1,
        msg: '原密码有误',
      });
    }
    // 新密码加密后更新
    await UserModal.update({ password: newVal }, { where: { account } });
    return Promise.resolve({
      code: 0,
      msg: 'ok',
    });
  }).then(result => {
    res.status(200).json(result);
  }).catch(e => {
    res.status(500).end(e.message);
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
    return res.status(400).end();
  }
  const UserModel = getUserModel(type);
  // 重置密码
  UserModel.update({ password: defaultPwd }, {
    where: { [UserModel.primaryKeyAttribute]: account },
  }).then(() => {
    res.status(200).end();
  }).catch(e => {
    res.status(500).end(e.message);
  });
});

router.put('/update', (req, res) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res.status(400).end();
  }
  const { account, ...otherAttrs } = data;
  const UserModel = getUserModel(type);
  UserModel.update(otherAttrs, {
    where: { [UserModel.primaryKeyAttribute]: account },
  }).then(([, result]) => {
    res.status(200).json(omit(result, ['password']));
  }).catch(e => {
    res.status(500).end(e.message);
  });
});

export default router;
