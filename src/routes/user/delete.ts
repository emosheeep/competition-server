import { Request, Response, Router } from 'express'
import { USER } from '../../db/model'
import { transaction, remove } from '../../db/dao'

const router = Router()
export default router.delete('/delete', (req: Request, res: Response) => {
  const { type, account } = req.body
  transaction(session => Promise.all([
    remove(USER, { account, identity: type }, { session }, true),
    remove(type, { account }, { session }, true)
  ])).then(data => {
    res.status(200).json(data)
  }).catch(e => {
    res.status(500).end()
  })
})