import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'
import { RECORD } from '../../db/model'

const router = Router()
export default router.get('/list', (req: Request, res: Response) => {
  const { type, value } = req.query
  let promise
  switch (type) {
    case 'id':
      promise = find(RECORD, { id: value })
      break
    case 'sid':
      promise = find(RECORD, { sid: value })
      break
    case 'tid':
      promise = find(RECORD, { tid: value })
      break
    default:
      promise = find(RECORD)
      break
  }
  promise.then(results => {
    res.json(results)
  }).catch(_ => {
    res.status(500).end()
  })
}) 