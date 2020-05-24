import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()
export default router.get('/list', (req: Request, res: Response) => {
  const { query } = req
  find(RACE, query).then(results => {
    res.json(results)
  }).catch(() => {
    res.status(500).end()
  })
})
