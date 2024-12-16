import * as express from 'express'

import Bio from './bio/index.js'
import Blog from './blog/index.js'
import Calendar from './calendar/index.js'
import Contact from './contact/index.js'
import CmsAssets from './cms-assets/index.js'
import CmsAuth from './cms-auth/index.js'
import Media from './media/index.js'
import Photos from './photos/index.js'
import Audio from './audio/index.js'
import Video from './videos/index.js'

const router = express.Router()

router.use('/audio', Audio)
router.use('/bio', Bio)
router.use('/blog', Blog)
router.use('/calendar', Calendar)
router.use('/contact', Contact)
router.use('/cms-auth', CmsAuth)
router.use('/cms-assets', CmsAssets)
router.use('/media', Media)
router.use('/photos', Photos)
router.use('/videos', Video)

/* 
http://localhost:1337/api/*
*/
export default router