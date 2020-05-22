import { Router } from 'express'
import { getToken } from '../../utils/qiniu'

const router = Router()

router.get('/auth', (req, res) => {
  const name = req.query.name as string
  const token = name
    ? getToken(name)
    : getToken()
  res.send(token)
})

export default router