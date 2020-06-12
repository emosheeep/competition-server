import { Request, Router } from 'express'
import { genSalt, hash } from 'bcryptjs'
import { partition } from 'lodash'
import { find, transaction, insert } from '../../db/dao'
import { USER, UserData } from '../../db/model'

interface ReqWithBody extends Request{
  body: {
    type: string;
    data: UserData | UserData[];
  }
}

const router = Router()

router.post('/add', async (req: ReqWithBody, res) => {
  const { type, data } = req.body
  if (!type || !data) {
    return res.status(400).end()
  }
  try {
    const [exists, unexists] = await checkUser(type, data)
    await addUser(type, unexists)
    if (exists.length !== 0) {
      res.status(200).json({
        code: 1,
        msg: '用户已存在',
        data: exists.map(item => item.account)
      })
    } else {
      res.status(200).json({
        code: 0,
        msg: '添加成功'
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
function checkUser (type: string, users: UserData | UserData[]) {
  if (!Array.isArray(users)) {
    users = [users]
  }
  const accounts = users.map(user => user.account)
  return new Promise<Array<UserData[]>>((resolve, reject) => {
    find(type, { account: { $in: accounts } }).then(data => {
      const result = partition(users as UserData[], user => {
        return !!data.find(item => item.account === user.account)
      })
      resolve(result) // result[0]已存在的用户，result[1]不存在的用户
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
