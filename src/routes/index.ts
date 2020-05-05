import { Router } from 'express'
import User from './user'
import Race from './race'
import Record from './record'

const router = Router()

router.use('/user', User)
router.use('/race', Race)
router.use('/record', Record)

export default router