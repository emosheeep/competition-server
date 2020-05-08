import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'
import { RECORD } from '../../db/model'

const router = Router()
export default router.get('/list', (req: Request, res: Response) => {
  const { id, sid } = req.query
  let promise
  if (!id && !sid) {
    promise = find(RECORD) // 默认返回全部数据
  } else if (id && !sid) {
    promise = find(RECORD, { id }) // 只传id，返回id对应的record
  } else if (!id && sid) {
    promise = find(RECORD, { sid }) // 只传sid，返回sid对应的record
  } else {
    promise = find(RECORD, { id, sid }) // 都传，都查
  }
  promise.then(results => {
    res.json(results)
  }).catch(_ => {
    res.status(500).end()
  })
}) 