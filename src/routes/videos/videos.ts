import * as express from 'express'
import VideosModel from '../../models/videos.js'
import * as fs from 'fs/promises'
import UploadHandler from '../../middleware/multer.js'
import db from '../../db/db.js'
import Config from '../../config/Config.js'
import generateRequest from '../generateRequest.js'
import { VideoDataAPI, VideoDataMYSQL } from 'suli-violin-website-types/src/index.js'
import PhotosModel from '../../models/photos.js'

const config = new Config()
const videosRoute = express.Router()
const videosModel = new VideosModel(db)
const photosModel = new PhotosModel(db)
const videoUpload = new UploadHandler('videos/thumbnails', config)

videosRoute.get(
  '/',
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    try {
      const videoResults = (await videosModel.getAllVideos(request)).getData()
      const videoUrls: VideoDataAPI[] = videoResults[0].map((videoData: VideoDataMYSQL) => ({ id: videoData.id, youtubeCode: videoData.youtubeCode, caption: videoData.caption }))
      const resData = { results: videoUrls }
      res.status(200).json(resData)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

videosRoute.get(
  '/thumbnail', 
  generateRequest,
  async(req, res) => {
    const { id } = req.query
    
    if (id === undefined) {
      res.sendStatus(400)
      return
    }
    
    const request = (req as any).requestObj
    request.setData({ id })
    
    try {
      const result = (await videosModel.getVideoThumbnailById(request)).getData()
      // const result = (await photosModel.getPhotosRecordById(request)).getData()
      console.log(id)
      if (result[0].length) {
        const fileName = result[0][0].src
        const filePath = config.getField('STORAGE_PHOTO_FILES') + fileName
        
        res.status(200).sendFile(filePath)
        return
      } 

      res.sendStatus(404)
      return
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
)

videosRoute.post(
  '/', 
  generateRequest,
  videoUpload.single('video-thumbnail'), 
  async(req, res) => {
    const request = (req as any).requestObj
    
    const { youtubeCode, caption, thumbnailUploadPath } = req.body
    const uploadPath = JSON.parse(thumbnailUploadPath)

    let filename = ''

    try {
      if (uploadPath.currPref === 'defaultYT') {
        // pull the default thumbnail from youtube
        const result = await fetch(uploadPath.defaultYT)
        const arrayBuffer = await result.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        filename = videoUpload.createFileName(caption, 'jpeg')
        await fs.writeFile(config.getField('STORAGE_PHOTO_FILES') + filename, buffer)
      } else {
        filename = req.file.filename
      }
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
      return
    }

    try {
      request.setData({
        alt: caption,
        src: filename,
        type: 'video-thumbnail'
      })
    
      const result = (await photosModel.createPhoto(request)).getData()

      const insertId = result[0].insertId
  
      request.setData({
        youtubeCode,
        caption,
        thumbnail_id: insertId
      })

      await videosModel.createVideo(request)
      res.sendStatus(201)

    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

videosRoute.patch(
  '/', 
  generateRequest,
  videoUpload.single('video-thumbnail'), 
  async(req, res) => {
    let request = (req as any).requestObj
    const { photoCred, id } = req.body

    request.setData({ photoCred, id })

    res.sendStatus(200)
    return

    try {
      // const insertId = (await videosModel.updateVideosRecordById(request)).getData()
      // res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
    

  }
)

videosRoute.delete(
  '/', 
  generateRequest,
  async (req, res) => {
    const request = (req as any).requestObj
    const { id } = req.query
    request.setData({ id })


    try {
      const videoData = (await videosModel.getVideoThumbnailById(request)).getData()
      const thumbnail = videoData[0][0].src

      const filePath = config.getField('STORAGE_PHOTO_FILES') + thumbnail
      await fs.unlink(filePath);
      request.setData({ id });
      (await videosModel.deleteVideoById(request)).getData()
      request.setData({ id: videoData.thumbnail_id })
      (await photosModel.deletePhotosRecordById(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
)

videosRoute.get(
  '/validateYoutubeCode', 
  generateRequest,
  async(req, res) => {
    const { youtubeCode } = req.query
    let isValid = true

    try {

      try {
        const result = await fetch(`https://img.youtube.com/vi/${youtubeCode}/0.jpg`)
        if (result.status !== 200) {
          isValid = false
        }
      } catch(e) {
        isValid = false
      }

      res.status(200).json({ isValid })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }


  }
)

export default videosRoute