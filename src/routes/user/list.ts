import { Request, Response, Router } from 'express'
import { find } from '../../db/dao'
import { ADMIN, STUDENT, TEACHER } from '../../db/model'

const router = Router()
export default router.get('/list', async (req: Request, res: Response) => {
  const { type } = req.query
  try {
    if (type == undefined) {
      const [admins, students, teachers] = await Promise.all([
        find(ADMIN), find(STUDENT), find(TEACHER)
      ])
      res.json({ admins, students, teachers })
    } else if (
      typeof type === 'string'
      && [ADMIN, STUDENT, TEACHER].includes(type)
    ) {
      const results = await find(type)
      res.status(200).json(results)
    } else {
      res.status(400).end()
    }
  } catch (e) {
    res.status(500).end()
  }
})