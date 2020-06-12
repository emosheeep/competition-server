import { Request, Response, Router } from 'express'
import { omit } from 'lodash'
import { find } from '../../db/dao'
import { ADMIN, STUDENT, TEACHER } from '../../db/model'

const router = Router()
const filter = (item: object) => omit(item, ['_id', 'password'])

router.get('/list', async (req: Request, res: Response) => {
  const { type } = req.query
  try {
    // 返回全部数据 —— 管理员
    if (!type) {
      const [admins, students, teachers] = await Promise.all([
        find(ADMIN), find(STUDENT), find(TEACHER)
      ])
      res.json({
        admins: admins.map(filter),
        students: students.map(filter),
        teachers: teachers.map(filter)
      })
    // 单独查询
    } else if (
      typeof type === 'string' &&
      [ADMIN, STUDENT, TEACHER].includes(type)
    ) {
      const results = await find(type)
      res.status(200).json({
        [`${type}s`]: results.map(filter)
      })
    } else {
      res.status(400).end()
    }
  } catch (e) {
    res.status(500).end(e.message)
  }
})

export default router
