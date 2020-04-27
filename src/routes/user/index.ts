import { Router } from 'express'
import Login from './login'
import List from './list'
import Add from './add'

const router = Router()

router.use(List)
router.use(Login)
router.use(Add)

export default router