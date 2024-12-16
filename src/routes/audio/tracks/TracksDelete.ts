import BaseRoute from "../../BaseRoute.js";
import { MasterModel } from "../../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../../request/Request.js";

export default class DeleteTracks extends BaseRoute {
  
  protected model: MasterModel
  
  constructor(masterModel: MasterModel) {
    super()
    this.model = masterModel
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    request.setData({ id: req.query.id })
    try {
      (await this.model.audio.deletePlaylistTrack(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}