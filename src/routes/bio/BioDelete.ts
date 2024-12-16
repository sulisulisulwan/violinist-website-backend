import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";

export default class DeleteBio extends BaseRoute {

  protected model: MasterModel
  
  constructor(model: MasterModel) {
    super()
    this.model = model
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const idToDelete = Number(req.query.id)
    try {
      const longFormData = (await this.model.bio.getLongFormId(request)).getData()
      // Update the longForm bio row to null
      if (longFormData[0].length) {
        let longFormBio = longFormData[0][0]
        if (longFormBio.id === idToDelete) {
          request.setData({ id: null });
          (await this.model.bio.updateLongFormById(request)).getData()
        }
      } 
      request.setData(req.query);
      (await this.model.bio.deleteById(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}