import { Router } from 'express'
import { genSaltSync, hashSync } from 'bcryptjs'
import { compact } from 'lodash'
import { update, transaction } from '../../db/dao'
import { USER } from '../../db/model'

const defaultPwd = '123456'
const router = Router()

router.put('/reset', (req, res) => {
  const { type, account } = req.body
  const user = Reflect.get(req, 'user')

  // 权限校验
  const condition = [type, account, user && user.identity && user.identity === 'admin']
  const target = compact(condition)
  if (target.length !== condition.length) {
    return res.status(400).end()
  }

  // 重置密码
  const password = hashSync(defaultPwd, genSaltSync(10))
  transaction(session => Promise.all([
    update(USER, { account }, { password }, { session }, true),
    update(type, { account }, { password }, { session }, true)
  ])).then(() => {
    res.status(200).end()
  }).catch(e => {
    res.status(500).end(e.message)
  })
})

export default router
