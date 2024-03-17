import Config from '@sulimantekalli/configlib'
import ShopModel from '../../models/shop'
import db from '../../db/db'
import UploadHandler from '../../middleware/multer'
import configPaths from '../../configPaths.js'

const shopModel = new ShopModel(db)
const photosUpload = new UploadHandler('photos', new Config(configPaths))