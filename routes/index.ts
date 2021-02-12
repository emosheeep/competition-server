import { Router } from 'express';
import User from './user';
import Race from './race';
import Record from './record';
import Auth from './auth';
import loginChecker from '../middlewares/login-checker';

const router = Router();

router.use(Auth);
router.use(loginChecker);
router.use(User);
router.use(Race);
router.use(Record);

export default router;
