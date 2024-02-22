import * as express from 'express'
import BioModel from '../../models/bio'
import Request from '../../Request'
import { getDoubleQuotesEscapedString } from '../utils'
import MySQL from '../../db/db'
import config from '../../db/config'
import LongFormBio from './subroutes/longForm'
import ShortFormBio from './subroutes/shortForm'
import { BiographyAPIData, BiographyItemAPI, BiographyItemMYSQL, ParsedHTMLComponent } from 'suli-violin-website-types/src'

const Bio = express.Router()
Bio.use('/longForm', LongFormBio)
Bio.use('/shortForm', ShortFormBio)

const bioModel = new BioModel(new MySQL(config))

Bio.get('/', async (req, res) => {
  console.log('[GET] /bio/')
  let request = new Request()
  
  const { id } = req.query
  
  if (id === undefined) {
    
    try {
      const bioResults = (await bioModel.getAll(request)).getData()
      const longFormBioResults  = (await bioModel.getLongForm(request)).getData()
      const shortFormBioResults  = (await bioModel.getShortForm(request)).getData()

      const resData: BiographyAPIData = {
        longFormId: longFormBioResults[0]?.id || null,
        shortFormId: shortFormBioResults[0]?.id || null,
        results: bioResults.map((bioItem: BiographyItemMYSQL) => {
          const parsed = JSON.parse(bioItem.components)
          return {
            id: bioItem.id,
            name: bioItem.name,
            components: parsed
          }
        })
      }

      res.status(200).json(resData)

    } catch(e) {
      console.log(e)
      res.sendStatus(500)
    }

    return
  }

  try {
    request.setData(req.query)
    
    const dbResult = (await bioModel.getById(request)).getData()

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
    res.sendStatus(400)
  }

})

Bio.post('/', async (req, res) => {
  console.log('[POST] /bio/')
  let request = new Request()

  const { name, components } = req.body
  
  const doubleQuotesEscapedComponents = components.map((component: ParsedHTMLComponent) => { 
    component.content = getDoubleQuotesEscapedString(component.content)
    return component
  })
  
  const data = {
    name,
    components: JSON.stringify(doubleQuotesEscapedComponents)
  }

  request.setData(data)

  try {
    const { insertId } = (await bioModel.create(request)).getData()

    res.location(`/bio/${insertId}`)
    res.status(201).json({ insertId })
  } catch (e) {
    console.log(e)
    res.sendStatus(400)
  }
})

Bio.patch('/', async (req, res) => {
  console.log('[PATCH] /bio/')
  let request = new Request()
  
  const { id, name, components } = req.body
  
  const doubleQuotesEscapedComponents = components.map((component: ParsedHTMLComponent) => { 
    component.content = getDoubleQuotesEscapedString(component.content)
    return component
  })
  
  const data: BiographyItemMYSQL = {
    id,
    name,
    components: JSON.stringify(doubleQuotesEscapedComponents)
  }

  request.setData(data)

  try {
    (await bioModel.updateById(request)).getData()

    res.sendStatus(200)
  } catch(e) {
    console.log(e)
    res.sendStatus(400)
  }

})

Bio.delete('/', async (req, res) => {
  console.log('[DELETE] /bio/')
  let request = new Request()

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
    console.error(e)
    res.sendStatus(400)
  }
})


export default Bio