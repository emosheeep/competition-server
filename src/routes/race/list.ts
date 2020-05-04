import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'

const router = Router()
export default router.get('/list', (req: Request, res: Response) => {
  find('race').then(results => {
    res.json(results)
  }).catch(_ => {
    res.status(500).end()
  })
}) 