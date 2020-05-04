import { Request, Response, Router } from 'express'
import { remove } from '../../db/dao'
import { RACE } from '../../db/model'

const router = Router()
export default router.delete('/delete', (req: Request, res: Response) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).end()
  }
  remove(RACE, { _id: id }).then(_ => {
    res.status(200).end()
  }).catch(e => {
    res.status(500).end()
  })
})