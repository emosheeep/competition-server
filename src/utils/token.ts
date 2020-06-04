import dayjs from 'dayjs'
import { sign } from 'jsonwebtoken'
import secretKey from '../config/tokenKey'

// 控制普通token，客户端过期后无需再次登录
export const getToken = function () {
  return sign({
    exp: dayjs().add(30, 'minute').valueOf() // 三十分钟刷新一次
  }, secretKey)
}

// 控制客户端最长登陆时间，超时重新登录
export const getRefreshToken = function (payload: any) {
  return sign({
    user: payload,
    exp: dayjs().add(7, 'day').valueOf() // 七天重新登陆一次
  }, secretKey)
}
