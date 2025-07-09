import express from 'express'
import { s3HandlerSingleton } from "../../middleware/s3/S3Handler.js";
import generateRequest from "../generateRequest.js";
import GetAudio from "./AudioGet.js";
import PostAudio from "./AudioPost.js";
import PatchAudio from './AudioPatch.js';
import DeleteAudio from './AudioDelete.js';

import GetPlaylists from "./playlists/PlaylistsGet.js";
import PostPlaylists from "./playlists/PlaylistsPost.js";
import PatchPlaylists from './playlists/PlaylistsPatch.js';
import DeletePlaylists from './playlists/PlaylistsDelete.js';

import GetTracks from "./tracks/TracksGet.js";
import PostTracks from "./tracks/TracksPost.js";
import DeleteTracks from './tracks/TracksDelete.js';
import UploadTempHandler from '../../middleware/UploadTempHandler.js';
import config from '../../configPaths.js';
import { masterModelSingleton } from '../../models/index.js'

const audioRoute = express.Router()
const audioUploadTemp = new UploadTempHandler(config)

const getAudio = new GetAudio(s3HandlerSingleton, masterModelSingleton)
const postAudio = new PostAudio(s3HandlerSingleton, masterModelSingleton, audioUploadTemp)
const patchAudio = new PatchAudio(masterModelSingleton)
const deleteAudio = new DeleteAudio(s3HandlerSingleton, masterModelSingleton)

const getPlaylists = new GetPlaylists(masterModelSingleton)
const postPlaylists = new PostPlaylists(masterModelSingleton)
const patchPlaylists = new PatchPlaylists(masterModelSingleton)
const deletePlaylists = new DeletePlaylists(masterModelSingleton)

const getTracks = new GetTracks(masterModelSingleton)
const postTracks = new PostTracks(masterModelSingleton)
const deleteTracks = new DeleteTracks(masterModelSingleton)

audioRoute
  .get('/', generateRequest, async (req, res) => await getAudio.exec(req, res))
  .post('/', generateRequest, audioUploadTemp.single('audio-track'), async (req, res) => await postAudio.exec(req, res))
  .patch('/', generateRequest, async (req, res) => await patchAudio.exec(req, res))
  .delete('/', generateRequest, async (req, res) => await deleteAudio.exec(req, res))
  
  .get('/playlists', generateRequest, async (req, res) => await getPlaylists.exec(req, res))
  .post('/playlists', generateRequest, async (req, res) => await postPlaylists.exec(req, res))
  .patch('/playlists', generateRequest, async (req, res) => await patchPlaylists.exec(req, res))
  .delete('/playlists', generateRequest, async (req, res) => await deletePlaylists.exec(req, res))
  
  .get('/playlists/tracks', generateRequest, async (req, res) => await getTracks.exec(req, res))
  .post('/playlists/tracks', generateRequest, async (req, res) => await postTracks.exec(req, res))
  .delete('/playlists/tracks', generateRequest, async (req, res) => await deleteTracks.exec(req, res))
export default audioRoute