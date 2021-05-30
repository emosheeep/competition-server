import { Options } from 'sequelize';

// 可以自己定义
export const tokenKey = 'token-ncu_university-competition_server';
export const cookieKey = 'cookie-ncu_university-competition_server';

export const DataBaseConfig: Options = {
  dialect: 'mysql', // 数据库使用mysql
  port: 3306, // 数据库服务器端口
  host: '', // 数据库服务器ip
  database: '', // 数据库名
  username: '', // 用户名
  password: '', // 用户密码
};
