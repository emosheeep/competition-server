import { Router } from 'express'
import List from './list'
import Add from './add'
import Delete from './delete'
import Update from './update'
import UpdatePassword from './password'
import Reset from './reset'

const router = Router()

router.use(List)
router.use(Add)
router.use(Delete)
router.use(Update)
router.use(UpdatePassword)
router.use(Reset)

export default router
