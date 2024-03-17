import * as express from 'express'
import AudioModel from '../../models/audio.js'

import db from '../../db/db.js'
import { AudioTrackDataAPI, PlaylistItemAPI, PlaylistItemMYSQL, PlaylistTrackAPI, PlaylistTrackMYSQL } from 'suli-violin-website-types/src'
import generateRequest from '../generateRequest.js'
import tracksRoute from './tracks.js'

const playlistsRoute = express.Router()
playlistsRoute.use(tracksRoute)

const audioModel = new AudioModel(db)

playlistsRoute.get(
  '/playlists', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj

    try {
      const playlistsData: PlaylistItemAPI[] = []

      if (req.query.hasOwnProperty('id')) {
        
        request.setData({ id: req.query.id })
        const playlistResult: PlaylistItemMYSQL[] = (await audioModel.getPlaylistById(request)).getData()

        if (playlistResult.length) {
          request.setData({ playlistId: req.query.id })
          const playlistTracksResult: PlaylistTrackMYSQL[] = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()
    
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
        const allPlaylists = (await audioModel.getAllPlaylists(request)).getData()
        const audioData = (await audioModel.getAllAudioTrackRecords(request)).getData()

        for (let i = 0; i < allPlaylists.length; i++) {

          const playlistData = allPlaylists[i]
          request.setData({ playlistId: playlistData.id })
          const playlistTracks: PlaylistTrackMYSQL[] = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()

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
)

playlistsRoute.post(
  '/playlists', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    const { name, playlistTracks } = req.body

    try {
      request.setData({ name, playlistTracks })
      const insertId = (await audioModel.createPlaylist(request)).getData()[0].insertId
      
      for (let i = 0; i < playlistTracks.length; i += 1) {
        request.setData({ position: i, playlistId: insertId, audioTrackId: playlistTracks[i].audioTrackId });
        (await audioModel.createPlaylistTrack(request)).getData()
      }

      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

playlistsRoute.patch(
  '/playlists', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    const { id, name, playlistTracks } = req.body
    request.setData({ id, name } )

    try {
      (await audioModel.updatePlaylistById(request)).getData()
      request.setData({ playlistId: id });
      const allTracksInDbForPlaylist: PlaylistTrackMYSQL[] = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()

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
        (await audioModel.deletePlaylistTrack(request)).getData()
      }

      for (let i = 0; i < playlistTracks.length; i++) {
        const track = playlistTracks[i]
        if (track.id === null) {
          request.setData({
            audioTrackId: track.audioTrackId,
            playlistId: id,
            position: i
          });
          (await audioModel.createPlaylistTrack(request)).getData()
          continue 
        }

        request.setData({
          id: track.id,
          position: i
        });
        (await audioModel.updatePlaylistTrackPositions(request)).getData()
      }

      res.sendStatus(200)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

playlistsRoute.delete(
  '/playlists', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    request.setData({ id: req.query.id })
    try {
      (await audioModel.deletePlaylistByID(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

