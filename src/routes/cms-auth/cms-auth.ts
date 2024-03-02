import express from 'express'
import CmsAuthModel from '../../models/cms-auth.js'
import Config from '../../config/Config.js'
import MySQL from '../../db/db.js'
import crypto from 'crypto'
import generateRequest from '../generateRequest.js'

const CmsAuth = express.Router()

const config = new Config()
const cmsAuthModel = new CmsAuthModel(new MySQL(config.getField('MYSQL_CONFIG')))

CmsAuth.post(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj

    try {
      const { username, password } = req.body
      request.setData({ username })
  
      const result = (await cmsAuthModel.getUserByUsername(request)).getData()
      
      if (!result.length) {
        res.status(201).json({ result: 'unauthorized' })
        return
      }
  
      const { salt, passwordHash } = result[0]
      const hash = crypto.createHash('sha256')
      const attempedPasswordHash = await hash.update(password + salt).digest('hex')
  
      if (attempedPasswordHash !== passwordHash) {
        res.status(201).json({ result: 'unauthorized' })
        return
      }
      
      res.status(201).json({ result: 'authorized' })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)


export default CmsAuth