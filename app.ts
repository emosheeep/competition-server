import express, { Response, Request, NextFunction } from 'express';
import 'express-async-errors';
import consola from 'consola';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Router from './routes';
import { sequelize } from './db/model';

const app = express();

// 中间件
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由
app.use('/api', Router);

// @ts-ignore 错误处理
app.use((e, req: Request, res: Response, next: NextFunction) => {
  res.json({
    code: 500,
    msg: e.message,
  });
  next(e);
});

app.listen(3000, function() {
  sequelize.sync({ alter: true }).then(() => {
    consola.ready({
      message: `Server is listening on http://localhost:${3000}`,
      badge: true,
    });
  });
});

// 捕获可能遗漏的错误，防止程序崩溃
process.on('uncaughtException', function(e) {
  consola.log(e);
});

process.on('unhandledRejection', function(e) {
  consola.log(e);
});
