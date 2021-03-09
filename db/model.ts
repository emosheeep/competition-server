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

export const sequelize = new Sequelize({
  database: 'competition', // 数据库名
  username: 'root', // 用户名
  password: '15591453874', // 用户密码
  dialect: 'mysql', // 数据库使用mysql
  host: '39.108.76.90', // 数据库服务器ip
  port: 3306, // 数据库服务器端口
  // sync: { alter: true },
  define: {
    charset: 'utf8',
    underscored: true, // 字段以下划线（_）来分割（默认是驼峰命名风格）
    timestamps: false,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    getterMethods: genGetter(
      ['create_time', 'update_time', 'date'],
      time => {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
      },
    ),
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
  timestamps: true,
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
  timestamps: true,
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
  timestamps: true,
  setterMethods: {
    ...trim(['title', 'sponsor', 'location', 'description']),
  },
});

export const Records = sequelize.define('record', {
  record_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  score: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING, defaultValue: '' },
}, {
  timestamps: true,
  setterMethods: {
    ...trim(['score', 'description']),
  },
});

Records.belongsTo(Students, { foreignKey: 'sid' });
Students.hasMany(Records, { foreignKey: 'sid' });
Records.belongsTo(Teachers, { foreignKey: 'tid' });
Teachers.hasMany(Records, { foreignKey: 'tid' });
Records.belongsTo(Races, { foreignKey: 'race_id' });
Races.hasMany(Records, { foreignKey: 'race_id' });

export const Roles = sequelize.define('role', {
  label: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },
}, {
  setterMethods: {
    ...trim(['label', 'description']),
  },
});

export const Permissions = sequelize.define('permission', {
  label: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },
  actions: { type: DataTypes.JSON },
}, {
  setterMethods: {
    ...trim(['label', 'description']),
  },
});

// 学生、教师与角色的n:1映射关系
Roles.hasMany(Students, { foreignKey: 'role_id' });
Students.belongsTo(Roles, { foreignKey: 'role_id' });
Roles.hasMany(Teachers, { foreignKey: 'role_id' });
Teachers.belongsTo(Roles, { foreignKey: 'role_id' });

// 权限与角色之间的m:n多对多映射关系
Permissions.belongsToMany(Roles, {
  through: 'role_permission',
});
Roles.belongsToMany(Permissions, {
  through: 'role_permission',
});

export function getUserModel(type: string) {
  return type === 'teacher' ? Teachers : Students;
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
  return genSetter(keys, value => value?.trim());
}

/**
 * 构造`%{query}%`查询, 空字段将被过滤
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
