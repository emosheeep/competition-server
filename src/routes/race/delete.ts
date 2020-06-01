import { Router } from 'express'
import { remove } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()

router.delete('/delete', (req, res) => {
  const { _id } = req.body
  if (!_id) {
    return res.status(400).end()
  }
  remove(RACE, { _id }).then(() => {
    res.status(200).end()
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
