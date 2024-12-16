import BaseRoute from "../../BaseRoute.js";
import { MasterModel } from "../../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import { PlaylistTrackAPI, PlaylistTrackMYSQL } from "suli-violin-website-types/src/index.js";
import Request from "../../../request/Request.js";

export default class PatchPlaylists extends BaseRoute {
  
  protected model: MasterModel
  
  constructor(masterModel: MasterModel) {
    super()
    this.model = masterModel
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {

    const request = (req as any).requestObj as Request
    const { id, name, playlistTracks } = req.body
    request.setData({ id, name } )

    try {
      (await this.model.audio.updatePlaylistById(request)).getData()
      request.setData({ playlistId: id });
      const allTracksInDbForPlaylist: PlaylistTrackMYSQL[] = (await this.model.audio.getAllPlaylistTracksByPlaylistId(request)).getData()

      const newPlaylistTrackMap = playlistTracks.reduce((map: Record<string, boolean>, track: PlaylistTrackAPI) => {
        map[track.id] = true
        return map
      }, {})

      const tracksToDelete = allTracksInDbForPlaylist.filter((trackInDb: PlaylistTrackMYSQL) => {
        return !newPlaylistTrackMap[trackInDb.id]
      })

      for(let i = 0; i < tracksToDelete.length; i++) {
        const track = tracksToDelete[i]
        request.setData({ id: track.id });
        (await this.model.audio.deletePlaylistTrack(request)).getData()
      }

      for (let i = 0; i < playlistTracks.length; i++) {
        const track = playlistTracks[i]
        if (track.id === null) {
          request.setData({
            audioTrackId: track.audioTrackId,
            playlistId: id,
            position: i
          });
          (await this.model.audio.createPlaylistTrack(request)).getData()
          continue 
        }

        request.setData({
          id: track.id,
          position: i
        });
        (await this.model.audio.updatePlaylistTrackPositions(request)).getData()
      }

      res.sendStatus(200)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}