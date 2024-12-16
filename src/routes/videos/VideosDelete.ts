import { S3Handler } from "../../middleware/S3Handler.js"
import { MasterModel } from "../../models/index.js"
import Request from "../../request/Request.js";
import BaseRoute from "../BaseRoute.js"
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";

class DeleteVideos extends BaseRoute {
  protected model: MasterModel
  
  constructor(s3HandlerSingleton: S3Handler, model: MasterModel) {
    super(s3HandlerSingleton)
    this.model = model
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { id } = req.query
    request.setData({ id })


    try {
      const videoData = (await this.model.videos.getVideoThumbnailById(request)).getData()
      const thumbnail = videoData.src

      /**
       * Delete from S3
       */

      request.setData({
        s3Filename: thumbnail,
        s3Directory: 'video-thumbnail'
      })

      const handlerResponse = await this.s3Handler.deleteFile(request)

      if (handlerResponse.errorOccurred()) {
        handlerResponse.throw()
      }


      /**
       * Update MySQL
       */

      request.setData({ id });
      await this.model.videos.deleteVideoById(request)
      request.setData({ id: videoData.thumbnail_id })
      await this.model.photos.deletePhotosRecordById(request)
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
}

export default DeleteVideos