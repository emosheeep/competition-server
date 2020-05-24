import { Request, Router } from 'express'
import { find, transaction, insert } from '../../db/dao'
import { USER, UserData } from '../../db/model'

interface RequestWithBody extends Request{
  body: {
    type: string;
    data: UserData
  }
}
interface Account {
  account: string;
  password: string;
  identity: string;
}

const router = Router()

router.post('/add', async (req: RequestWithBody, res) => {
  const { type, data } = req.body
  if (!type || !data) {
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

export default router

/**
 * 判断用户是否已存在
 * @param type 用户类型
 * @param users 用户数据
 */
function hasUser (type: string, users: UserData | UserData[]) {
  let accounts: Array<string>
  if (Array.isArray(users)) {
    accounts = users.map(user => user.account)
  } else {
    accounts = [users.account]
  }
  return new Promise<string[]>((resolve, reject) => {
    find(type, {
      account: { $in: accounts }
    }).then(res => {
      if (res.length === 0) {
        resolve([])
      } else {
        resolve(res.map(user => (user as unknown as UserData).account))
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
  let accountData: Account | Array<Account>
  if (Array.isArray(values)) {
    accountData = values.map<Account>(item => {
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
