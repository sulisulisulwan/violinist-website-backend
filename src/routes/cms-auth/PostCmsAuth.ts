import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import crypto from 'crypto'

export default class PostCmsAuth extends BaseRoute {

  protected model: MasterModel
  
  constructor(model: MasterModel) {
    super()
    this.model = model
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj

    try {
      const { username, password } = req.body
      request.setData({ username })
  
      const result = (await this.model.cmsAuth.getUserByUsername(request)).getData()
      
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
}