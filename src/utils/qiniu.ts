import qiniu from 'qiniu'
import { bucket, accessKey, secretKey, domain } from '../config/qiniu'

// 鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

// 获取上传token
export const getToken = (name = '') => {
  // name用于指定是否覆盖上传
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: name ? `${bucket}:${name}` : bucket,
    expires: 60
  })
  return putPolicy.uploadToken(mac)
}

// 获取下载链接
const bucketManager = new qiniu.rs.BucketManager(mac);
const deadline = Math.trunc(Date.now() / 1000) + 60; // 1分钟过期
export const getAuthUrl = (filename: string) => {
  return bucketManager.privateDownloadUrl(domain, filename, deadline)
}