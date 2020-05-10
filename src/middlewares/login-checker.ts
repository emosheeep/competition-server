import { Request, Response, NextFunction } from 'express'
import { verify } from '../utils/token'

interface AuthContent {
  account: string;
  identity: string;
}

export default function (req: Request, res: Response, next: NextFunction) {
  const tokenObj = verify(req.headers.authorization as string) as AuthContent | null
  const user: AuthContent = req.signedCookies.user
    ? JSON.parse(req.signedCookies.user)
    : null

  if (req.path.endsWith('/login')) {
    return next()
  } else if (
    !tokenObj || !user
    || user.account !== tokenObj.account
    || user.identity !== tokenObj.identity
  ) {
    res.status(401).end()
  } else {
    next()
  }
}