import { Request, Response, Router } from 'express';
import { toNumber } from 'lodash';
import { likeQuery, Permissions, sequelize } from '../db/model';

const router = Router();

router.get('/permission/list', async (req: Request, res: Response) => {
  const {
    limit,
    offset,
    label,
    description,
    ...query
  } = req.query;
  Object.assign(query, likeQuery({ label, description }));

  const { rows, count } = await Permissions.findAndCountAll({
    where: query,
    limit: toNumber(limit) || undefined,
    offset: toNumber(offset) - 1 || undefined,
  });
  res.json({
    code: 200,
    msg: '查询成功',
    count,
    data: rows.map(item => item.toJSON()),
  });
});

router.post('/permission/add', async (req: Request, res: Response) => {
  const data = req.body;
  if (!data) {
    return res.json({
      code: 400,
      msg: '参数有误',
    });
  }
  await Permissions.create(data);
  res.json({
    code: 200,
    msg: '添加成功',
  });
});

router.delete('/permission/delete', async (req: Request, res: Response) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.json({
      code: 400,
      msg: '参数有误',
    });
  }
  await sequelize.transaction(async transaction => {
    for (const id of data) {
      const permission = await Permissions.findByPk(id);
      // @ts-ignore
      const num = await permission.countRoles();
      if (num === 0) {
        await Permissions.destroy({ where: { id: data }, transaction });
      } else {
        throw new Error(`id为${id}的权限被${num}个角色引用，不能删除`);
      }
    }
  });
  res.json({
    code: 200,
    msg: '删除成功',
  });
});

router.post('/permission/update', async (req: Request, res: Response) => {
  const data = req.body;
  const { id, ...otherData } = data;
  if (!id) {
    return res.json({
      code: 400,
      msg: '参数有误',
    });
  }
  await Permissions.update(otherData, { where: { id } });
  res.json({
    code: 200,
    msg: '修改成功',
  });
});

export default router;
