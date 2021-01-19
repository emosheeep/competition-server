import dayjs from 'dayjs';
import { Request, Response, Router } from 'express';
import { deleteFile } from '../../utils/qiniu';
import { Records } from '../../db/model';
import { pickBy, toNumber } from 'lodash';
import File from './file';

const router = Router();

router.use(File);

router.get('/list', (req: Request, res: Response) => {
  const { limit, offset, ...otherQuery } = req.query;
  Records.findAll({
    where: pickBy(otherQuery),
    limit: toNumber(limit),
    offset: toNumber(offset) - 1,
  }).then(results => {
    res.json(results.map(item => item.toJSON()));
  }).catch(() => {
    res.status(500).end();
  });
});

router.delete('/delete', (req: Request, res: Response) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).end();
  }
  deleteFile(data).then(() => {
    return Records.destroy({ where: { record_id: data } });
  }).then(() => {
    res.status(200).json({
      code: 0,
      msg: 'ok',
    });
  }).catch(e => {
    res.status(500).end(e.message);
  });
});

router.post('/add', async (req: Request, res: Response) => {
  const data = req.body;
  if (!data) {
    return res.status(400).end();
  }
  const { race_id, sid, date } = data;
  try {
    // 检查是否已存在相同记录
    const temp = await Records.findOne({ where: { race_id, sid } });
    if (temp) {
      return res.status(200).json({
        code: 1,
        msg: '请勿重复报名',
      });
    }
    // 过期的比赛不能参加
    if (dayjs(date).isBefore(dayjs())) {
      return res.status(200).json({
        code: 2,
        msg: '比赛已过期',
      });
    }
    const result = await Records.create(data);
    res.status(200).json({
      code: 0,
      data: result,
    });
  } catch (e) {
    res.status(500).end(e.message);
  }
});

router.patch('/update', (req: Request, res: Response) => {
  const { record_id, ...data } = req.body;
  Records.update(data, {
    returning: true,
    where: {
      record_id,
    },
  }).then(([, result]) => {
    res.status(200).json(result.map(item => item.toJSON()));
  }).catch(() => {
    res.status(500).end();
  });
});

export default router;
