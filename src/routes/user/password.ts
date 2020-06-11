import { Router } from 'express'
import { compact } from 'lodash'
import { transaction, update, find } from '../../db/dao'
import { USER } from '../../db/model'

const router = Router()

router.patch('/password', function (req, res) {
  const { account, identity, oldVal, newVal } = req.body
  const { length } = compact([account, identity, oldVal, newVal])
  if (length !== 4) {
    return res.status(400).end()
  }
  find(USER, {
    account,
    identity,
    password: oldVal
  }).then(async ({ length }) => {
    // 无匹配记录
    if (length !== 1) {
      return Promise.resolve({
        code: 1,
        msg: '密码有误'
      })
    }
    await transaction(session => Promise.all([
      update(
        USER,
        { account, identity, password: oldVal },
        { password: newVal },
        { session },
        true
      ),
      update(
        identity,
        { account, password: oldVal },
        { password: newVal },
        { session },
        true
      )
    ]))
    return Promise.resolve({
      code: 0,
      msg: 'ok'
    })
  }).then(result => {
    res.status(200).json(result)
  }).catch(e => {
    res.status(500).end(e.message)
  })
})

export default router
