/**
 * 数据库基础操作封装
 * 包装的目的在于简化外部调用时的错误处理逻辑
 * 外部仅需要在发生错误时以500拒绝请求即可，错误由内部处理，便于排查定位
 * 同时还要保证成功时，外部能顺利获取数据
 */
import mongoose, { Document, Mongoose, ClientSession } from 'mongoose'
import consola from 'consola'
import config from '../config/dbConfig'
import getDocument from './model' // mongoose文档模型

const { url, options } = config

// 连接mongoDB
const connect = () => new Promise<Mongoose>((resolve, reject) => {
	mongoose.connect(url, options).then(client => {
		resolve(client)
	}).catch(e => {
		consola.error(`[Mongo Connect Error] ${e.message}`)
		reject(e)
	})
})

/**
 * 插入数据
 * @param name   集合名
 * @param data   插入的数据
 */
export const insert = function (name: string, data: object, options: object) {
	const model = getDocument(name)
	return new Promise<any>(async (resolve, reject) => {
		try {
			await connect()
			const _ = await model.collection.insertOne(data, options)
			resolve(_)
		} catch (e) {
			consola.error(`[Mongo Insert Error] ${e.message}`)
			reject(e)
		}
	})
}

/**
 * 更新数据
 * @param name 数据库
 * @param condition  条件
 * @param data   数据
 */
export const upsert = function (name: string, condition: object, data: object) {
	const model = getDocument(name)
	return new Promise<any>(async (resolve, reject) => {
		try {
			await connect()
			const _ = await model.updateOne(condition, data, { upsert: true })
			resolve(_)
		} catch (e) {
			consola.error(`[Mongo Update Error] ${e.message}`)
			reject(e)
		}
	})
}

/**
 * 查询数据
 * @param name        集合名
 * @param condition   条件
 */
export const find = function(name: string, condition = {}){
	const model = getDocument(name)
	return new Promise<Document[]>(async (resolve, reject) => {
		try {
			await connect()
			const values = await model.find(condition)
			resolve(values)
		} catch (e) {
			consola.error(`[Mongo Find Error] ${e.message}`)
			reject(e)
		}
	})
}

/**
 * 删除数据
 * @param dbname 数据库
 * @param table  集合名
 * @param condition   条件
 */
export const remove = function(name: string, condition = {}, options = {}) {
	const model = getDocument(name)
	return new Promise<any>(async (resolve, reject) => {
		try {
			await connect()
			const _ = await model.deleteOne(condition, options)
			resolve(_)
		} catch (e) {
			consola.error(`[Mongo Detele Error] ${e.message}`)
			reject(e)
		}
	})
}

/**
 * 事务操作
 * @param executor 传入session用于事务的函数，返回Promise
 */
export const transaction = function (executor: (session: ClientSession) => Promise<any>) {
	return new Promise<any[]>(async (resolve, reject) => {
		const client = await connect()
		const session = await client.startSession() // 启动会话
		try {
			session.startTransaction() // 开启事务
			const result = await executor(session)
			await session.commitTransaction() // 提交事务
			resolve(result)
		} catch (e) {
			reject(e)
			consola.error(`[Mongo Transaction Error] ${e.message}`)
			await session.abortTransaction() // 回滚事务
		} finally {
			session.endSession() // 结束会话
		}
	})
}