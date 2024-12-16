import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";
import TransformMedia from '../../transformers/TransformMedia.js'

export default class GetMedia extends BaseRoute {

  protected model: MasterModel
  protected transformer: TransformMedia
  
  constructor(model: MasterModel, transformer: TransformMedia) {
    super()
    this.model = model
    this.transformer = transformer
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request

    try {
  
      const photoResults =  (await this.model.photos.getAllPhotoIds(request)).getData()
      const videoResults = (await this.model.videos.getAllVideos(request)).getData()
      const audioResults = (await this.model.audio.getAllAudioTrackRecords(request)).getData()
      const playlistResults = (await this.model.audio.getAllPlaylists(request)).getData()
  
      const resData = await this.transformer.transformGet(photoResults, videoResults, audioResults, playlistResults, request, this.model)
  
      res.status(200).json(resData)
  
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}