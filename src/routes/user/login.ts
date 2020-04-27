import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'
import { sign } from '../../utils/token'

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const router = Router()
export default router.post('/login', (req: RequestWithBody, res: Response) => {
  const { account, password, identity } = req.body
  find('user', {
    account,
    password,
    identity
  }).then(results => {
    if (results.length === 0) {
      res.status(401).end()
    } else {
      res.status(200).send(sign({ account }))
    }
  }).catch(_ => {
    res.status(500).end()
  })
})