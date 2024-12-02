import ShopModel from '../../models/shop'
import db from '../../db/db'
import UploadHandler from '../../middleware/multer'
import config from '../../configPaths.js'

const shopModel = new ShopModel(db)
const photosUpload = new UploadHandler('photos', config)