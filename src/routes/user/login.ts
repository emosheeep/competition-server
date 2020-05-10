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
    find(USER, { account, password, identity }), // 账号表
    find(identity, { account }) // 信息表
  ]).then(([results, infos]) => {
    if (results.length === 0) {
      res.status(401).end()
    } else {
      const user = (infos[0] as any)._doc
      Reflect.deleteProperty(user, 'password')
      res.status(200)
      res.cookie('user', JSON.stringify({ account, identity }), {
        signed: true,
        httpOnly: true,
        maxAge: 7 * 24 * 3600 * 1000 // 一周
      }).json({
        user,
        identity,
        token: sign({ account, identity })
      })
    }
  }).catch(_ => {
    res.status(500).end()
  })
})