import { Router } from 'express'
import { find } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()

router.get('/list', function (req, res) {
  const { query } = req
  find(RACE, query).then(results => {
    res.status(200).json(results)
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
