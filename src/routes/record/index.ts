import { Router } from 'express'
import List from './list'
import Add from './add'
import Update from './update'
import Delete from './delete'
import File from './file'

const router = Router()

router.use(Add)
router.use(List)
router.use(Update)
router.use(Delete)
router.use(File)

export default router
