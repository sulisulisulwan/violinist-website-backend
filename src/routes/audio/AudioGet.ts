import { S3Handler } from "../../middleware/S3Handler.js";
import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import Request from "../../request/Request.js";

export default class GetAudio extends BaseRoute {
  
  protected model: MasterModel
  
  constructor(s3HandlerSingleton: S3Handler, model: MasterModel) {
    super(s3HandlerSingleton)
    this.model = model
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { id } = req.query

    
    try {
      if (id === undefined) {
        const data = (await this.model.audio.getAllAudioTrackRecords(request)).getData()
        res.status(200).json(data[0])
        return
      }
      
      request.setData({ id })
      
      const results = (await this.model.audio.getAudioTrackRecordById(request)).getData()
      
      request.setData({
        s3Filename: results[0][0].src,
        s3Directory: 'audio-track'
      })

      const handlerResponse = await this.s3Handler.getFile(request)

      if (handlerResponse.errorOccurred()) {
        handlerResponse.throw()
      }
      
      res
        .setHeader('Content-Type', 'audio/mpeg')
        .writeHead(200)
        .write((await (handlerResponse.getData() as GetObjectCommandOutput).Body.transformToByteArray()), 'binary', () => {
          res.end()
        });
      return
      
    } catch(e) {
      (req as any).logger.log(e.stack)

      if (request.getError().message === '404') {
        res.sendStatus(404)
        return
      }
      res.sendStatus(400)
    }

  }
}