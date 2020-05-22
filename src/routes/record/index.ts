import { Router } from 'express'
import List from './list'
import Add from './add'
import Update from './update'
import Delete from './delete'
import Auth from './upload'

const router = Router()

router.use(Add)
router.use(List)
router.use(Update)
router.use(Delete)
router.use(Auth)

export default router