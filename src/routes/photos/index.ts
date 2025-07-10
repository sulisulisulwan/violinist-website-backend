import express from 'express'
import { s3HandlerSingleton } from "../../middleware/s3/S3Handler.js";
import generateRequest from "../generateRequest.js";
import GetPhotos from "./PhotosGet.js";
import PostPhotos from "./PhotosPost.js";
import DeletePhotos from './PhotosDelete.js';
import UploadTempHandler from '../../middleware/UploadTempHandler.js';
import config from '../../configPaths.js';
import PatchPhotos from './PhotosPatch.js';
import { masterModelSingleton } from '../../models/index.js'

const photosRoute = express.Router()
const photosUploadTemp = new UploadTempHandler(config)

const getPhotos = new GetPhotos(s3HandlerSingleton, masterModelSingleton)
const postPhotos = new PostPhotos(s3HandlerSingleton, masterModelSingleton, photosUploadTemp)
const deletePhotos = new DeletePhotos(s3HandlerSingleton, masterModelSingleton)
const patchPhotos = new PatchPhotos(masterModelSingleton)

photosRoute
  .get('/', generateRequest, async (req, res) => await getPhotos.exec(req, res))
  .post('/', generateRequest, photosUploadTemp.single('photo') as any, async (req, res) => await postPhotos.exec(req, res))
  .patch('/', generateRequest, async (req, res) => await patchPhotos.exec(req, res))
  .delete('/', generateRequest, async (req, res) => await deletePhotos.exec(req, res))


export default photosRoute