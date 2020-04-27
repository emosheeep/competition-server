import { Request, Response } from 'express'
import { find } from '../../db/dao'

export default function (req: Request, res: Response) {
  find('race').then(results => {
    res.json(results)
  }).catch(_ => {
    res.status(500).end()
  })
}