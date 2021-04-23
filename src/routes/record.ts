import dayjs from 'dayjs';
import { Request, Response, Router } from 'express';
import { Records, Races, Students, Teachers, likeQuery } from '@/db/model';
import { pick, toNumber } from 'lodash';
import { check } from '@/middlewares/auth-check';

const router = Router();

router.get('/record/list', async (req: Request, res: Response) => {
  const { limit, offset, tname, sname, title, score, ...recordQuery } = req.query;
  Object.assign(recordQuery, likeQuery({
    score,
    '$race.title$': title,
    '$teacher.name$': tname,
    '$student.name$': sname,
  }));
  const { rows, count } = await Records.findAndCountAll({
    where: recordQuery,
    limit: toNumber(limit) || undefined,
    offset: toNumber(limit) * (toNumber(offset) - 1) || undefined,
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

router.delete('/record/delete', async (req: Request, res: Response) => {
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

router.post('/record/add', async (req: Request, res: Response) => {
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

const checkRecordUpdate = check('record:update');
router.patch('/record/update', async (req: Request, res: Response) => {
  const { record_id, ...data } = req.body;
  const update = async data => await Records.update(data, { where: { record_id } });
  const record = await Records.findByPk(record_id);
  // @ts-ignore 学生自己
  const student = await record.getStudent();

  if (!record || !student) {
    return res.json({ code: 404, msg: '记录不存在' });
  }

  let isUpdateSuccess = false;
  // 有权限直接修改
  if (checkRecordUpdate(req)) {
    await update(data);
    isUpdateSuccess = true;
  } else if (
    // 判断是否是学生，学生可以改自己的录入成绩
    student.getDataValue('sid') === req.user.account &&
    req.user.identity === 'student'
  ) {
    await update(pick(data, ['score']));
    isUpdateSuccess = true;
  }

  if (isUpdateSuccess) {
    return res.json({
      code: 200,
      msg: '修改成功',
    });
  }
  res.json({
    code: 401,
    msg: '暂无权限',
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
