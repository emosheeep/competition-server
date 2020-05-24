import { Request, Response, Router } from 'express'
import { update } from '../../db/dao'
import { RECORD } from '../../db/model'

const router = Router()
export default router.put('/update', (req: Request, res: Response) => {
  const data = req.body
  update(RECORD, { _id: data._id }, data).then(() => {
    res.status(200).end()
  }).catch(() => {
    res.status(500).end()
  })
})
