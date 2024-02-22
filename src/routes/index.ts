import * as express from 'express'

import Contact from './contact/contact'
import Media from './media/media'
import Bio from './bio/bio'
import Calendar from './calendar/calendar'
import Blog from './blog/blog'

const router = express.Router()

router.use('/contact', Contact)
router.use('/media', Media)
router.use('/bio', Bio)
router.use('/calendar', Calendar)
router.use('/blog', Blog)

/* 
http://localhost:1337/api/*
*/
export default router