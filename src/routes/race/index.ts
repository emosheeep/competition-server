import { Router } from 'express'
import List from './list'

const router = Router()

router.get('/list', List)

export default router