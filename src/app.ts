import express from 'express'
import consola from 'consola'
import bodyParser from 'body-parser'
import cors from 'cors'
import Router from './routes'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.options('*', cors()) // 跨域并处理服务器预检请求
app.use(cors({
    origin: true, // 允许任何跨域请求
    credentials: true
}))

app.use('/server', Router)

app.listen(3000, function () {
  consola.ready({
    message: `Server listening on http://localhost:${3000}`,
    badge: true
  })
})