import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ServiceOutputTypes,
  $Command,
  ServiceInputTypes,
  S3ClientResolvedConfigType,
} from '@aws-sdk/client-s3'
import Config from '@sulimantekalli/configlib'
import Request from '../../request/Request.js'
import fs from 'fs/promises'
import config from '../../configPaths.js'
import S3HandlerResponse from './S3HandlerResponse.js'
import S3HandlerAbstract from './S3HandlerAbstract.js'

type s3ClientConfigType = {
  region?: string
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
}

export class S3HandlerPROD implements S3HandlerAbstract {
  
  readonly config: Config
  protected S3: S3Client

  constructor(config: Config) {
    this.config = config
    const s3ClientConfig: s3ClientConfigType = {
      credentials: {
        accessKeyId: this.config.getField('S3_ACCESS_KEY'),
        secretAccessKey: this.config.getField('S3_SECRET_KEY')
      }
    }
    if (this.config.getField('S3_REGION')) {
      s3ClientConfig.region = this.config.getField('S3_REGION')
    }
    this.S3 = new S3Client(s3ClientConfig)
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
      return await this.sendCommand(
        new GetObjectCommand({
          Bucket: this.config.getField('S3_BUCKET'),
          Key: key
        })
      )
    }

    return new S3HandlerResponse().setIsError(`Key '${key}' does not exist!`)
  }

  public async uploadFile(request: Request) {

    const { s3Directory, s3Filename } = request.getData()
    const key = s3Directory + '/' + s3Filename
    const command = new PutObjectCommand({ 
      Bucket: this.config.getField('S3_BUCKET'), 
      Key: key, 
      Body: await fs.readFile(this.config.getField('UPLOAD_TEMP_DIRECTORY') + s3Filename)
    })
    
    return await this.sendCommand(command)
  }

  public async deleteFile(request: Request) {
    const { s3Directory, s3Filename } = request.getData()
    const key = s3Directory + '/' + s3Filename
    let keyExists = false

    try {
      keyExists = await this.checkIfExistsInBucket(key)
    } catch(e) {
      throw e
    }

    if (keyExists) {
      return await this.sendCommand(
        new DeleteObjectCommand({
          Bucket: this.config.getField('S3_BUCKET'),
          Key: key
        })
      )
    }

    return new S3HandlerResponse().setIsError(`Key '${key}' does not exist!`)
  }

  protected async sendCommand(
    command: 
      $Command<
        ServiceInputTypes, 
        ServiceOutputTypes, 
        S3ClientResolvedConfigType
      >
  ): Promise<S3HandlerResponse> {
    const handlerResponse = new S3HandlerResponse()
    try {
      const s3Response = await this.S3.send(command)
      handlerResponse.setData(s3Response) 
    } catch(e) {
      console.log(e)
      handlerResponse.setIsError(e.cause)
    }
    return handlerResponse
  }

  protected async checkIfExistsInBucket(key: string): Promise<boolean> {
    const command = new ListObjectsCommand({
      Bucket: this.config.getField('S3_BUCKET'),
    })
  
    try {
      const list = await this.S3.send(command)
      return list.Contents.some(file => {
        return file.Key === key
      })  
    } catch(e) {
      throw new Error(e.cause)
    }
  }


}
