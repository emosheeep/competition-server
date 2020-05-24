import qiniu from 'qiniu'
import { bucket, accessKey, secretKey, domain } from '../config/qiniu'

// 鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)
const cdnManager = new qiniu.cdn.CdnManager(mac)

/**
 * 获取上传token
 * @param name 可选，用于指定是否覆盖上传
 */
export const getToken = function (name = ''): string {
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: name ? `${bucket}:${name}` : bucket,
    expires: 60
  })
  return putPolicy.uploadToken(mac)
}

/**
 * 获取下载链接
 * @param filename 文件名
 */
export const getFileUrl = function (filename: string): string {
  // deadline需要新建，否则每次返回的url是一样的
  const deadline = Math.trunc(Date.now() / 1000) + 60 // 1分钟过期
  return bucketManager.privateDownloadUrl(domain, filename, deadline)
}

/**
 * cdn 文件刷新
 * @param names 要刷新的文件名
 */
export const refreshUrl = function (names: string[] | string): Promise<unknown> {
  const urls: string[] = []
  if (Array.isArray(names)) { // 构造出url数组
    for (const name of names) {
      urls.push(`${domain}/${name}`)
    }
  } else {
    urls.push(`${domain}/${names}`)
  }
  return new Promise((resolve, reject) => {
    cdnManager.refreshUrls(urls, function (err, body) {
      if (err) {
        return reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

interface FileInfo {
  fsize: number
  hash: string;
  md5: string;
  mimeType: string;
  putTime: number;
  type: number
}
export const getFileInfo = function (name: string): Promise<FileInfo> {
  return new Promise<FileInfo>((resolve, reject) => {
    bucketManager.stat(bucket, name, function (err, body) {
      if (err) {
        return reject(err)
      } else {
        resolve(body)
      }
    })
  })
}
