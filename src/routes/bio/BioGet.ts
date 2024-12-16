import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import TransformBio from "../../transformers/TransformBio.js";
import Request from "../../request/Request.js";


export default class GetBio extends BaseRoute {

  protected model: MasterModel
  protected transformer: TransformBio
  
  constructor(model: MasterModel, transformer: TransformBio) {
    super()
    this.model = model
    this.transformer = transformer
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    const { id } = req.query
    
    if (id === undefined) {
      try {
        const bioResults = (await this.model.bio.getAll(request)).getData()
        const longFormBioResults  = (await await this.model.bio.getLongForm(request)).getData()
        const shortFormBioResults  = (await await this.model.bio.getShortForm(request)).getData()
        const transformed = this.transformer.transformGetWithoutId({ bioResults, longFormBioResults, shortFormBioResults})
        res.status(200).json(transformed)
      } catch(e) {
        (req as any).logger.log(e.stack)
        res.sendStatus(500)
      }
      return
    }

    try {
      request.setData(req.query)
      const dbResult = (await await this.model.bio.getById(request)).getData()
      const transformed = this.transformer.transformGetWithId(dbResult)
      res.status(200).json(transformed)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}