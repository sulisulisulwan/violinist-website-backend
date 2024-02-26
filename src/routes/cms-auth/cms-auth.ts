import express from 'express'
import Request from '../../Request.js'
import CmsAuthModel from '../../models/cms-auth.js'
import Config from '../../config/Config.js'
import MySQL from '../../db/db.js'
import crypto from 'crypto'

const CmsAuth = express.Router()

const config = new Config()
const cmsAuthModel = new CmsAuthModel(new MySQL(config.getField('MYSQL_CONFIG')))

CmsAuth.post('/', async(req, res) => {
  console.log('[POST] /cms-auth ')
  const request = new Request()
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
  
})


export default CmsAuth