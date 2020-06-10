import { Router } from 'express'
import { USER } from '../../db/model'
import { transaction, remove } from '../../db/dao'

const router = Router()

router.delete('/delete', (req, res) => {
  const { type, data } = req.body
  if (!Array.isArray(data)) {
    return res.status(400).end()
  }
  transaction(session => Promise.all([
    remove(USER, { account: { $in: data }, identity: type }, { session }, true),
    remove(type, { account: { $in: data } }, { session }, true)
  ])).then(() => {
    res.status(200).end()
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
