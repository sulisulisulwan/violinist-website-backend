import express from 'express'
import { s3HandlerSingleton } from "../../middleware/s3/S3Handler.js";
import generateRequest from "../generateRequest.js";
import GetVideos from "./VideosGet.js";
import PostVideos from "./VideosPost.js";
import PatchVideos from './VideosPatch.js';
import DeleteVideos from './VideosDelete.js';
import { masterModelSingleton } from '../../models/index.js';
import UploadTempHandler from '../../middleware/UploadTempHandler.js';
import config from '../../configPaths.js';
import GetVideosValidateYoutubeCode from './validateYoutubeCode/VideosValidateYoutubeCode.js';

const videosRoute = express.Router()
const videosUploadTemp = new UploadTempHandler(config)

const getVideos = new GetVideos(masterModelSingleton)
const postVideos = new PostVideos(s3HandlerSingleton, masterModelSingleton, videosUploadTemp)
const patchVideos = new PatchVideos(s3HandlerSingleton, masterModelSingleton)
const deleteVideos = new DeleteVideos(s3HandlerSingleton, masterModelSingleton)
const getVideosValidateYoutubeCode = new GetVideosValidateYoutubeCode(masterModelSingleton)

videosRoute
  .get('/', generateRequest, async (req, res) => await getVideos.exec(req, res))
  .post('/', generateRequest, videosUploadTemp.single('video-thumbnail') as any, async (req, res) => await postVideos.exec(req, res))
  .patch('/', generateRequest, videosUploadTemp.single('video-thumbnail') as any, async (req, res) => await patchVideos.exec(req, res))
  .delete('/', generateRequest, async (req, res) => await deleteVideos.exec(req, res))
  .get('/validateYoutubeCode', generateRequest, async (req, res) => await getVideosValidateYoutubeCode.exec(req, res))

export default videosRoute