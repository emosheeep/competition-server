import { Request, Response, Router } from 'express'
import { find, transaction, insert } from '../../db/dao'
import { USER, UserData } from '../../db/model'


interface RequestWithBody extends Request{
  body: {
    type: string;
    data: UserData
  }
}

const router = Router()
export default router.post('/add', async (req: RequestWithBody, res: Response) => {
  const { type, data } = req.body
  if (type == undefined || data == undefined) {
    return res.status(400).end()
  }
  try {
    const users = await hasUser(type, data)
    if (users.length !== 0) {
      res.status(200).json({
        code: 1,
        msg: 'user existed',
        users
      })
    } else {
      await addUser(type, data)
      res.status(200).json({
        code: 0,
        msg: 'ok'
      })
    }
  } catch (e) {
    res.status(500).end()
  }
})

/**
 * 判断用户是否已存在
 * @param type 用户类型
 * @param users 用户数据
 */
function hasUser(type: string, users: UserData | UserData[]) {
  let accounts: Array<string>
  if (Array.isArray(users)) {
    accounts = users.map(user => user.account)
  } else {
    accounts = [ users.account ]
  }
  return new Promise<string[]>((resolve, reject) => {
    find(type, {
      account: { $in: accounts }
    }).then(res => {
      if (res.length === 0) {
        resolve([])
      } else {
        resolve(res.map(user => (user as any).account))
      }
    }).catch(reject)
  })
}

/**
 * 添加用户
 * @param type 用户类型
 * @param values 用户数据
 */
function addUser (type: string, values: UserData | UserData[]) {
  let accountData: {} | Array<{}>
  if (Array.isArray(values)) {
    accountData = values.map(item => {
      return {
        account: item.account,
        password: item.password,
        identity: type
      }
    })
  } else {
    accountData = {
      account: values.account,
      password: values.password,
      identity: type
    }
  }

  return transaction(session => Promise.all([
    insert(USER, accountData, { session }, true),
    insert(type, values, { session }, true)
  ]))
}