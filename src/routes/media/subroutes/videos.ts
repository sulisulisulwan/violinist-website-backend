import * as express from 'express'
import VideosModel from '../../../models/videos'
import Request from '../../../Request'
import * as path from 'path'
import * as fs from 'fs/promises'
import UploadHandler from '../../../middleware/multer'
import MySQL from '../../../db/db'
import config from '../../../db/config'

const Videos = express.Router()
const videosModel = new VideosModel(new MySQL(config))
const videoUpload = new UploadHandler('videos/thumbnails')

Videos.get('/thumbnail', async(req, res) => {

  const { id } = req.query
  const request = new Request()
  request.setData({ id })

  try {
    const result = (await videosModel.getVideoThumbnailById(request)).getData()
    if (result[0].length) {
      const fileName = result[0][0].thumbnail
      const filePath = path.resolve(__dirname + '../uploads/videos/thumbnails', fileName)
  
      res.status(200).sendFile(filePath)
      return
    } 

    res.sendStatus(404)
    return
  } catch(e) {
    console.log(e)
    res.sendStatus(400)
  }

})

Videos.post('/', videoUpload.single('video-thumbnail'), async(req, res) => {
  console.log('[POST] /media/videos')
  let request = new Request()
  
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
      await fs.writeFile(path.resolve(__dirname + '/uploads/videos/thumbnails', filename), buffer)
    } else {
      filename = req.file.filename
    }
  } catch(e) {
    console.error(e)
    res.sendStatus(400)
    return
  }

  request.setData({
    youtubeCode,
    caption,
    thumbnail: filename
  })

  try {
    (await videosModel.createVideo(request)).getData()
    res.sendStatus(201)

  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

Videos.patch('/', videoUpload.single('video-thumbnail'), async(req, res) => {
  console.log('[PATCH] /media/videos')
  let request = new Request()
  const { photoCred, id } = req.body

  console.log(req.file)

  request.setData({ photoCred, id })

  res.sendStatus(200)
  return

  try {
    // const insertId = (await videosModel.updateVideosRecordById(request)).getData()
    // res.status(201).json({ insertId })
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
  

})

Videos.delete('/', async (req, res) => {
  console.log('[DELETE] /media/videos')
  let request = new Request()
  const { id } = req.query
  request.setData({ id })


  try {
    const videoData = (await videosModel.getVideoThumbnailById(request)).getData()
    const thumbnail = videoData[0][0].thumbnail

    const filePath = path.resolve(__dirname + '/uploads/videos/thumbnails/', thumbnail)
    await fs.unlink(filePath);
    request.setData({ id });
    (await videosModel.deleteVideoById(request)).getData()
    res.sendStatus(204)
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }

})

export default Videos