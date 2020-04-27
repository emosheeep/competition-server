import { Request, Response } from 'express'
import { upsert } from '../../db/dao'

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

export default function (req: RequestWithBody, res: Response) {
  const { username } = req.body
  upsert('user',
    { account: username },
    req.body
  ).then(results => {
    console.log(results)
    res.status(200).send('ok')
  }).catch(e => {
    res.status(500).end()
  })
}