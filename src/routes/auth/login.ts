import { Request, Router } from 'express'
import { omit } from 'lodash'
import { find } from '../../db/dao'
import { USER } from '../../db/model'
import { getRefreshToken, getToken } from '../../utils/token'

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const router = Router()

router.post('/login', (req: RequestWithBody, res) => {
  const { account, password, identity } = req.body
  if (!account || !password || !identity) {
    return res.status(400).end()
  }
  find(USER, {
    account,
    password,
    identity
  }).then(users => {
    if (users.length === 0) {
      res.status(200).json({
        code: 1,
        msg: '用户不存在或密码错误'
      })
    } else {
      return find(identity, { account }) // 信息表
    }
  }).then(result => {
    if (!result) return
    const user = omit(result.pop(), ['_id', 'password'])
    res.status(200)
    res.json({
      code: 0,
      msg: '登陆成功',
      data: {
        user: { identity, ...user },
        token: getToken(),
        refreshToken: getRefreshToken({ identity, account })
      }
    })
  }).catch(() => {
    res.status(500).end()
  })
})

export default router
