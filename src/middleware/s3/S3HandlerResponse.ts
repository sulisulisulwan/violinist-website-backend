import {
  ServiceOutputTypes,
  PutObjectOutput,
  ListObjectsOutput,
  DeleteObjectOutput,
  GetObjectOutput,
} from '@aws-sdk/client-s3'

export default class S3HandlerResponse {

  protected error: {
    isError: boolean
    message: string
  }
  protected data: PutObjectOutput | ListObjectsOutput | DeleteObjectOutput | GetObjectOutput | null

  constructor() {
    this.error = {
      isError: false,
      message: ''
    }
    this.data = null
  }

  setData(data: ServiceOutputTypes): void {
    this.data = data as PutObjectOutput | ListObjectsOutput | DeleteObjectOutput | GetObjectOutput | null
  }

  getData(): any {
    return this.data
  }

  setIsError(msg: string): this {
    this.error.isError = true
    this.error.message = msg
    return this
  }

  errorOccurred(): boolean {
    return this.error.isError
  }

  throw(): void {
    throw new Error(this.error.message)
  }


}
