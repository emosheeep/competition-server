// mongoose文档模型
import { Schema, model } from 'mongoose'

interface ObjectWithStringKeys {
  [key: string]: Schema
}

// 定义一些文档名称常量
export const ADMIN = 'admin'
export const STUDENT = 'student'
export const TEACHER = 'teacher'
export const RACE = 'race'
export const RECORD = 'record'
export interface UserData {
  account: string;
  password: string;
  name?: string;
  sex?: string;
  grade?: string;
  classname?: string;
  dept?: string;
}

const Schemas: ObjectWithStringKeys = {}

/**
 * 管理员信息
 */
Schemas[ADMIN] = new Schema({
  account: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  power: { type: String, required: true, trim: true } // read / write / root
})

/**
 * 学生信息
 */
Schemas[STUDENT] = new Schema({
  account: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  name: { type: String, trim: true },
  sex: { type: String, trim: true },
  grade: { type: String, trim: true },
  classname: { type: String, trim: true }
})

/**
 * 教师信息
 */
Schemas[TEACHER] = new Schema({
  account: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  name: { type: String, trim: true },
  rank: { type: String, trim: true }, // 职称
  description: { type: String, trim: true }
})

/**
 * 赛事信息
 */
Schemas[RACE] = new Schema({
  title: { type: String, required: true, trim: true },
  sponsor: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  level: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: Number, required: true, trim: true },
  description: { type: String, trim: true }
})

/**
 * 参赛记录信息
 */
Schemas[RECORD] = new Schema({
  id: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  date: { type: Number, required: true, trim: true },
  sid: { type: String, required: true, trim: true },
  sname: { type: String, required: true, trim: true },
  score: { type: String, trim: true },
  tid: { type: String, trim: true },
  tname: { type: String, trim: true },
  uploaded: { type: Boolean, trim: true, default: false },
  // 'pending'(未审核), 'fulfilled'(通过审核), 'rejected'(审核失败)
  state: { type: String, trim: true, default: 'pending' },
  description: { type: String, trim: true }
})

export default (name: string) => model(name, Schemas[name])
