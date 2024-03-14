import * as express from 'express'
import Config from '../../config/Config'
import ShopModel from '../../models/shop'
import db from '../../db/db'
import UploadHandler from '../../middleware/multer'

const config = new Config()
const shopModel = new ShopModel(db)
const photosUpload = new UploadHandler('photos', config)