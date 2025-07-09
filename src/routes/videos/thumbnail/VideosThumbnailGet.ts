import { S3Handler } from "../../../middleware/s3/S3Handler.js"
import { MasterModel } from "../../../models/index.js"
import BaseRoute from "../../BaseRoute.js"
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import Request from "../../../request/Request.js";

export default class GetVideosThumbnail extends BaseRoute {

  protected model: MasterModel
  
  constructor(s3HandlerSingleton: S3Handler, model: MasterModel) {
    super(s3HandlerSingleton)
    this.model = model
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const { id } = req.query
    
    if (id === undefined) {
      res.sendStatus(400)
      return
    }
    
    const request = (req as any).requestObj as Request
    request.setData({ id })
    
    try {

      
      const result = (await this.model.videos.getVideoThumbnailById(request)).getData()
      if (result.src) {
        const fileName = result.src
        request.setData({
          s3Filename: fileName,
          s3Directory: 'video-thumbnail'
        })

        const handlerResponse = await this.s3Handler.getFile(request)
        if (handlerResponse.errorOccurred()) {
          handlerResponse.throw()
        }

        res
          .setHeader('Content-Type', 'image/png')
          .writeHead(200)
          .write((await (handlerResponse.getData() as GetObjectCommandOutput).Body.transformToByteArray()), 'binary', () => {
            res.end()
          });
        return
      } 

      res.sendStatus(404)
      return
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
  
}
