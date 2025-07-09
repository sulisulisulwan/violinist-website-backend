import { S3Handler } from "../middleware/s3/S3Handler.js";
import S3HandlerResponse from "../middleware/s3/S3HandlerResponse.js"

import Request from "../request/Request.js";

interface iCrudActions  {
  get: 'getFile',
  post: 'uploadFile',
  delete: 'deleteFile'
}

class BaseRoute {


  protected s3Handler: S3Handler
  protected crudActions: iCrudActions = {
    get: 'getFile',
    post: 'uploadFile',
    delete: 'deleteFile'
  }
  
  constructor(s3HandlerSingleton?: S3Handler) {
    this.s3Handler = s3HandlerSingleton || null
    this.crudActions = {
      get: 'getFile',
      post: 'uploadFile',
      delete: 'deleteFile'
    }
  }
  

  async makeS3HandlerRequest (request: Request, crudAction: string): Promise<S3HandlerResponse> {
    if (this.s3Handler === null) {
      throw new Error(`Cannot make an S3 Handler request.  Route '${this.constructor.name}' does not have an s3Handler`)
    }

    const action = this.crudActions[crudAction as keyof iCrudActions]
    const exec = this.s3Handler[action as keyof S3Handler] as Function
    const handlerResponse = await exec(request)

    if (handlerResponse.errorOccurred()) {
      handlerResponse.throw()
    }
    return handlerResponse
  
  }
}

export default BaseRoute