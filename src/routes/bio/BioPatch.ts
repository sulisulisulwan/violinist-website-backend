import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";

export default class PatchBio extends BaseRoute {

  protected model: MasterModel
  
  constructor(model: MasterModel) {
    super()
    this.model = model
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    try {
      (await this.model.bio.updateById(request)).getData()
      res.sendStatus(200)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}