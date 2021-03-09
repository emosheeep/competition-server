import { Router } from 'express';
import User from './user';
import Race from './race';
import Record from './record';
import Auth from './auth';
import Permission from './permission';
import Role from './role';
import loginChecker from '../middlewares/login-checker';

const router = Router();

router.use(Auth);
router.use(loginChecker);
router.use(User);
router.use(Race);
router.use(Record);
router.use(Permission);
router.use(Role);

export default router;
