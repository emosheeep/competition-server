import { Request, Router } from 'express'
import { genSalt, hash } from 'bcryptjs'
import { find, transaction, insert } from '../../db/dao'
import { USER, UserData } from '../../db/model'

interface RequestWithBody extends Request{
  body: {
    type: string;
    data: UserData
  }
}

const router = Router()

router.post('/add', async (req: RequestWithBody, res) => {
  const { type, data } = req.body
  if (!type || !data) {
    return res.status(400).end()
  }
  try {
    // TODO 部分添加，返回重复的
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
    res.status(500).end(e.message)
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
    }).then(result => {
      if (result.length === 0) {
        resolve([])
      } else {
        resolve(result.map(user => user.account))
      }
    }).catch(reject)
  })
}

interface Account {
  account: string;
  password: string;
  identity: string;
}

/**
 * 添加用户
 * @param type 用户类型
 * @param values 用户数据
 */
async function addUser (type: string, values: UserData | UserData[]) {
  // 生成user表的数据
  let accountData: Account | Account[]

  // 密码加盐
  if (Array.isArray(values)) {
    accountData = []
    for (const item of values) {
      item.password = await generatePassword(item.password)
      accountData.push({
        account: item.account,
        password: item.password,
        identity: type
      })
    }
  } else {
    values.password = await generatePassword(values.password)
    accountData = {
      account: values.account,
      password: values.password,
      identity: type
    }
  }

  // 事务操作
  return transaction(session => Promise.all([
    insert(USER, accountData, { session }, true),
    insert(type, values, { session }, true)
  ]))
}

/**
 * 使用bcrypt加密密码
 * @param pwd 密码
 */
function generatePassword (pwd: string) {
  return genSalt(10).then(salt => hash(pwd, salt))
}
