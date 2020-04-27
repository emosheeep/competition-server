import { Request, Response, Router } from 'express'
import { find, transaction, insert } from '../../db/dao'
import { USER } from '../../db/model'

interface UserData {
  account: string;
  password: string;
  name?: string;
  sex?: string;
  grade?: string;
  classname?: string;
  dept?: string;
}

interface RequestWithBody extends Request{
  body: {
    type: string;
    data: UserData
  }
}

/**
 * 定义并导出路由
 */
const router = Router()
export default router.post('/add', async (req: RequestWithBody, res: Response) => {
  const { type, data } = req.body

  if (!validate(type, data)) {
    return res.status(400).end()
  }

  try {
    const isUserExisted = await hasUser(type, data.account)
    if (isUserExisted) {
      return res.status(200).json({
        code: 1,
        msg: 'user existed'
      })
    }
    await addUser(type, data)
    res.status(200).json({
      code: 0,
      msg: 'ok'
    })
  } catch (e) {
    res.status(500).end()
  }
})

/**
 * 校验请求体数据，确保每一项都不为空
 * @param body 请求体
 */
function validate (type: string, data: UserData): Boolean {
  const types = ['teacher', 'student', 'admin']
  const student: Array<keyof UserData> = ['account', 'password', 'name', 'sex', 'grade', 'classname']
  const teacher: Array<keyof UserData> = ['account', 'password', 'name', 'dept']
  const admin: Array<keyof UserData> = ['account', 'password']
  if (!types.includes(type)) {
    return false
  }

  let flag: Boolean
  switch (type) {
    case 'student':
      flag = student.every(key => !!data[key])
      break
    case 'teacher':
      flag = teacher.every(key => !!data[key])
      break
    default:
      flag = admin.every(key => !!data[key])
  }
  
  return flag
}

/**
 * 判断用户是否已存在
 * @param type 用户类型
 * @param account 用户名（id）
 */
function hasUser(type: string, account: string) {
  return new Promise<Boolean>((resolve, reject) => {
    find(USER, {
      identity: type,
      account
    }).then(res => {
      if (res.length === 0) {
        resolve(false)
      } else {
        resolve(true)
      }
    }).catch(reject)
  })
}

/**
 * 添加用户
 * @param type 用户类型
 * @param values 用户数据
 */
function addUser (type: string, values: UserData) {
  const accountData = {
    account: values.account,
    password: values.password,
    identity: type
  }
  const data = generateData(type, values)

  return transaction(session => Promise.all([
    insert(USER, accountData, { session }),
    insert(type, data, { session })
  ]))
}

/**
 * 将用户数据与数据库数据字段对应起来
 * @param type 用户类型
 * @param values 用户数据
 */
function generateData (type: string, values: UserData) {
  switch (type) {
    case 'student':
      return {
        sid: values.account,
        sname: values.name,
        sex: values.sex,
        grade: values.grade,
        classname: values.classname
      }
    case 'teacher':
      return {
        tid: values.account,
        tname: values.name,
        dept: values.dept
      }
    default:
      return values // 默认 account password
  }
}