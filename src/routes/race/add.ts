import { Router } from 'express'
import { insert } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()

router.post('/add', (req, res) => {
  const data = req.body
  if (!data) {
    return res.status(400).end()
  }
  insert(RACE, data).then(([result]) => {
    res.status(200).json(result)
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
