import { Router } from 'express'
import {
  getFileUrl,
  getToken,
  refreshUrl,
  getFileInfo
} from '../../utils/qiniu'

const router = Router()

// 上传鉴权
router.get('/auth', (req, res) => {
  const name = req.query.name as string
  const token = name
    ? getToken(name)
    : getToken()
  res.status(200).send(token)
})

// 获取文件信息（包含下载url）
router.get('/file', (req, res) => {
  const name = req.query.name as string
  if (!name) {
    return res.status(400).end()
  }
  Promise.all([
    getFileInfo(name),
    Promise.resolve(getFileUrl(name))
  ]).then(([info, url]) => {
    const type = info.mimeType.split('/')[1]
    res.status(200).json({
      type,
      url
    })
  }).catch(e => {
    res.status(500).end(e.message)
  })
})

// cnd刷新
router.get('/fresh', (req, res) => {
  const name = req.query.name as string | string[]
  if (name.length === 0 || !name) {
    return res.status(400).end()
  }
  refreshUrl(name).then(_ => {
    res.status(200).json(_)
  }).catch(e => {
    res.status(500).end(e.message)
  })
})

export default router
