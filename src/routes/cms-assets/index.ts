import express from 'express'
import generateRequest from '../generateRequest.js'

import GetCMSAssets from "./CMSAssetsGet.js";
import { masterModelSingleton } from '../../models/index.js'

const cmsAssetsRoute = express.Router()
const getCmsAssets = new GetCMSAssets(masterModelSingleton)

cmsAssetsRoute
  .get('/icons/:name', generateRequest, async (req, res) => await getCmsAssets.exec(req, res))

export default cmsAssetsRoute