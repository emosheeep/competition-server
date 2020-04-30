import { Router } from 'express'
import Login from './login'
import List from './list'
import Add from './add'
import Delete from './delete'
import Update from './update'

const router = Router()

router.use(List)
router.use(Login)
router.use(Add)
router.use(Delete)
router.use(Update)

export default router