import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import path from 'path'
import url from 'url'
import fs from 'fs/promises'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export default class GetCMSAssets extends BaseRoute {

  protected model: MasterModel
  
  constructor(model: MasterModel) {
    super()
    this.model = model
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const filename = path.parse(req.originalUrl).base

    let filePath = ''
    
    try {
      if (filename) {
        filePath = path.resolve(__dirname, `../../../cmsAssets/icons/${filename}`)
        await fs.stat(filePath)
      } else {
        throw new Error()
      }
    } catch(e) {
      res.sendStatus(404)
      return
    }

    res.status(200).sendFile(filePath)
  }
}