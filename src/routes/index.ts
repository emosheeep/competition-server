import { Router } from 'express'
import User from './user'
import Race from './race'

const router = Router()

router.use('/user', User)
router.use('/race', Race)

router.get('/', function (req, res) {
  res.send('hello world')
})

export default router