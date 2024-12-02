import express from 'express'
import generateRequest from '../generateRequest.js'
import path from 'path'
import url from 'url'
import fs from 'fs/promises'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const cmsAssetsRoute = express.Router()


cmsAssetsRoute.get(
  '/icons/:name', 
  generateRequest, 
  async (req, res) => {

    const request = (req as any).requestObj
    const filename = path.parse(req.originalUrl).base

    let filePath = ''
    
    try {
      if (filename) {
        filePath = path.resolve(__dirname, `../../../cmsAssets/icons/${filename}`)
        await fs.stat(filePath)
      } else {
        throw new Error()
      }
    } catch(e) {
      res.sendStatus(404)
      return
    }

    res.status(200).sendFile(filePath)

})


export default cmsAssetsRoute