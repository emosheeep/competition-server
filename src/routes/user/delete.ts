import { Router } from 'express'
import { remove } from '../../db/dao'

const router = Router()

router.delete('/delete', (req, res) => {
  const { type, data } = req.body
  if (!Array.isArray(data)) {
    return res.status(400).end()
  }
  remove(type, {
    account: {
      $in: data
    }
  }).then(() => {
    res.status(200).end()
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
