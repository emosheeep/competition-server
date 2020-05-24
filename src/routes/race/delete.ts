import { Router } from 'express'
import { remove } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()

router.delete('/delete', (req, res) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).end()
  }
  remove(RACE, { _id: id }).then(() => {
    res.status(200).end()
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
