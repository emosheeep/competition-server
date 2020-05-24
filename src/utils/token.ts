import jwt from 'jsonwebtoken'

const secret = 'competitoin-system' // 加密密钥

export function sign (content: string | object | Buffer) {
  return jwt.sign(content, secret, {
    expiresIn: 3600 * 24 * 7 // 七天过期
  })
}

export function verify (token: string) {
  try {
    return jwt.verify(token, secret)
  } catch (e) {
    return null
  }
}
