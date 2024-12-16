import BaseRoute from "../../BaseRoute.js";
import { MasterModel } from "../../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import { BiographyItemAPI, BiographyItemMYSQL } from "suli-violin-website-types/src/index.js";
import TransformBio from "../../../transformers/TransformBio.js";
import Request from "../../../request/Request.js";

export default class ShortFormBioGet extends BaseRoute {

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
    try {
      const dbResult: BiographyItemMYSQL[] = (await this.model.bio.getShortForm(request)).getData()
      const bioData: BiographyItemAPI = this.transformer.transformGetWithId(dbResult)

      res.status(200).json(bioData)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(500)
    }
  }
}