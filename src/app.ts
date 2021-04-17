// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="index.d.ts" />
import 'express-async-errors';
import express, { Response, Request, NextFunction, json, urlencoded } from 'express';
import { ValidationError } from 'sequelize';
import consola from 'consola';
import cookieParser from 'cookie-parser';
import Router from './routes';
import { sequelize } from './db/model';

const app = express();

// 中间件
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));

// 路由
app.use('/api', Router);

// @ts-ignore 错误处理
app.use((e, req: Request, res: Response, next: NextFunction) => {
  if (e instanceof ValidationError) {
    res.json({
      code: 400,
      msg: e.errors.map(item => item.message).join('--'),
    });
  } else {
    res.json({
      code: 500,
      msg: e.message,
    });
  }
  next(e);
});

app.listen(3000, async function() {
  await sequelize.sync();
  consola.ready({
    message: `Server is listening on http://localhost:${3000}`,
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