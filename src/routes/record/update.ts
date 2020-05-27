import { Router } from 'express'
import { update } from '../../db/dao'
import { RECORD } from '../../db/model'

const router = Router()

router.patch('/update', function (req, res) {
  const data = req.body
  update(RECORD, { _id: data._id }, data).then(result => {
    res.status(200).json(result)
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
