import { Router } from 'express'
import { remove } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()

router.delete('/delete', (req, res) => {
  const data = req.body
  if (!Array.isArray(data)) {
    return res.status(400).end()
  }
  remove(RACE, { _id: { $in: data } }).then(() => {
    res.status(200).end()
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
