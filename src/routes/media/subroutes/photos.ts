import * as express from 'express'
import Request from '../../../Request.js'
import * as fs from 'fs/promises'
import UploadHandler from '../../../middleware/multer.js'
import PhotosModel from '../../../models/photos.js'
import MySQL from '../../../db/db.js'
import Config from '../../../config/Config.js'

const config = new Config()
const Photos = express.Router()
const photosModel = new PhotosModel(new MySQL(config.getField('MYSQL_CONFIG')))
const photosUpload = new UploadHandler('photos', config)

Photos.get('/', async (req, res) => {
  console.log('[GET] /media/photos')
  let request = new Request()
  
  const { id, isCropped } = req.query

  if (id === undefined) {
    res.sendStatus(400)
    return
  }

  request.setData({ id, isCropped: !!isCropped })
  try {

    
    const results = (await photosModel.getPhotosRecordById(request)).getData()

    // Check if photo record exists in DB
    if (!results[0].length) {
      request.setError('404')
      throw request
    }

    

    // Check if file path returned from DB exists in file system
    const dir = await fs.readdir(config.getField('STORAGE_PHOTO_FILES'))
    const targetFileName = results[0][0].src
    const targetCroppedFileName = results[0][0].croppedSrc

    const fileExists = dir.includes(targetFileName)
    const croppedFileExists = dir.includes(targetCroppedFileName)

    if (!fileExists || !croppedFileExists) {
      request.setData({ id });
      (await photosModel.deletePhotosRecordById(request)).getData()
      request.setError('404')
      throw request
    }

    res.status(200).sendFile(config.getField('STORAGE_PHOTO_FILES') + (isCropped ? targetCroppedFileName : targetFileName))    

  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

Photos.post('/', photosUpload.single('photo'), async(req, res) => {
  console.log('[POST] /media/photos')
  let request = new Request()
 
  request.setData({
    photoCred: req.body.photoCred,
    originalFileName: req.file.originalname,
    src: req.file.filename,
    croppedSrc: req.file.filename, // TODO: temporary
    originalCroppedFileName: req.file.filename, // TODO: temporary
  })

  try {
    const insertId = (await photosModel.createPhoto(request)).getData()[0].insertId
    res.status(201).json({ insertId })
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

Photos.patch('/', async(req, res) => {
  console.log('[PATCH] /media/photos')
  let request = new Request()
  const { photoCred, id } = req.body
  request.setData({ photoCred, id })

  try {
    const insertId = (await photosModel.updatePhotosRecordById(request)).getData()
    res.status(201).json({ insertId })
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }

})

Photos.delete('/', async(req, res) => {
  console.log('[DELETE] /media/photos')
  let request = new Request()
  const { id } = req.query
  request.setData({ id })

  try {
    const photoData = (await photosModel.getPhotosRecordById(request)).getData()
    const src = photoData[0][0].src
    const croppedSrc = photoData[0][0].croppedSrc

    const filePath = config.getField('STORAGE_PHOTO_FILES') + src
    // const croppedFilePath = config.STORAGE_PHOTO_FILES + croppedSrc
    await fs.unlink(filePath);
    // await fs.unlink(croppedFilePath);

    request.setData({ id });
    (await photosModel.deletePhotosRecordById(request)).getData()
    res.sendStatus(204)
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

export default Photos