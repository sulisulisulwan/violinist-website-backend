import { S3Handler } from "../../middleware/s3/S3Handler.js"
import { MasterModel } from "../../models/index.js"
import Request from "../../request/Request.js";
import BaseRoute from "../BaseRoute.js"
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";

class PatchVideos extends BaseRoute {
  protected model: MasterModel
  
  constructor(s3HandlerSingleton: S3Handler, model: MasterModel) {
    super(s3HandlerSingleton)
    this.model = model
  }

  //TODO: THIS HASN'T BEEN COMPLETED. NEED TO ACCOUNT FOR CUSTOM THUMBNAIL CHANGE
  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { youtubeCode, thumbnail, caption, id } = req.body

    request.setData({ youtubeCode, thumbnail, caption, id })

    try {

      const insertId = (await this.model.videos.updateVideosRecordById(request)).getData()
       //TODO: INSERT S3 REQUEST HERE ??????
      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
    

  }
}

export default PatchVideos