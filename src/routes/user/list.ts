/**
 * 返回所有用户的信息
 */
import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'
import { ADMIN, STUDENT, TEACHER } from '../../db/model'

const router = Router()
export default router.get('/list', (req: Request, res: Response) => {
  Promise.all([
    find(ADMIN),
    find(STUDENT),
    find(TEACHER)
  ]).then(([admins, students, teachers]) => {
    res.json({
      admins,
      students,
      teachers
    })
  }).catch(_ => {
    res.status(500).end()
  })
})