import { Request, Router } from 'express'
import { omit } from 'lodash'
import { compareSync } from 'bcryptjs'
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
  find(USER, { account, identity }).then(([user]) => {
    if (!user) {
      res.status(200).json({
        code: 1,
        msg: '用户不存在'
      })
    } else if (compareSync(password, user.password)) {
      return find(identity, { account }) // 信息表
    } else {
      res.status(200).json({
        code: 2,
        msg: '密码错误'
      })
    }
  }).then(result => {
    if (!result) return
    // 得到过滤后的用户信息
    const tmpUser = omit(result.pop(), ['_id', 'password'])
    const user = { identity, ...tmpUser }
    res.status(200).json({
      code: 0,
      msg: '登陆成功',
      data: {
        user,
        token: getToken(user), // 修改这里需要同时修改 refresh 中的 token 颁发
        refreshToken: getRefreshToken(user)
      }
    })
  }).catch(e => {
    res.status(500).end(e.message)
  })
})

export default router
