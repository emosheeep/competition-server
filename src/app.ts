import express from 'express'
import consola from 'consola'
import Router from './routes'
import middlewareDecorator from './middlewares'

const app = express()

middlewareDecorator(app)

app.use('/server', Router)

app.listen(3000, function () {
  consola.ready({
    message: `Server listening on http://localhost:${3000}`,
    badge: true
  })
})