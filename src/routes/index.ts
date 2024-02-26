import * as express from 'express'

import Bio from './bio/bio.js'
import Blog from './blog/blog.js'
import Calendar from './calendar/calendar.js'
import Contact from './contact/contact.js'
import CmsAuth from './cms-auth/cms-auth.js'
import Media from './media/media.js'

const router = express.Router()

router.use('/bio', Bio)
router.use('/blog', Blog)
router.use('/calendar', Calendar)
router.use('/contact', Contact)
router.use('/cms-auth', CmsAuth)
router.use('/media', Media)

/* 
http://localhost:1337/api/*
*/
export default router