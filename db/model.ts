import { Sequelize, DataTypes } from 'sequelize';
import { genSaltSync, hashSync } from 'bcryptjs';

export const sequelize = new Sequelize(
  'competition', // 数据库名
  'root', // 用户名
  '15591453874', // 用户密码
  {
    dialect: 'mysql', // 数据库使用mysql
    host: '39.108.76.90', // 数据库服务器ip
    port: 3306, // 数据库服务器端口
    define: {
      underscored: true, // 字段以下划线（_）来分割（默认是驼峰命名风格）
      timestamps: true,
    },
  },
);

sequelize.sync().then(() => {
  console.log('同步成功');
});

/**
 * 密码设置器, 用于拦截密码设置操作, 计算哈希密码存入数据库
 * @param{string} value 密码
 */
function setPassword(value: string) {
  // @ts-ignore
  this.setDataValue('password', hashSync(value, genSaltSync(10)));
}

export const Admins = sequelize.define('admin', {
  aid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false, set: setPassword },
  type: { type: DataTypes.INTEGER },
});

export const Students = sequelize.define('student', {
  sid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false, set: setPassword },
  sex: { type: DataTypes.ENUM('man', 'woman') }, // 0 女, 1 男
  grade: { type: DataTypes.STRING },
  class: { type: DataTypes.STRING },
});

export const Teachers = sequelize.define('teacher', {
  tid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false, set: setPassword },
  rank: { type: DataTypes.STRING }, // 职称
  description: { type: DataTypes.STRING },
});

export const Races = sequelize.define('race', {
  race_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  sponsor: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

export const Records = sequelize.define('record', {
  record_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE },
  score: { type: DataTypes.STRING },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  description: { type: DataTypes.STRING },
});

Records.belongsTo(Students, { foreignKey: 'sid' });
Students.hasMany(Records, { foreignKey: 'sid' });
Records.belongsTo(Teachers, { foreignKey: 'tid' });
Teachers.hasMany(Records, { foreignKey: 'tid' });
Records.belongsTo(Races, { foreignKey: 'race_id' });
Races.hasMany(Records, { foreignKey: 'race_id' });

export function getUserModel(type: string) {
  return type === 'admin'
    ? Admins
    : type === 'teacher'
      ? Teachers
      : Students;
}
