import { Request, Response, Router } from 'express'
import { update, transaction } from '../../db/dao'
import { USER, UserData } from '../../db/model'


interface RequestWithBody extends Request{
  body: {
    type: string;
    data: UserData
  }
}

const router = Router()
export default router.put('/update', (req: RequestWithBody, res: Response) => {
  const { type, data } = req.body
  const { account, password } = data
  transaction(session => Promise.all([
    update(USER, { account }, { account, password }, { session }, true),
    update(type, { account }, data, { session }, true)
  ])).then(results => {
    res.status(200).json(results)
  }).catch(e => {
    res.status(500).end()
  })
})