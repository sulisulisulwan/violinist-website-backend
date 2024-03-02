import * as express from 'express'
import Config from '../../config/Config.js'
import BioModel from '../../models/bio.js'
import MySQL from '../../db/db.js'
import LongFormBio from './subroutes/longForm.js'
import ShortFormBio from './subroutes/shortForm.js'
import generateRequest from '../generateRequest.js'
import TransformBio from '../../transformers/TransformBio.js'

const config = new Config()
const bioModel = new BioModel(new MySQL(config.getField('MYSQL_CONFIG')))
const transformBio = new TransformBio()

const bioRoute = express.Router()
bioRoute.use('/longForm', LongFormBio)
bioRoute.use('/shortForm', ShortFormBio)


bioRoute.get(
  '/', 
  generateRequest, 
  async (req, res) => {
    const request = (req as any).requestObj
    const { id } = req.query
    
    if (id === undefined) {
      try {
        const bioResults = (await bioModel.getAll(request)).getData()
        const longFormBioResults  = (await bioModel.getLongForm(request)).getData()
        const shortFormBioResults  = (await bioModel.getShortForm(request)).getData()
        const transformed = transformBio.transformGetWithoutId({ bioResults, longFormBioResults, shortFormBioResults})
        res.status(200).json(transformed)
      } catch(e) {
        (req as any).logger.log(e.stack)
        res.sendStatus(500)
      }
      return
    }

    try {
      request.setData(req.query)
      const dbResult = (await bioModel.getById(request)).getData()
      const transformed = transformBio.transformGetWithId(dbResult)
      res.status(200).json(transformed)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }

  }
)

bioRoute.post(
  '/', 
  generateRequest, 
  transformBio.transformPost, 
  async (req, res) => {
    const request = (req as any).requestObj
    try {
      const { insertId } = (await bioModel.create(request)).getData()
      res.location(`/bio/${insertId}`)
      res.status(201).json({ insertId })
    } catch (e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

bioRoute.patch(
  '/', 
  generateRequest, 
  transformBio.transformPatch, 
  async (req, res) => {
    const request = (req as any).requestObj
    try {
      (await bioModel.updateById(request)).getData()
      res.sendStatus(200)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

bioRoute.delete(
  '/', 
  async (req, res) => {
    const request = (req as any).requestObj
    const idToDelete = Number(req.query.id)
    try {
      const longFormData = (await bioModel.getLongFormId(request)).getData()
      // Update the longForm bio row to null
      if (longFormData[0].length) {
        let longFormBio = longFormData[0][0]
        if (longFormBio.id === idToDelete) {
          request.setData({ id: null });
          (await bioModel.updateLongFormById(request)).getData()
        }
      } 
      request.setData(req.query);
      (await bioModel.deleteById(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)


export default bioRoute