import BaseRoute from "../../BaseRoute.js";
import { MasterModel } from "../../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../../request/Request.js";

export default class PostPlaylists extends BaseRoute {
  
  protected model: MasterModel
  
  constructor(masterModel: MasterModel) {
    super()
    this.model = masterModel
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { name, playlistTracks } = req.body

    try {
      request.setData({ name, playlistTracks })
      const insertId = (await this.model.audio.createPlaylist(request)).getData()[0].insertId
      
      for (let i = 0; i < playlistTracks.length; i += 1) {
        request.setData({ position: i, playlistId: insertId, audioTrackId: playlistTracks[i].audioTrackId });
        (await this.model.audio.createPlaylistTrack(request)).getData()
      }

      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
}