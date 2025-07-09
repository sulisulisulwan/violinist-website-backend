import { S3HandlerDEV } from "./S3HandlerDEV.js"
import { S3HandlerPROD } from "./S3HandlerPROD.js"
import config from '../../configPaths.js'
import S3HandlerAbstract from "./S3HandlerAbstract.js"
import path from 'path'
import url from 'url'
import fs from 'fs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const backendDir = path.resolve(__dirname, '../../..')

type S3Handler = S3HandlerAbstract

const isDev = config.getField('IS_DEV')
const s3HandlerSingleton = isDev ? new S3HandlerDEV(config) : new S3HandlerPROD(config)


if (isDev) {
  const dirs = fs.readdirSync(backendDir) 
  if (!dirs.some(dir => dir === '_s3files')) {
    console.log('Creating _s3files directory for development environment')
    fs.mkdirSync(path.resolve(backendDir, '_s3files'))
    fs.mkdirSync(path.resolve(backendDir, '_s3files/media-photo'))
    fs.mkdirSync(path.resolve(backendDir, '_s3files/video-thumbnail'))
  }
}

export { 
  s3HandlerSingleton,
  S3Handler
}