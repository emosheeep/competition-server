import { Router } from 'express'
import { insert, find } from '../../db/dao'
import { RECORD } from '../../db/model'

const router = Router()

router.post('/add', async (req, res) => {
  const data = req.body
  if (!data) {
    return res.status(400).end()
  }
  const { id, sid, date } = data
  try {
    // 检查是否已存在相同记录
    const temp = await find(RECORD, { id, sid })
    if (temp.length !== 0) {
      return res.status(200).json({
        code: 1,
        msg: '请勿重复报名'
      })
    }
    // 过期的比赛不能参加
    if (date <= Date.now()) {
      return res.status(200).json({
        code: 2,
        msg: '比赛已过期'
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

export default router
