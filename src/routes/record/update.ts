import { Request, Response, Router } from 'express'
import { update } from '../../db/dao'
import { RECORD } from '../../db/model'

const router = Router()
export default router.put('/update', (req: Request, res: Response) => {
  const { id, data } = req.body
  if (!data || !id) {
    return res.status(400).end()
  }
  update(RECORD, { _id: id }, data).then(_ => {
    res.status(200).end()
  }).catch(e => {
    res.status(500).end()
  })
})