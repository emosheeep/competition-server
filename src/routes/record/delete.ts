import { Router } from 'express'
import { remove } from '../../db/dao'
import { RECORD } from '../../db/model'
import { deleteFile } from '../../utils/qiniu'

const router = Router()

router.delete('/delete', (req, res) => {
  const { _id } = req.body
  if (!_id) {
    return res.status(400).end()
  }
  deleteFile(_id).then(() => {
    return remove(RECORD, { _id })
  }).then(() => {
    res.status(200).json({
      code: 0,
      msg: 'ok'
    })
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
