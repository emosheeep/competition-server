// mongoose文档模型
import { Schema, model } from 'mongoose'

interface ObjectWithStringKeys {
	[key: string]: Schema
}

// 定义一些文档名称常量
export const USER = 'user'
export const ADMIN = 'admin'
export const STUDENT = 'student'
export const TEACHER = 'teacher'
export const RACE = 'race'
export const RECORD = 'record'
export interface UserData {
  account: string;
  password?: string;
  name?: string;
  sex?: string;
  grade?: string;
  classname?: string;
  dept?: string;
}

const Schemas: ObjectWithStringKeys = {}

/**
 * 用户账号密码信息表格：教师、学生、管理员
 */
Schemas[USER] = new Schema({
	account: { type: String, required: true, trim: true },
	password: { type: String, required: true, trim: true },
	identity: { type: String, required: true, trim: true }
})

/**
 * 管理员信息
 */
Schemas[ADMIN] = new Schema({
	account: { type: String, required: true, trim: true },
	password: { type: String, required: true, trim: true }
})

/**
 * 学生信息
 */
Schemas[STUDENT] = new Schema({
	account: { type: String, required: true, trim: true },
	password: { type: String, required: true, trim: true },
	name: { type: String, required: true, trim: true },
	sex: { type: String, required: true, trim: true },
	grade: { type: String, required: true, trim: true },
	classname: { type: String, required: true, trim: true }
})

/**
 * 教师信息
 */
Schemas[TEACHER] = new Schema({
	account: { type: String, required: true, trim: true },
	password: { type: String, required: true, trim: true },
	name: { type: String, required: true, trim: true },
	dept: { type: String, required: true, trim: true },
	description: { type: String, trim: true }
})

/**
 * 赛事信息
 */
Schemas[RACE] = new Schema({
	title: { type: String, required: true, trim: true },
	sponsor: { type: String, required: true, trim: true },
	year: { type: String, required: true, trim: true },
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
	tid: { type: String, required: true, trim: true },
	tname: { type: String, required: true, trim: true },
	score: { type: String, trim: true },
	uploaded: { type: Boolean, default: false },
	reviewed: { type: Boolean, default: false }
})

export default (name: string) => model(name, Schemas[name])