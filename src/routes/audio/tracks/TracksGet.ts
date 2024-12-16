import BaseRoute from "../../BaseRoute.js";
import { MasterModel } from "../../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../../request/Request.js";

export default class GetTracks extends BaseRoute {
  
  protected model: MasterModel
  
  constructor(masterModel: MasterModel) {
    super()
    this.model = masterModel
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    try {
      let data = []
      if (req.query.hasOwnProperty('id')) {
        request.setData({ id: req.query.id })
        data = (await this.model.audio.getPlaylistTrackById(request)).getData()[0]
      } else if (req.query.hasOwnProperty('playlistId')) {
        request.setData({ id: req.query.playlistId })
        data = (await this.model.audio.getAllPlaylistTracksByPlaylistId(request)).getData()[0]
      }
      res.status(200).json(data)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
}