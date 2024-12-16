import BaseRoute from "../../BaseRoute.js";
import { MasterModel } from "../../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import { LongShortFormBioMYSQL } from "suli-violin-website-types/src/index.js";
import Request from "../../../request/Request.js";

export default class ShortFormBioPatch extends BaseRoute {

  protected model: MasterModel
  
  constructor(model: MasterModel) {
    super()
    this.model = model
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { id } = req.body
    
    try {
      const result: LongShortFormBioMYSQL[] = (await this.model.bio.getShortFormId(request)).getData()

      if (!result.length) throw new Error('shortFormBio table must have a single row indicating the short form bio ID')
      if (result[0].bioId === id) {
        res.sendStatus(304)
        return
      }

      request.setData(req.body);
      (await this.model.bio.updateShortFormById(request)).getData()

      res.sendStatus(200)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}