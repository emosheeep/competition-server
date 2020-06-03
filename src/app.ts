import express from 'express'
import consola from 'consola'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import loginChecker from './middlewares/login-checker'
import Router from './routes'
import LoginRoute from './routes/login'

const app = express()

// 中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('FjCOQ/eD+guK6ns2ySsfG6h3nof'))
app.use(passport.initialize())

// 路由
app.use('/api', LoginRoute)
app.use('/api', loginChecker, Router)

app.listen(3000, function () {
  consola.ready({
    message: `Server listening on http://localhost:${3000}`,
    badge: true
  })
})
