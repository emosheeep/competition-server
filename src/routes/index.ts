import { Router } from 'express'
import User from './user'
import Race from './race'
import Record from './record'
import Auth from './auth'
import loginChecker from '../middlewares/login-checker'

const router = Router()

router.use('/auth', Auth)

router.use(loginChecker)
router.use('/user', User)
router.use('/race', Race)
router.use('/record', Record)

export default router
