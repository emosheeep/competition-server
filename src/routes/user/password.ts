import { Router } from 'express'
import { compact } from 'lodash'
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { transaction, update, find } from '../../db/dao'
import { USER } from '../../db/model'

const router = Router()

router.patch('/password', function (req, res) {
  const { account, identity, oldVal, newVal } = req.body
  const target = [account, identity, oldVal, newVal]
  const { length } = compact(target) // 空值检测
  if (length !== target.length) {
    return res.status(400).end()
  }
  find(USER, { account, identity }).then(([user]) => {
    if (user) {
      return compareSync(oldVal, user.password)
    }
    return false
  }).then(async isOk => {
    // 无匹配记录
    if (!isOk) {
      return Promise.resolve({
        code: 1,
        msg: '原密码有误'
      })
    }
    // 新密码加密
    const password = hashSync(newVal, genSaltSync(10))
    await transaction(session => Promise.all([
      update(USER, { account, identity }, { password }, { session }, true),
      update(identity, { account }, { password }, { session }, true)
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
