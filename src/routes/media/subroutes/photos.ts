import * as express from 'express'
import * as fs from 'fs/promises'
import UploadHandler from '../../../middleware/multer.js'
import PhotosModel from '../../../models/photos.js'
import MySQL from '../../../db/db.js'
import Config from '../../../config/Config.js'
import generateRequest from '../../generateRequest.js'

const config = new Config()
const Photos = express.Router()
const photosModel = new PhotosModel(new MySQL(config.getField('MYSQL_CONFIG')))
const photosUpload = new UploadHandler('photos', config)

Photos.get(
  '/', 
  generateRequest,
  async (req, res) => {
    const request = (req as any).requestObj
    const { id, isCropped } = req.query

    if (id === undefined) {
      const photos = (await (photosModel.getAllPhotoIds(request))).getData()
      res.status(200).json(photos[0])
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

    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

Photos.post(
  '/', 
  generateRequest,
  photosUpload.single('photo'), 
  async(req, res) => {
    const request = (req as any).requestObj
  
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
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

Photos.patch(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    const { photoCred, id } = req.body
    request.setData({ photoCred, id })

    try {
      const insertId = (await photosModel.updatePhotosRecordById(request)).getData()
      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
)

Photos.delete(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
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
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

export default Photos