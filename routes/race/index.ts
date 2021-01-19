import { Router } from 'express';
import { pickBy, toNumber } from 'lodash';
import { Races } from '../../db/model';

const router = Router();
export default router;

router.get('/list', (req, res) => {
  const { limit, offset, ...otherQuery } = req.query;
  Races.findAll({
    where: pickBy(otherQuery),
    limit: toNumber(limit),
    offset: toNumber(offset) - 1,
  }).then(results => {
    res.status(200).json(results.map(item => item.toJSON()));
  }).catch(() => {
    res.status(500).end();
  });
});

router.post('/add', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).end();
  }
  Races.create(data).then(result => {
    res.status(200).json(result.toJSON());
  }).catch(() => {
    res.status(500).end();
  });
});

router.delete('/delete', (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).end();
  }
  Races.destroy({
    where: { rid: data },
  }).then(() => {
    res.status(200).end();
  }).catch(() => {
    res.status(500).end();
  });
});

router.put('/update', function(req, res) {
  const data = req.body;
  const { _id } = data;
  if (!_id) {
    return res.status(400).end();
  }
  Races.update(data, {
    where: { rid: _id },
    returning: true,
  }).then(([, result]) => {
    res.status(200).json(result.map(item => item.toJSON()));
  }).catch(() => {
    res.status(500).end();
  });
});
