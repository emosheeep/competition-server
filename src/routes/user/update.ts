import { Request, Response, Router } from 'express'
import { omit } from 'lodash'
import { update, transaction } from '../../db/dao'
import { USER, UserData } from '../../db/model'

interface RequestWithBody extends Request{
  body: {
    type: string;
    data: UserData
  }
}

const router = Router()

router.put('/update', (req: RequestWithBody, res: Response) => {
  const { type, data } = req.body
  if (!type || !data) {
    res.status(400).end()
  }
  const { account, password } = data
  // 未携带密码则是用户自己对个人信息的修改
  if (!password) {
    update(type, { account }, data).then(result => {
      res.status(200).json(omit(result, ['_id', 'password']))
    }).catch(e => {
      res.status(500).end(e.message)
    })
  // 否则是涉及密码的信息修改，需要同时改两张表
  } else {
    transaction(session => Promise.all([
      update(USER, { account }, { account, password }, { session }, true),
      update(type, { account }, data, { session }, true)
    ])).then(([, user]) => {
      res.status(200).json(user)
    }).catch(e => {
      res.status(500).end(e.message)
    })
  }
})

export default router
