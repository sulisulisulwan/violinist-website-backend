import config from "../../configPaths.js";
import { S3Handler } from "../../middleware/s3/S3Handler.js";
import UploadTempHandler from "../../middleware/UploadTempHandler.js";
import { MasterModel } from "../../models/index.js";
import BaseRoute from "../BaseRoute.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import fs from 'fs/promises'
import Request from "../../request/Request.js";


class PostVideos extends BaseRoute {
  protected model: MasterModel
  protected uploadTemp: UploadTempHandler
  
  constructor(s3HandlerSingleton: S3Handler, model: MasterModel, videosUploadTemp: UploadTempHandler) {
    super(s3HandlerSingleton)
    this.model = model
    this.uploadTemp = videosUploadTemp
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    
    const { youtubeCode, caption, thumbnailUploadPath } = req.body
    
    const uploadPath = JSON.parse(thumbnailUploadPath)

    let filename = ''

    try {
      if (uploadPath.currPref === 'defaultYT') {
        // pull the default thumbnail from youtube
        const result = await fetch(uploadPath.defaultYT)
        const arrayBuffer = await result.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        filename = this.uploadTemp.createFileName(caption, 'jpeg')
      } else {
        filename = req.file.filename
      }
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
      return
    }


    try {
      

    
      /**
       * Add temp file to to S3
       */
      request.setData({
        s3Filename: `${filename}`,
        s3Directory: 'photos'
      })
      await this.s3Handler.uploadFile(request)
      
      /**
       * Add image data to MySQL
       * 1. add image data to photos table
       * 1. add meta data of video to videos table
       */

      request.setData({
        alt: caption,
        type: 'video-thumbnail',
        src: filename,
        croppedSrc: filename,
        photoCred: '',
        originalFileName: req.file ? req.file.originalname : '',
        originalCroppedFileName: req.file ? req.file.filename : '',
      })

      const result = (await this.model.photos.createPhoto(request)).getData()
      const insertId = result[0].insertId
  
      request.setData({
        youtubeCode,
        caption,
        thumbnail_id: insertId
      })

      await this.model.videos.createVideo(request)

      /**
       * Clean up temp file
       */

      await this.deleteTempFile(req.file.filename)

      res.sendStatus(201)

    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }

  async deleteTempFile(filename: string) {
    await fs.unlink(config.getField('UPLOAD_TEMP_DIRECTORY') + filename)
  }
}

export default PostVideos