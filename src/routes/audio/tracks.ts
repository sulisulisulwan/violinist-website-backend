import * as express from 'express'
import AudioModel from '../../models/audio.js'

import db from '../../db/db.js'
import generateRequest from '../generateRequest.js'

const tracksRoute = express.Router()
const audioModel = new AudioModel(db)

tracksRoute.get(
  '/playlists/tracks', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    try {
      let data = []
      if (req.query.hasOwnProperty('id')) {
        request.setData({ id: req.query.id })
        data = (await audioModel.getPlaylistTrackById(request)).getData()[0]
      } else if (req.query.hasOwnProperty('playlistId')) {
        request.setData({ id: req.query.playlistId })
        data = (await audioModel.getAllPlaylistTracksByPlaylistId(request)).getData()[0]
      }
      res.status(200).json(data)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

tracksRoute.post(
  '/playlists/tracks',
  generateRequest, 
  async(req, res) => {
    const request = (req as any).requestObj
    request.setData({
      audioTrackId: req.body.audioTrackData, 
      playlistId: req.body.playlistId, 
      position: req.body.position
    })
    try {
      const insertId = (await audioModel.createPlaylistTrack(request)).getData()[0].insertId
      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

tracksRoute.delete(
  '/playlists/tracks', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    request.setData({ id: req.query.id })
    try {
      (await audioModel.deletePlaylistTrack(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

export default tracksRoute