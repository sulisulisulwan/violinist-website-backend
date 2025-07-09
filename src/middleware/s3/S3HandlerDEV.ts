import Config from '@sulimantekalli/configlib'
import Request from '../../request/Request.js'
import fsPromise from 'fs/promises'
import fs from 'fs'
import config from '../../configPaths.js'
import S3HandlerResponse from './S3HandlerResponse.js'
import S3HandlerAbstract from './S3HandlerAbstract.js'
import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const s3FilesDir = path.resolve(__dirname, '../../../_s3files')

export class S3HandlerDEV implements S3HandlerAbstract {
  
  readonly config: Config

  constructor(config: Config) {
    this.config = config
  }


  public async getFile(request: Request) {

    const { s3Directory, s3Filename } = request.getData()
    let keyExists = false
    const key = s3Directory + '/' + s3Filename
    try {
      keyExists = await this.checkIfExistsInBucket(key)
    } catch(e) {
      console.log('')
      throw new Error(e.cause)
    }

    if (keyExists) {
      return await this.sendCommand(async () => {
        const respObj: {
          Body: {
            data: Buffer
            transformToByteArray: Function
          }
        } = {
          Body: {
            data: fs.readFileSync(s3FilesDir + '/' + key),
            transformToByteArray: () => {
              return respObj.Body.data
            }
          }
        }
        
        return respObj
      })
    }

    return new S3HandlerResponse().setIsError(`Key '${key}' does not exist!`)
  }

  public async uploadFile(request: Request) {

    const { s3Directory, s3Filename } = request.getData()
    const key = s3Directory + '/' + s3Filename
    
    return await this.sendCommand(async () => {
      const tempFile = config.getField('UPLOAD_TEMP_DIRECTORY') + s3Filename
      const newS3FilePath = s3FilesDir + '/' + key
      await fsPromise.copyFile(tempFile, newS3FilePath)
    })
  }

  public async deleteFile(request: Request) {
    const { s3Directory, s3Filename } = request.getData()
    const key = s3Directory + '/' + s3Filename
    let keyExists = false

    const s3FilePath = s3FilesDir + '/' + key

    try {
      keyExists = await this.checkIfExistsInBucket(key)
    } catch(e) {
      throw e
    }

    if (keyExists) {
      return await this.sendCommand(async () => {
        fs.unlinkSync(s3FilePath)
      })
    }

    return new S3HandlerResponse().setIsError(`Key '${key}' does not exist!`)
  }

  protected async sendCommand(command: Function): Promise<S3HandlerResponse> {
    const handlerResponse = new S3HandlerResponse()
    try {
      const s3Response = await command()
      handlerResponse.setData(s3Response) 
    } catch(e) {
      console.log(e)
      handlerResponse.setIsError(e.cause)
    }
    return handlerResponse
  }

  protected async checkIfExistsInBucket(key: string): Promise<boolean> {
    const pathToCheck = s3FilesDir + '/' + key
    try {
      await fsPromise.stat(pathToCheck)
      return true
    } catch(e) {
      throw new Error(`File "${key}" not found`)
    }
  }

}
