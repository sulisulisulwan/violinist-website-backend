import * as express from 'express'

import Bio from './bio/bio.js'
import Blog from './blog/blog.js'
import Calendar from './calendar/calendar.js'
import Contact from './contact/contact.js'
import CmsAuth from './cms-auth/cms-auth.js'
import Media from './media/media.js'
import Photos from './photos/photos.js'
import Audio from './audio/audio.js'
import Video from './videos/videos.js'

const router = express.Router()

router.use('/audio', Audio)
router.use('/bio', Bio)
router.use('/blog', Blog)
router.use('/calendar', Calendar)
router.use('/contact', Contact)
router.use('/cms-auth', CmsAuth)
router.use('/media', Media)
router.use('/photos', Photos)
router.use('/videos', Video)

/* 
http://localhost:1337/api/*
*/
export default router