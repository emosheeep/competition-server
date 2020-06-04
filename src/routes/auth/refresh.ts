import { Router } from 'express'
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
    // token 解析失败，重新登录
    if (err) {
      return res.status(403).end()
    }
    const { exp, user } = payload
    // refreshToken过期，重新登录
    if (dayjs().isAfter(exp)) {
      return res.status(403).end()
    }
    // 否则刷新token
    find(USER, user).then(users => {
      if (users.length === 0) {
        res.status(403).end()
      } else {
        res.status(200).send(getToken())
      }
    }).catch(e => {
      res.status(500).end(e.message)
    })
  })
})

export default router
