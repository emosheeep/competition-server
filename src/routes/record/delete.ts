import { Router } from 'express'
import { remove } from '../../db/dao'
import { RECORD } from '../../db/model'
import { deleteFile } from '../../utils/qiniu'

const router = Router()

router.delete('/delete', (req, res) => {
  const data = req.body
  if (!Array.isArray(data)) {
    return res.status(400).end()
  }
  deleteFile(data).then(() => {
    return remove(RECORD, { _id: { $in: data } })
  }).then(() => {
    res.status(200).json({
      code: 0,
      msg: 'ok'
    })
  }).catch(e => {
    res.status(500).end(e.message)
  })
})

export default router
