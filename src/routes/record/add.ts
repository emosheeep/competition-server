import { Request, Response, Router } from 'express'
import { insert, find } from '../../db/dao'
import { RECORD } from '../../db/model'

const router = Router()
export default router.post('/add', async (req: Request, res: Response) => {
  const data = req.body
  if (!data) {
    return res.status(400).end()
  }
  const { id, sid } = data
  try {
    // 检查是否已存在相同记录
    const temp = await find(RECORD, { id, sid })
    if (temp.length !== 0) {
      return res.status(200).json({
        code: 1,
        msg: 'exist'
      })
    }
    const [result] = await insert(RECORD, data)
    res.status(200).json({
      code: 0,
      data: result
    })
  } catch (e) {
    res.status(500).end()
  }  
})