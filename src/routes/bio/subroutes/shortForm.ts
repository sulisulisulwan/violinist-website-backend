import * as express from 'express'
import BioModel from '../../../models/bio'
import Request from '../../../Request'
import MySQL from '../../../db/db'
import config from '../../../db/config'
import { BiographyItemAPI, BiographyItemMYSQL, LongShortFormBioMYSQL } from '../../../../../types/src'

const bioModel = new BioModel(new MySQL(config))

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