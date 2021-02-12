import { Response, Request, Router } from 'express';
import { toNumber } from 'lodash';
import { Races, likeQuery } from '../../db/model';
import { Op } from 'sequelize';

const router = Router();

router.get('/race/list', async (req: Request, res: Response) => {
  const {
    limit,
    offset,
    title,
    location,
    sponsor,
    date,
    ...query
  } = req.query;

  Object.assign(query, likeQuery({ title, location, sponsor }));
  if (typeof date === 'string') {
    query.date = { [Op.between]: date.split('~') };
  }

  const { rows, count } = await Races.findAndCountAll({
    where: query,
    limit: toNumber(limit),
    offset: toNumber(offset) - 1,
  });
  res.json({
    code: 200,
    msg: '查询成功',
    count,
    data: rows.map(item => item.toJSON()),
  });
});

router.post('/race/add', async (req: Request, res: Response) => {
  const data = req.body;
  if (!data) {
    return res400(res);
  }
  await Races.create(data);
  res.json({
    code: 200,
    msg: '添加成功',
  });
});

router.delete('/race/delete', async (req: Request, res: Response) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res400(res);
  }
  await Races.destroy({
    where: { race_id: data },
  });
  res.json({
    code: 200,
    msg: '删除成功',
  });
});

router.put('/race/update', async (req: Request, res: Response) => {
  const data = req.body;
  const { race_id, ...otherData } = data;
  if (!race_id) {
    return res400(res);
  }
  await Races.update(otherData, {
    where: { [Races.primaryKeyAttribute]: race_id },
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
