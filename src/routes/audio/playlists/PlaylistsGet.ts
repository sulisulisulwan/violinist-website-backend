import BaseRoute from "../../BaseRoute.js";
import { MasterModel } from "../../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import { AudioTrackDataAPI, PlaylistItemAPI, PlaylistItemMYSQL, PlaylistTrackMYSQL } from "suli-violin-website-types/src/index.js";
import Request from "../../../request/Request.js";

export default class GetPlaylists extends BaseRoute {
  
  protected model: MasterModel
  
  constructor(masterModel: MasterModel) {
    super()
    this.model = masterModel
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request

    try {
      const playlistsData: PlaylistItemAPI[] = []

      if (req.query.hasOwnProperty('id')) {
        
        request.setData({ id: req.query.id })
        const playlistResult: PlaylistItemMYSQL[] = (await this.model.audio.getPlaylistById(request)).getData()

        if (playlistResult.length) {
          request.setData({ playlistId: req.query.id })
          const playlistTracksResult: PlaylistTrackMYSQL[] = (await this.model.audio.getAllPlaylistTracksByPlaylistId(request)).getData()
    
          const tracksSorted = playlistTracksResult.sort((a: PlaylistTrackMYSQL, b: PlaylistTrackMYSQL) => {
            return a.position - b.position
          })

          playlistsData.push({
            id: playlistResult[0].id,
            name: playlistResult[0].name,
            playlistTracks: tracksSorted
          })
        }
      } else {
        const allPlaylists = (await this.model.audio.getAllPlaylists(request)).getData()
        const audioData = (await this.model.audio.getAllAudioTrackRecords(request)).getData()

        for (let i = 0; i < allPlaylists.length; i++) {

          const playlistData = allPlaylists[i]
          request.setData({ playlistId: playlistData.id })
          const playlistTracks: PlaylistTrackMYSQL[] = (await this.model.audio.getAllPlaylistTracksByPlaylistId(request)).getData()

          const transformedPlaylists = playlistTracks.map((track: PlaylistTrackMYSQL) => {
            const audioTrack = audioData[0].find((audioTrack: AudioTrackDataAPI) => audioTrack.id === track.audioTrackId)

            return {
              id: track.id,
              audioTrackId: track.audioTrackId,
              playlistId: track.playlistId,
              author: audioTrack.author,
              title: audioTrack.title,
            }
          })
          
          const data: PlaylistItemAPI = {
            id: playlistData.id,
            name: playlistData.name,
            playlistTracks: transformedPlaylists
          }
          
          playlistsData.push(data)
        }

      }

      res.status(200).json(playlistsData)

    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
}