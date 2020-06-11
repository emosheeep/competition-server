import { Request, Response, Router } from 'express'
import { omit } from 'lodash'
import { find } from '../../db/dao'
import { ADMIN, STUDENT, TEACHER } from '../../db/model'

const router = Router()

router.get('/list', async (req: Request, res: Response) => {
  const { type } = req.query
  try {
    // 返回全部数据 —— 管理员
    if (!type) {
      const [admins, students, teachers] = await Promise.all([
        find(ADMIN), find(STUDENT), find(TEACHER)
      ])
      res.json({
        admins: admins.map(item => omit(item, '_id')),
        students: students.map(item => omit(item, '_id')),
        teachers: teachers.map(item => omit(item, '_id'))
      })
    // 单独查询 —— 不返回密码
    } else if (
      typeof type === 'string' &&
      [ADMIN, STUDENT, TEACHER].includes(type)
    ) {
      const results = await find(type)
      res.status(200).json({
        [`${type}s`]: results.map(item => omit(item, ['_id', 'password']))
      })
    } else {
      res.status(400).end()
    }
  } catch (e) {
    res.status(500).end(e.message)
  }
})

export default router
