import * as express from 'express'
import { masterModelSingleton } from '../../models/index.js'
import GetMedia from './MediaGet.js'

import Audio from '../audio/index.js'
import Photos from '../photos/index.js'
import Videos from '../videos/index.js'

import generateRequest from '../generateRequest.js'
import TransformMedia from '../../transformers/TransformMedia.js'

const mediaRoute = express.Router()
const transformMedia = new TransformMedia()

const getMedia = new GetMedia(masterModelSingleton, transformMedia)


mediaRoute.use('/audio', Audio)
mediaRoute.use('/photos', Photos)
mediaRoute.use('/videos', Videos)
mediaRoute.get('/', generateRequest, async (req, res) => await getMedia.exec(req, res))

export default mediaRoute
