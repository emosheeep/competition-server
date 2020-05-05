import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'
import { USER } from '../../db/model'
import { sign } from '../../utils/token'

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const router = Router()
export default router.post('/login', (req: RequestWithBody, res: Response) => {
  const { account, password, identity } = req.body
  if (!account || !password || !identity) {
    return res.status(400).end()
  }
  Promise.all([
    find(USER, { account, password, identity }),
    find(identity, { account })
  ]).then(([results, users]) => {
    if (results.length === 0) {
      res.status(401).end()
    } else {
      res.status(200).json({
        user: users[0],
        token: sign({ account })
      })
    }
  }).catch(_ => {
    res.status(500).end()
  })
})