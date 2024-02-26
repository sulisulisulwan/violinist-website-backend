import * as express from 'express'
import BioModel from '../../../models/bio.js'
import Request from '../../../Request.js'
import MySQL from '../../../db/db.js'
import Config from '../../../config/Config.js'
import { BiographyItemAPI, BiographyItemMYSQL, LongShortFormBioMYSQL } from 'suli-violin-website-types/src'

const config = new Config()
const bioModel = new BioModel(new MySQL(config.getField('MYSQL_CONFIG')))

const ShortFormBio = express.Router()

ShortFormBio.get('/', async(req, res) => {
  console.log('[GET] /bio/shortForm')
  let request = new Request()

  try {
    const dbResult: BiographyItemMYSQL[] = (await bioModel.getShortForm(request)).getData()
    const bioData: BiographyItemAPI = {
      id: null,
      name: null,
      components: []
    }

    if (dbResult[0]) {
      bioData.id = dbResult[0].id
      bioData.name = dbResult[0].name
      bioData.components = JSON.parse(dbResult[0].components)
    }

    res.status(200).json(bioData)
  } catch(e) {
    res.sendStatus(500)
  }
    

})

ShortFormBio.patch('/', async (req, res) => {
  console.log('[PATCH] /bio/shortForm')
  let request = new Request()
  
  const { id } = req.body
  

  try {
    const result: LongShortFormBioMYSQL[] = (await bioModel.getShortFormId(request)).getData()

    if (result.length) {
      if (result[0].bioId === id) {
        res.sendStatus(304)
        return
      }
      
      request.setData(req.body);
      (await bioModel.updateShortFormById(request)).getData()

      res.sendStatus(200)
    }
  } catch(e) {
    console.log(e)
    res.sendStatus(400)
  }

})

export default ShortFormBio