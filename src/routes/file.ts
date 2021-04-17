import { Router } from 'express';
import {
  getFileUrl,
  getToken,
  refreshUrl,
  getFileInfo,
} from '../utils/qiniu';

const router = Router();

// 上传鉴权
router.get('/auth', (req, res) => {
  const name = req.query.name as string;
  const token = name
    ? getToken(name)
    : getToken();
  res.status(200).send(token);
});

// 获取文件信息
router.get('/file', (req, res) => {
  const name = req.query.name as string;
  if (!name) {
    return res.status(400).end();
  }
  getFileInfo(name).then(info => {
    res.status(200).json({
      code: 0,
      msg: 'ok',
      data: info,
    });
  }).catch(e => {
    res.status(200).json({
      code: 1,
      msg: e.message,
    });
  });
});

// 获取文件下载url
router.get('/download', (req, res) => {
  const name = req.query.name as string;
  if (!name) {
    return res.status(400).end();
  }
  res.status(200).send(getFileUrl(name));
});

// cnd刷新
router.get('/fresh', (req, res) => {
  const name = req.query.name as string;
  if (!name) {
    return res.status(400).end();
  }
  refreshUrl(name).then(info => {
    res.status(200).json({
      code: 0,
      msg: 'ok',
      data: info,
    });
  }).catch(errMsg => {
    res.status(200).send({
      code: 1,
      msg: errMsg,
    });
  });
});

export default router;
