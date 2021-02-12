import dayjs from 'dayjs';
import { Request, Response, Router } from 'express';
import { Records, Races, Students, Teachers, likeQuery } from '../../db/model';
import { toNumber } from 'lodash';
import File from './file';

const router = Router();

router.use(File);

router.get('/race/list', async (req: Request, res: Response) => {
  const { limit, offset, tname, sname, title, score, ...recordQuery } = req.query;
  Object.assign(recordQuery, likeQuery({
    score,
    '$race.title$': title,
    '$teacher.name$': tname,
    '$student.name$': sname,
  }));
  const { rows, count } = await Records.findAndCountAll({
    where: recordQuery,
    limit: toNumber(limit),
    offset: toNumber(offset) - 1,
    include: [
      { model: Students, attributes: [['name', 'sname']] },
      { model: Teachers, attributes: [['name', 'tname']] },
      { model: Races, attributes: ['title'] },
    ],
  });
  res.json({
    code: 200,
    msg: '查询成功',
    count,
    data: rows.map(item => {
      const { student, race, teacher, ...data }: Record<string, any> = item.toJSON();
      // 二级属性平铺
      return Object.assign(data, student, race, teacher);
    }),
  });
});

router.delete('/race/delete', async (req: Request, res: Response) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res400(res);
  }
  await Records.destroy({ where: { record_id: data } });
  res.json({
    code: 200,
    msg: '删除成功',
  });
});

router.post('/race/add', async (req: Request, res: Response) => {
  const data = req.body;
  if (!data) return res400(res);
  const msg = await validateRecord(data);
  if (msg) return res.json({ code: 400, msg });

  await Records.create(data);
  res.json({
    code: 200,
    msg: '创建成功',
  });
});

router.patch('/race/update', async (req: Request, res: Response) => {
  const { record_id, ...data } = req.body;
  await Records.update(data, { where: { record_id } });
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

async function validateRecord(data : any = {}) {
  const { race_id, sid, tid } = data;
  if (!race_id || !sid) {
    return '参数有误';
  }

  // 检查是否已存在相同记录
  const record = await Records.findOne({ where: { race_id, sid } });
  if (record) {
    return '请勿重复报名';
  }
  const race = await Races.findByPk(race_id);
  // 检查比赛是否存在
  if (!race) {
    return '比赛不存在';
  }
  const date = race.getDataValue('date');
  if (dayjs(date).isBefore(dayjs())) {
    // 检查比赛是否过期
    return '比赛已过期';
  }
  const student = await Students.findByPk(sid);
  if (!student) {
    return '学生信息不存在';
  }
  if (tid && !await Teachers.findByPk(tid)) {
    return '教师信息不存在';
  }
}
