import { Router } from 'express'
import List from './list'
import Add from './add'
import Update from './update'
import Delete from './delete'

const router = Router()

router.use(Add)
router.use(List)
router.use(Update)
router.use(Delete)

export default router
