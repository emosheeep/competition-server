import { Request, Response, Router } from 'express'
import { insert } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()
export default router.post('/add', (req: Request, res: Response) => {
  const data = req.body
  if (!data) {
    return res.status(400).end()
  }
  insert(RACE, data).then(([result]) => {
    res.status(200).json(result)
  }).catch(e => {
    res.status(500).end()
  })
})