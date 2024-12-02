import * as express from 'express'
import AudioModel from '../../models/audio.js'
import * as fs from 'fs/promises'

import UploadHandler from '../../middleware/multer.js'
import db from '../../db/db.js'
import generateRequest from '../generateRequest.js'
import playlistsRoute from './playlists.js'
import config from '../../configPaths.js'

const audioRoute = express.Router()
audioRoute.use(playlistsRoute)

const audioModel = new AudioModel(db)
const audioUpload = new UploadHandler('audio', config)

audioRoute.get(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    const { id } = req.query

    
    try {
      if (id === undefined) {
        const data = (await audioModel.getAllAudioTrackRecords(request)).getData()
        res.status(200).json(data[0])
        return
      }
      
      request.setData({ id })
      
      const results = (await audioModel.getAudioTrackRecordById(request)).getData()
      
      // Check if audio track record exists in DB
      if (!results[0].length) {
        request.setError('404')
        throw request
      }

      // Check if file path returned from DB exists in file system
      const dir = await fs.readdir(config.getField('STORAGE_AUDIO_FILES'))
      const targetFileName = results[0][0].src
      const fileExists = dir.includes(targetFileName)

      if (!fileExists) {
        request.setData({ id })
        await audioModel.deleteAudioTrackRecordById(request)
        request.setError('404')
        throw request
      }
      
      res.status(200).sendFile(config.getField('STORAGE_AUDIO_FILES') + targetFileName)
      
    } catch(e) {
      (req as any).logger.log(e.stack)

      if (request.getError().message === '404') {
        res.sendStatus(404)
        return
      }
      res.sendStatus(400)
    }

  }
)

audioRoute.post(
  '/', 
  generateRequest,
  audioUpload.single('audio-track'), 
  async(req, res) => {
    const request = (req as any).requestObj
    
    const src = req.file.filename
    const { title, author } = req.body

    request.setData({ src, title, author, originalFileName: req.file.originalname })

    try {
      const insertId = (await audioModel.createAudioTrackRecord(request)).getData()[0].insertId
      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

audioRoute.patch(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    const { title, author, id } = req.body
    request.setData({ title, author, id })
    
    try {
      (await audioModel.updateAudioTrackRecordById(request)).getData()
      res.sendStatus(201)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

audioRoute.delete(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    const { id } = req.query
    request.setData({ id })

    try {
      const audioTrackData = (await audioModel.getAudioTrackRecordById(request)).getData()
      const src = audioTrackData[0][0].src
      
      const filePath = config.getField('STORAGE_AUDIO_FILES') + src
      await fs.unlink(filePath);
      request.setData({ id });
      (await audioModel.deleteAudioTrackRecordById(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

export default audioRoute