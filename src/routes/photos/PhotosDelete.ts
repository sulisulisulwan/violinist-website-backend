import { S3Handler } from "../../middleware/S3Handler.js";
import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import UploadTempHandler from "../../middleware/UploadTempHandler.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";

export default class DeletePhotos extends BaseRoute {

  protected model: MasterModel
  protected uploadTemp: UploadTempHandler
  
  constructor(s3HandlerSingleton: S3Handler, masterModel: MasterModel) {
    super(s3HandlerSingleton)
    this.model = masterModel
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { id } = req.query
    request.setData({ id })

    try {
      const photoData = (await this.model.photos.getPhotosRecordById(request)).getData()
      request.setData({ 
        s3Filename: photoData[0][0].src,
        s3Directory: 'media-photo', 
      })
      const handlerResponse = await this.s3Handler.deleteFile(request)

      if (handlerResponse.errorOccurred()) {
        handlerResponse.throw()
      }

      request.setData({ id });
      (await this.model.photos.deletePhotosRecordById(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }

}