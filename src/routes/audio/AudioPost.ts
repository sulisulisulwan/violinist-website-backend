import { S3Handler } from "../../middleware/S3Handler.js";
import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import UploadTempHandler from "../../middleware/UploadTempHandler.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";
import fs from 'fs/promises'
import config from "../../configPaths.js";

export default class PostAudio extends BaseRoute {

  protected model: MasterModel
  protected uploadTemp: UploadTempHandler
  
  constructor(s3HandlerSingleton: S3Handler, model: MasterModel, photosUploadTemp: UploadTempHandler) {
    super(s3HandlerSingleton)
    this.model = model
    this.uploadTemp = photosUploadTemp
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    
    const request = (req as any).requestObj as Request
    
    const src = req.file.filename
    const { title, author } = req.body
    
    try {
      request.setData({ 
        src, 
        title, 
        author, 
        originalFileName: req.file.originalname ,
        s3Filename: req.file.filename,
        s3Directory: 'audio-track',
      })

      /**
       * Upload to S3
       */

      const handlerResponse = await this.s3Handler.uploadFile(request)

      if (handlerResponse.errorOccurred()) {
        handlerResponse.throw()
      }

      /**
       * Update MySQL with audio file retrieval data
       */
      const insertId = (await this.model.audio.createAudioTrackRecord(request)).getData()[0].insertId

      /**
       * Delete temp file
       */
      await fs.unlink(config.getField('UPLOAD_TEMP_DIRECTORY') + req.file.filename)

      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}