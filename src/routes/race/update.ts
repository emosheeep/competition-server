import { Router } from 'express'
import { update } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()

router.put('/update', function (req, res) {
  const data = req.body
  const { _id } = data
  if (!_id) {
    return res.status(400).end()
  }
  update(RACE, { _id }, data).then(result => {
    res.status(200).json(result)
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
