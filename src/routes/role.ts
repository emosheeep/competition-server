import { Request, Response, Router } from 'express';
import { toNumber } from 'lodash';
import { likeQuery, Roles, Permissions, sequelize } from '../db/model';

const router = Router();

router.get('/role/list', async (req: Request, res: Response) => {
  const {
    limit,
    offset,
    label,
    description,
    ...query
  } = req.query;
  Object.assign(query, likeQuery({ label, description }));

  const { rows, count } = await Roles.findAndCountAll({
    where: query,
    limit: toNumber(limit) || undefined,
    offset: toNumber(limit) * (toNumber(offset) - 1) || undefined,
    distinct: true, // 防止重复计数
    include: {
      model: Permissions,
      attributes: {
        include: ['action', 'id', 'label'],
      },
    },
  });

  res.json({
    code: 200,
    msg: '查询成功',
    count,
    data: rows.map(item => item.toJSON()),
  });
});

router.post('/role/add', async (req: Request, res: Response) => {
  const { permissions = [], ...data } = req.body;
  if (!data) {
    return res.json({
      code: 400,
      msg: '参数有误',
    });
  }

  await sequelize.transaction(async transaction => {
    const role = await Roles.create(data, { transaction });
    const permission_models = await Permissions.findAll({
      where: { id: permissions },
      transaction,
    });
    // @ts-ignore
    role.setPermissions(permission_models);
  });

  res.json({
    code: 200,
    msg: '添加成功',
  });
});

router.delete('/role/delete', async (req: Request, res: Response) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.json({
      code: 400,
      msg: '参数有误',
    });
  }
  await sequelize.transaction(async transaction => {
    for (const id of data) {
      const role = await Roles.findByPk(id);
      const [stu_num, tea_num] = [
        // @ts-ignore
        await role.countStudents(),
        // @ts-ignore
        await role.countTeachers(),
      ];
      if (stu_num === 0 && tea_num === 0) {
        await Roles.destroy({ where: { id: data }, transaction });
      } else {
        throw new Error(`角色${id}包含引用${stu_num + tea_num}个，不能删除`);
      }
    }
  });

  res.json({
    code: 200,
    msg: '删除成功',
  });
});

router.post('/role/update', async (req: Request, res: Response) => {
  const data = req.body;
  const { id, permissions, ...otherData } = data;
  if (!id) {
    return res.json({
      code: 400,
      msg: '参数有误',
    });
  }

  await sequelize.transaction(async t => {
    const options = { where: { id }, transaction: t };
    await Roles.update(otherData, options);
    const role = await Roles.findOne(options);
    const permission_models = await Permissions.findAll({
      where: { id: permissions },
    });
    // @ts-ignore
    role.setPermissions(permission_models);
  });

  res.json({
    code: 200,
    msg: '修改成功',
  });
});

export default router;
