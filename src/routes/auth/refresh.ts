import { Router } from 'express'
import { omit } from 'lodash'
import dayjs from 'dayjs'
import { verify } from 'jsonwebtoken'
import { find } from '../../db/dao'
import { USER } from '../../db/model'
import secretKey from '../../config/tokenKey'
import { getToken } from '../../utils/token'

const router = Router()

router.get('/refresh', function (req, res) {
  const refreshToken = req.headers.authorization
  if (!refreshToken) {
    return res.status(403).end()
  }
  verify(refreshToken, secretKey, function (err, payload: any) {
    // token 解析失败，或未携带token
    if (err || !payload) {
      return res.status(403).end()
    }
    const { exp, account, identity } = payload
    // refreshToken过期，重新登录
    if (dayjs().isAfter(exp)) {
      return res.status(403).end()
    }
    // 否则刷新token
    find(USER, { account, identity }).then(users => {
      if (users.length === 0) {
        res.status(403).end()
      } else {
        const tmpUser = omit(users.pop(), ['_id', 'password'])
        const user = { identity, ...tmpUser }
        res.status(200).send(getToken(user))
      }
    }).catch(e => {
      res.status(500).end(e.message)
    })
  })
})

export default router
