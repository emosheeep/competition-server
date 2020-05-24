import { Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import loginchecker from './login-checker'

export default function (app: Application) {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser('FjCOQ/eD+guK6ns2ySsfG6h3nof'))
  app.use(loginchecker)
}
