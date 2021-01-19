import express from 'express';
import consola from 'consola';
import bodyParser from 'body-parser';
import Router from './routes';

const app = express();

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由
app.use('/api', Router);

app.listen(3000, function() {
  consola.ready({
    message: `Server listening on http://localhost:${3000}`,
    badge: true,
  });
});

// 捕获可能遗漏的错误，防止程序崩溃
process.on('uncaughtException', function(e) {
  consola.log(e);
});

process.on('unhandledRejection', function(e) {
  consola.log(e);
});
