import express from 'express'
import generateRequest from '../generateRequest.js'
import PostContact from './ContactPost.js'
import { masterModelSingleton } from '../../models/index.js'
import { EmailHandler } from '../../middleware/EmailHandler.js'
import config from '../../configPaths.js'
import nodemailer from 'nodemailer'

const contactRoute = express.Router()
const emailHandler = new EmailHandler(config, nodemailer)
const postContact = new PostContact(masterModelSingleton, emailHandler)

contactRoute.post('/', generateRequest, async (req, res) => await postContact.exec(req, res))

export default contactRoute