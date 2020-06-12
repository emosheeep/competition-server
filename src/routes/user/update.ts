import { Router } from 'express'
import { omit } from 'lodash'
import { update } from '../../db/dao'

const router = Router()

router.put('/update', (req, res) => {
  const { type, data } = req.body
  if (!type || !data) {
    return res.status(400).end()
  }
  const { account } = data
  // 未携带密码则是用户自己对个人信息的修改
  update(type, { account }, data).then(result => {
    res.status(200).json(omit(result, ['_id', 'password']))
  }).catch(e => {
    res.status(500).end(e.message)
  })
})

export default router
