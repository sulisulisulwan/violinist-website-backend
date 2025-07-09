import { S3Handler } from "../../middleware/s3/S3Handler.js";
import S3HandlerResponse from "../../middleware/s3/S3HandlerResponse.js";
import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import Request from "../../request/Request.js";

export default class GetPhotos extends BaseRoute {
  
  protected model: MasterModel
  
  constructor(s3HandlerSingleton: S3Handler, masterModel: MasterModel) {
    super(s3HandlerSingleton)
    this.model = masterModel
  }
  
  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { id, isCropped, type, tag } = req.query
    request.setData({ id, isCropped, type, tag })

    try {

      if (tag) {
        return await this.getPhotosByTag(request, res)
      }

      if (id === undefined) {
        return type ? this.getPhotosByType(request, res) : this.handleNoIdeaNoType(request, res) 
      }
            
      request.setData({ id, isCropped: !!isCropped })
      const {
        src,
        croppedSrc
      } = await this.getPhotoDataById(request)

      request.setData({
        s3Filename: isCropped ? croppedSrc : src,
        s3Directory: 'media-photo'
      })

      const handlerResponse = await this.s3Handler.getFile(request)
      this.sendImage(res, handlerResponse)

    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }

  async handleNoIdeaNoType(request: Request, res: ExpressResponse) {
    const photos = (await (this.model.photos.getAllPhotoIds(request))).getData()
    res.status(200).json(photos[0])
  }

  async getPhotosByType(request: Request, res: ExpressResponse) {
    const photos = (await (this.model.photos.getPhotosRecordsByType(request))).getData()
    res.status(200).json(photos[0])
  }

  async getPhotosByTag(request: Request, res: ExpressResponse) {
    const photos = (await (this.model.photos.getPhotosByTag(request))).getData()
    console.log()
    res.status(200).json(photos)
  }

  async sendImage(res: ExpressResponse, handlerResponse: S3HandlerResponse) {
    res
      .setHeader('Content-Type', 'image/png')
      .writeHead(200)
      .write((await (handlerResponse.getData() as GetObjectCommandOutput).Body.transformToByteArray()), 'binary', () => {
        res.end()
      });
  }

  async getPhotoDataById(request: Request) {
    const results = (await this.model.photos.getPhotosRecordById(request)).getData()

    if (!results[0].length) {
      request.setError('404')
      throw request
    }

    return {
      src: results[0][0].src,
      croppedSrc: results[0][0].croppedSrc
    }
  }

}