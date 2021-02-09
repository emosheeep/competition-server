import {
  Sequelize,
  DataTypes,
  Model,
  ModelSetterOptions,
  ModelGetterOptions,
  Op,
} from 'sequelize';
import { genSaltSync, hashSync } from 'bcryptjs';
import dayjs from 'dayjs';

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
      createdAt: 'create_time',
      updatedAt: 'update_time',
      getterMethods: genGetter(
        ['create_time', 'update_time', 'date'],
        time => {
          return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        },
      ),
    },
  },
);

sequelize.sync().then(() => {
  console.log('同步成功');
});

export const Admins = sequelize.define('admin', {
  aid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.INTEGER },
}, {
  setterMethods: {
    ...trim(['aid', 'name']),
    password: setPassword,
  },
});

export const Students = sequelize.define('student', {
  sid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  sex: { type: DataTypes.INTEGER, allowNull: false }, // 0 女, 1 男
  grade: { type: DataTypes.INTEGER, allowNull: false },
  class: { type: DataTypes.STRING, allowNull: false },
}, {
  setterMethods: {
    ...trim(['sid', 'name', 'class']),
    password: setPassword,
  },
});

export const Teachers = sequelize.define('teacher', {
  tid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false, set: setPassword },
  rank: { type: DataTypes.INTEGER, allowNull: false }, // 职称
  description: { type: DataTypes.STRING, allowNull: false },
}, {
  setterMethods: {
    ...trim(['tid', 'name', 'description']),
    password: setPassword,
  },
});

export const Races = sequelize.define('race', {
  race_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  sponsor: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.INTEGER, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
}, {
  setterMethods: {
    ...trim(['title', 'sponsor', 'location', 'description']),
  },
});

export const Records = sequelize.define('record', {
  record_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  score: { type: DataTypes.STRING },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  description: { type: DataTypes.STRING, allowNull: false },
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

/**
 * 批量生成setter
 * @param keys 需要生成setter的字段
 * @param convert 定义数据转化方式
 */
function genSetter(
  keys: string[],
  convert: (value: any) => any,
) {
  const result: ModelSetterOptions = {};
  for (const key of keys) {
    result[key] = function(value: string) {
      this.setDataValue(key, convert(value));
    };
  }
  return result;
}

/**
 * 批量生成getter
 * @param keys 需要生成getter的字段
 * @param convert 定义数据转化方式
 */
function genGetter(
  keys: string[],
  convert: (value: any) => any,
) {
  const result: ModelGetterOptions = {};
  for (const key of keys) {
    result[key] = function() {
      return convert(this.getDataValue(key));
    };
  }
  return result;
}

/**
 * 密码设置器, 用于拦截密码设置操作, 计算哈希密码存入数据库
 * @param{string} value 密码
 */
function setPassword(this: Model, value: string) {
  this.setDataValue('password', hashSync(value.trim(), genSaltSync(10)));
}

/**
 * 用于对字符串进行trim操作
 * @param{string[]} keys
 */
function trim(keys: string[]) {
  return genSetter(keys, value => value.trim());
}

/**
 * 构造`%{query}%`查询
 * @param query
 */
export function likeQuery(query: object) {
  const result: Record<string, object> = {};
  for (const [key, value] of Object.entries(query)) {
    if (!value) continue;
    result[key] = { [Op.substring]: value };
  }
  return result;
}
