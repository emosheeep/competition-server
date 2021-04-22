import { Options } from 'sequelize';

export const tokenKey = 'ncu_university_competition_server';

export const DataBaseConfig: Options = {
  database: 'competition', // 数据库名
  username: 'root', // 用户名
  password: '15591453874', // 用户密码
  dialect: 'mysql', // 数据库使用mysql
  host: '39.108.76.90', // 数据库服务器ip
  port: 3306, // 数据库服务器端口
};
