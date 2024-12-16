import { VideoDataAPI, VideoDataMYSQL } from "suli-violin-website-types/src";
import { S3Handler } from "../../middleware/S3Handler.js"
import UploadTempHandler from "../../middleware/UploadTempHandler.js"
import { MasterModel } from "../../models/index.js"
import BaseRoute from "../BaseRoute.js"
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";

class GetVideos extends BaseRoute {

  protected model: MasterModel
  protected uploadTemp: UploadTempHandler
  
  constructor(model: MasterModel) {
    super()
    this.model = model
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    try {
      const videoResults = (await this.model.videos.getAllVideos(request)).getData()
      const videoUrls: VideoDataAPI[] = videoResults[0].map((videoData: VideoDataMYSQL) => ({ id: videoData.id, youtubeCode: videoData.youtubeCode, caption: videoData.caption }))
      const resData = { results: videoUrls }
      res.status(200).json(resData)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
  
}

export default GetVideos