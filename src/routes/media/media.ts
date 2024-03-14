import * as express from 'express'
import AudioModel from '../../models/audio.js'
import VideosModel from '../../models/videos.js'
import PhotosModel from '../../models/photos.js'

import Audio from '../audio/audio.js'
import Photos from '../photos/photos.js'
import Videos from '../videos/videos.js'
import db from '../../db/db.js'

import generateRequest from '../generateRequest.js'
import TransformMedia from '../../transformers/TransformMedia.js'

const audioModel = new AudioModel(db)
const videosModel = new VideosModel(db)
const photosModel = new PhotosModel(db)
const mediaRoute = express.Router()
const transformMedia = new TransformMedia()

mediaRoute.use('/audio', Audio)
mediaRoute.use('/photos', Photos)
mediaRoute.use('/videos', Videos)
mediaRoute.get(
  '/', 
  generateRequest,
  async (req, res) => {
  const request = (req as any).requestObj

  try {

    const photoResults =  (await photosModel.getAllPhotoIds(request)).getData()
    const videoResults = (await videosModel.getAllVideos(request)).getData()
    const audioResults = (await audioModel.getAllAudioTrackRecords(request)).getData()
    const playlistResults = (await audioModel.getAllPlaylists(request)).getData()

    const resData = await transformMedia.transformGet(photoResults, videoResults, audioResults, playlistResults, request, audioModel)

    res.status(200).json(resData)

  } catch(e) {
    (req as any).logger.log(e.stack)
    res.sendStatus(400)
  }
})

export default mediaRoute
