import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()
export default router.get('/list', (req: Request, res: Response) => {
  const { _id } = req.query
  const promise = _id ? find(RACE, { _id }) : find(RACE)
  promise.then(results => {
    res.json(results)
  }).catch(_ => {
    res.status(500).end()
  })
}) 