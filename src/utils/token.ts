import jwt from 'jsonwebtoken'
import consola from 'consola'

const secret = 'competitoin-system' // 加密密钥

export function sign (content: string | {}) {
  return jwt.sign(content, secret, {
    expiresIn: 3600 * 24 * 7  // 七天过期
  })
}

export function verify (token: string) {
  try{
    return jwt.verify(token, secret)
  } catch (e) {
    consola.error(e.message)
    return null
  }
}
