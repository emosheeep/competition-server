import { Router } from 'express'
import Login from './login'
import Refresh from './refresh'

const router = Router()

router.use(Refresh)
router.use(Login)

export default router
