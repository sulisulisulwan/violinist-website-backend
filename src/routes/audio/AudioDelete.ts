import BaseRoute from "../BaseRoute.js";
import { S3Handler } from "../../middleware/S3Handler.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";

export default class PatchAudio extends BaseRoute {

  protected model: MasterModel
  
  constructor(s3Handler: S3Handler, model: MasterModel) {
    super(s3Handler)
    this.model = model
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { id } = req.query
    request.setData({ id })

    try {
      const audioTrackData = (await this.model.audio.getAudioTrackRecordById(request)).getData()
      const src = audioTrackData[0][0].src
      
      /**
       * Delete from S3
       */

      request.setData({
        s3Filename: src,
        s3Directory: 'audio-track'
      })

      await this.s3Handler.deleteFile(request)

      /**
       * Delete from MySQL
       */
      request.setData({ id });
      await this.model.audio.deleteAudioTrackRecordById(request)


      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
}