import * as express from 'express'
import BioModel from '../../../models/bio.js'
import Request from '../../../Request.js'
import MySQL from '../../../db/db.js'
import Config from '../../../config/Config.js'
import { BiographyItemAPI, BiographyItemMYSQL, LongShortFormBioMYSQL } from 'suli-violin-website-types/src'
import generateRequest from '../../generateRequest.js'
import TransformBio from '../../../transformers/TransformBio.js'

const config = new Config()
const bioModel = new BioModel(new MySQL(config.getField('MYSQL_CONFIG')))
const longFormBioRoute = express.Router()
const transformBio = new TransformBio()

longFormBioRoute.get(
  '/', 
  generateRequest, 
  async(req, res) => {
    const request = (req as any).requestObj
    try {
      const dbResult: BiographyItemMYSQL[] = (await bioModel.getLongForm(request)).getData()
      const bioData: BiographyItemAPI = transformBio.transformGetWithId(dbResult)
      res.status(200).json(bioData)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(500)
    }
  }
)

longFormBioRoute.patch(
  '/', 
  generateRequest,
  async (req, res) => {
    const request = (req as any).requestObj
    const { id } = req.body
    try {
      const result: LongShortFormBioMYSQL[] = (await bioModel.getLongFormId(request)).getData()
      if (!result.length) throw new Error('longformBio table must have a single row indicating the long form bio ID')

      if (result[0].bioId === id) {
        res.sendStatus(304)
        return
      }
      
      request.setData(req.body);
      (await bioModel.updateLongFormById(request)).getData()
      res.sendStatus(200)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
)

export default longFormBioRoute