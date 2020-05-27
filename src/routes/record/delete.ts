import { Request, Response, Router } from 'express'
import { remove } from '../../db/dao'
import { RECORD } from '../../db/model'

const router = Router()

router.delete('/delete', (req: Request, res: Response) => {
  const { id } = req.body
  if (!id) {
    return res.status(400).end()
  }
  remove(RECORD, { id }).then(() => {
    res.status(200).end()
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
