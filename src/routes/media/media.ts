import * as express from 'express'
import AudioModel from '../../models/audio.js'
import VideosModel from '../../models/videos.js'
import PhotosModel from '../../models/photos.js'

import Audio from './subroutes/audio.js'
import Photos from './subroutes/photos.js'
import Videos from './subroutes/videos.js'
import MySQL from '../../db/db.js'
import Config from '../../config/Config.js'

import generateRequest from '../generateRequest.js'
import TransformMedia from '../../transformers/TransformMedia.js'

const config = new Config()
const audioModel = new AudioModel(new MySQL(config.getField('MYSQL_CONFIG')))
const videosModel = new VideosModel(new MySQL(config.getField('MYSQL_CONFIG')))
const photosModel = new PhotosModel(new MySQL(config.getField('MYSQL_CONFIG')))
const Media = express.Router()
const transformMedia = new TransformMedia()

Media.use('/audio', Audio)
Media.use('/photos', Photos)
Media.use('/videos', Videos)
Media.get(
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

export default Media
