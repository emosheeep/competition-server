import express from 'express'
import consola from 'consola'
import bodyParser from 'body-parser'
import Router from './routes'

const app = express()

// 中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 路由
app.use('/api', Router)

app.listen(3000, function () {
  consola.ready({
    message: `Server listening on http://localhost:${3000}`,
    badge: true
  })
})
