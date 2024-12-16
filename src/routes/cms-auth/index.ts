import express from 'express'
import generateRequest from '../generateRequest.js'

import PostCmsAuth from "./PostCmsAuth.js";
import { masterModelSingleton } from '../../models/index.js'

const cmsAuthRoute = express.Router()
const postCmsAuth = new PostCmsAuth(masterModelSingleton)

cmsAuthRoute
  .post('/', generateRequest, async (req, res) => await postCmsAuth.exec(req, res))

export default cmsAuthRoute